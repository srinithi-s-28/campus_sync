import Stripe from "stripe"
import UserModel from "../models/User.Models.js"
import dotenv from "dotenv"

dotenv.config();
const getStripeClient = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY
  if (!apiKey) {
    throw new Error("STRIPE_SECRET_KEY is missing")
  }
  return new Stripe(apiKey)
}

const getClientUrl = () => {
  const rawUrl = process.env.CLIENT_URL || ""
  const fallback = "http://localhost:5173"
  try {
    const url = new URL(rawUrl || fallback)
    return url.origin
  } catch {
    return fallback
  }
}

const CREDIT_MAP = {
  49: 5,
  99: 12,
  199: 30,
  499: 90,
  999: 200,
}

export const createCreditsOrder = async (req, res) => {
  try {
    const userId = req.userId
    const { amount } = req.body
    const amountValue = Number(amount)

    // validate plan
    if (!Number.isFinite(amountValue) || !CREDIT_MAP[amountValue]) {
      return res.status(400).json({
        message: "Invalid credit plan",
      })
    }

    const credits = CREDIT_MAP[amountValue]

    const clientUrl = getClientUrl()
    // create stripe session
    const stripe = getStripeClient()
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],

      success_url: `${clientUrl}/payment-success`,
      cancel_url: `${clientUrl}/payment-failed`,

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `${credits} Credits`,
            },
            unit_amount: amountValue * 100, // INR → paise
          },
          quantity: 1,
        },
      ],

      metadata: {
        userId,
        credits,
        amount: amountValue,
      },
    })

    return res.json({
      url: session.url,
    })
  } catch (error) {
    console.error("Stripe session error:", error)
    res.status(500).json({
      message: "Failed to create payment session",
    })
  }
}







export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"]
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    if (!webhookSecret) {
      console.error("❌ STRIPE_WEBHOOK_SECRET is missing")
      return res.status(500).send("Webhook secret missing")
    }

    if (!sig) {
      console.error("❌ Missing stripe-signature header")
      return res.status(400).send("Missing signature")
    }

    const stripe = getStripeClient()
    event = stripe.webhooks.constructEvent(
      req.body, // raw body
      sig,
      webhookSecret
    )
  } catch (error) {
    console.log("❌ Webhook signature error:", error.message)
    return res.status(400).send("Webhook Error")
  }

  // ✅ handle checkout success
  if (event.type === "checkout.session.completed") {
    const session = event.data.object

    // Only add credits when payment is actually paid
    if (session.payment_status !== "paid") {
      console.log("⚠️ Checkout completed but payment not paid yet:", session.id)
      return res.status(200).json({ received: true })
    }

    const userId = session.metadata?.userId
    const creditsToAdd = Number(session.metadata?.credits)

    if (!userId || !creditsToAdd) {
      return res.status(400).json({ message: "Invalid metadata" })
    }

    try {
      await UserModel.findByIdAndUpdate(
        userId,
        {
          $inc: { credits: creditsToAdd },
          $set: { isCreditAvailable: true },
        },
        { new: true }
      )

      console.log(`✅ Credits added: ${creditsToAdd} to user ${userId}`)
    } catch (err) {
      console.error("DB update error:", err)
      return res.status(500).json({ message: "DB update failed" })
    }
  }

  res.status(200).json({ received: true })
}
