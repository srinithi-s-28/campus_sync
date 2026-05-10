import React from "react"
import { motion } from "framer-motion"
import {
  Shield,
  FileText,
  Search,
  Upload,
  CheckCircle,
  MessageCircle,
  Sparkles,
} from "lucide-react"
import { useTheme } from "../context/ThemeContext"

const About = () => {
  const { isDark } = useTheme()

  /* ---------- COLORS ---------- */

  const pageBg = isDark
    ? "bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white"
    : "bg-gradient-to-b from-white via-blue-50 to-white text-slate-900"

  const glow = isDark ? "bg-blue-600/20" : "bg-blue-400/20"

  const cardBg = isDark
    ? "bg-white/5 border-blue-500/20"
    : "bg-white border-slate-200"

  const heading = isDark ? "text-white" : "text-slate-900"
  const subText = isDark ? "text-slate-300" : "text-slate-600"
  const paragraph = isDark ? "text-slate-300" : "text-slate-700"

  return (
    <section className={`relative overflow-hidden ${pageBg}`}>
      {/* GLOW */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] ${glow} blur-[160px] rounded-full`}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-24 space-y-24">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${heading}`}>
            Lost & Found{" "}
            <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 bg-clip-text text-transparent">
              System
            </span>
          </h1>

          <p className={`text-lg leading-relaxed ${subText}`}>
            CampusSync's Lost & Found helps students quickly recover lost items
            and return found items to their rightful owners through a smart,
            secure claim verification process.
          </p>
        </motion.div>

        {/* HOW IT WORKS */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className={`text-3xl font-semibold mb-10 text-center ${heading}`}>
            How It Works
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Upload,
                step: "Step 1",
                title: "Post Item",
                desc: "Found something or lost an item? Post it with details, images, location, and date.",
              },
              {
                icon: Search,
                step: "Step 2",
                title: "Browse & Claim",
                desc: "Search through posted items. If you find your lost item, submit a claim with proof and details.",
              },
              {
                icon: CheckCircle,
                step: "Step 3",
                title: "Verify & Score",
                desc: "Item poster reviews your claim and gives a score (0-100). Score ≥60 = Auto-Approved!",
              },
              {
                icon: MessageCircle,
                step: "Step 4",
                title: "Connect & Collect",
                desc: "Once approved, contact the poster via email, message, or phone to arrange item pickup.",
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.step}
                  whileHover={{ y: -6, scale: 1.03 }}
                  className={`p-6 rounded-xl backdrop-blur-xl border ${cardBg}`}
                >
                  <Icon className="text-blue-500 mb-3 w-8 h-8" />
                  <div className="text-xs text-blue-500 mb-1">{item.step}</div>
                  <h3 className={`font-semibold mb-2 text-lg ${heading}`}>
                    {item.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${paragraph}`}>
                    {item.desc}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* SMART VERIFICATION */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 className={`text-3xl font-semibold mb-4 flex items-center gap-2 ${heading}`}>
              <Sparkles className="text-blue-500" />
              Smart Verification
            </h2>

            <p className={`${paragraph} leading-relaxed mb-4`}>
              Our scoring system ensures genuine claims are quickly approved
              while protecting against fraud:
            </p>

            <ul className={`space-y-3 ${paragraph}`}>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>
                  <strong>Score ≥60:</strong> Claim is auto-approved — contact info revealed instantly
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>
                  <strong>Score &lt;60:</strong> Claim is auto-rejected with reason provided
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">🔒</span>
                <span>
                  <strong>One-time scoring:</strong> Poster can only submit score once
                </span>
              </li>
            </ul>
          </div>

          <div className={`p-8 rounded-2xl backdrop-blur-xl border ${cardBg}`}>
            <h3 className="font-semibold mb-4 text-blue-500">
              What Claimants Provide:
            </h3>
            <ul className={`space-y-2 text-sm ${paragraph}`}>
              <li>• Identifying details about the item</li>
              <li>• Location where item was lost</li>
              <li>• Date when item was lost</li>
              <li>• Supporting image/proof (optional)</li>
            </ul>

            <h3 className="font-semibold mb-4 mt-6 text-blue-500">
              What Posters Review:
            </h3>
            <ul className={`space-y-2 text-sm ${paragraph}`}>
              <li>• Match between claim details and actual item</li>
              <li>• Location and date consistency</li>
              <li>• Authenticity of provided information</li>
              <li>• Overall credibility</li>
            </ul>
          </div>
        </motion.div>

        {/* BENEFITS */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className={`text-3xl font-semibold mb-10 text-center ${heading}`}>
            Why Use Our Lost & Found?
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Secure Claims",
                desc: "Score-based verification protects against fake claims and ensures genuine recovery.",
              },
              {
                icon: MessageCircle,
                title: "Easy Contact",
                desc: "Once approved, instantly connect with the poster via email, phone, or in-app messaging.",
              },
              {
                icon: CheckCircle,
                title: "Fast Processing",
                desc: "Auto-approval for high scores means you can recover your item quickly.",
              },
            ].map((v) => {
              const Icon = v.icon
              return (
                <motion.div
                  key={v.title}
                  whileHover={{ y: -6, scale: 1.03 }}
                  className={`p-6 rounded-xl backdrop-blur-xl border ${cardBg}`}
                >
                  <Icon className="text-blue-500 mb-3 w-8 h-8" />
                  <h3 className={`font-semibold mb-2 ${heading}`}>
                    {v.title}
                  </h3>
                  <p className={`text-sm ${paragraph}`}>{v.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* PRIVACY */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h2 className={`text-3xl font-semibold flex items-center gap-2 ${heading}`}>
            <Shield className="text-blue-500" />
            Privacy & Safety
          </h2>

          <div className={`space-y-4 leading-relaxed ${paragraph}`}>
            <p>
              Your personal contact information is only revealed to approved
              claimants. Pending and rejected claims cannot see your contact details.
            </p>

            <p>
              All posted items and claims are stored securely. Only authenticated
              users can access the Lost & Found system.
            </p>

            <p>
              False claims or fraudulent postings may result in account suspension.
            </p>
          </div>
        </motion.div>

        {/* TERMS */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h2 className={`text-3xl font-semibold flex items-center gap-2 ${heading}`}>
            <FileText className="text-blue-500" />
            Terms of Use
          </h2>

          <div className={`space-y-4 leading-relaxed ${paragraph}`}>
            <p>
              <strong>For Item Posters:</strong> Provide accurate information.
              Once a score is submitted, it cannot be edited.
            </p>

            <p>
              <strong>For Claimants:</strong> Provide truthful details. False
              claims may result in account action.
            </p>

            <p>
              <strong>Dispute Resolution:</strong> Users arrange exchanges
              themselves. Meet in safe campus locations.
            </p>

            <p>
              Continued use indicates acceptance of these terms.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About