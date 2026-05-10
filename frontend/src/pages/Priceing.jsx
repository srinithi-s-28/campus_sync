import React, { useState } from "react"
import { motion } from "framer-motion"
import { Diamond, Check, Loader2 } from "lucide-react"
import axios from "axios"
import { serverUrl } from "../main"
import { useTheme } from "../context/ThemeContext"

const plans = [
  { credits: 5, price: 49, popular: false },
  { credits: 12, price: 99, popular: false },
  { credits: 30, price: 199, popular: false },
  { credits: 90, price: 499, popular: true },
  { credits: 200, price: 999, popular: false },
]

const Pricing = () => {
  const { isDark } = useTheme()
  const [loadingPlan, setLoadingPlan] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")

  const handleBuy = async (plan) => {
    try {
      setLoadingPlan(plan.credits)
      setErrorMessage("")

      const res = await axios.post(
        `${serverUrl}/api/credits/create-order`,
        { amount: plan.price },
        { withCredentials: true }
      )

      if (res.data?.url) {
        window.location.href = res.data.url
        return
      }

      setErrorMessage("Unable to start checkout. Please try again.")
    } catch (error) {
      console.error("Stripe checkout error:", error)
      setErrorMessage(
        error?.response?.data?.message || "Failed to start payment"
      )
    } finally {
      setLoadingPlan(null)
    }
  }

  /* ---------- THEME ---------- */
  const pageBg = isDark
    ? "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white"
    : "bg-gradient-to-br from-white via-blue-50 to-white text-slate-900"

  const headerText = isDark ? "text-blue-200/80" : "text-slate-600"
  const errorText = isDark ? "text-red-300" : "text-red-600"

  const cardBase = isDark
    ? "bg-white/5 border-blue-500/20"
    : "bg-white border-slate-200 shadow-lg"

  const popularCard = isDark
    ? "bg-gradient-to-br from-blue-500/15 to-indigo-500/10 border-blue-400/50"
    : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 shadow-xl"

  const featureText = isDark ? "text-blue-100/90" : "text-slate-600"

  const secondaryBtn = isDark
    ? "bg-white/5 border-blue-500/30 text-blue-200 hover:bg-blue-500/10"
    : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100"

  return (
    <div className={`min-h-screen py-16 px-4 ${pageBg}`}>
      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Buy <span className="text-blue-500">Credits</span>
        </h1>
        <p className={headerText}>
          Generate AI notes, diagrams, charts & PDFs using credits.
          Choose a plan that fits your study needs.
        </p>

        {errorMessage && (
          <p className={`mt-4 text-sm ${errorText}`}>
            {errorMessage}
          </p>
        )}
      </div>

      {/* PLANS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.credits}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            whileHover={{ y: -6, scale: 1.02 }}
            className={`relative rounded-2xl p-6 border backdrop-blur-xl transition ${
              plan.popular ? popularCard : cardBase
            }`}
          >
            {/* POPULAR */}
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs bg-blue-500 text-white shadow">
                Most Popular
              </div>
            )}

            {/* ICON */}
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/30 to-indigo-600/20 border border-blue-400/40">
                <Diamond className="w-6 h-6 text-cyan-400" />
              </div>
            </div>

            {/* CREDITS */}
            <h3 className="text-2xl font-bold text-center mb-2">
              {plan.credits} Credits
            </h3>

            {/* PRICE */}
            <p className="text-center text-3xl font-bold mb-6">
              ₹{plan.price}
            </p>

            {/* FEATURES */}
            <ul className={`space-y-2 mb-6 text-sm ${featureText}`}>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Generate AI Notes
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Diagrams & Charts
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Export PDF
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Exam Revision Mode
              </li>
            </ul>

            {/* BUY BUTTON */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBuy(plan)}
              disabled={loadingPlan === plan.credits}
              className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition ${
                plan.popular
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                  : secondaryBtn
              }`}
            >
              {loadingPlan === plan.credits ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Buy Credits"
              )}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Pricing