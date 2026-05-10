import React from "react"
import { motion } from "framer-motion"
import { XCircle, ArrowLeft, CreditCard } from "lucide-react"
import { Link } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"

const PaymentFailed = () => {
  const { isDark } = useTheme()

  /* ---------- THEME ---------- */
  const pageBg = isDark
    ? "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white"
    : "bg-gradient-to-br from-white via-red-50 to-white text-slate-900"

  const cardBg = isDark
    ? "bg-gradient-to-br from-white/5 via-red-500/5 to-white/5 border-red-500/30"
    : "bg-white border-red-200 shadow-xl"

  const messageColor = isDark ? "text-blue-200/80" : "text-slate-600"

  const secondaryBtn = isDark
    ? "bg-white/5 border-blue-500/30 text-blue-200 hover:bg-blue-500/10"
    : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100"

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${pageBg}`}>
      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative max-w-md w-full rounded-2xl border backdrop-blur-xl p-8 text-center ${cardBg}`}
      >
        {/* GLOW */}
        <div className="absolute inset-0 bg-red-500/10 blur-2xl opacity-40 rounded-2xl pointer-events-none" />

        {/* ICON */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="flex justify-center mb-5"
        >
          <div className="p-4 rounded-full bg-red-500/20 border border-red-400/40">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
        </motion.div>

        {/* TITLE */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">
          Payment Failed
        </h1>

        {/* MESSAGE */}
        <p className={`mb-6 leading-relaxed ${messageColor}`}>
          Your payment was not completed or was cancelled.
          No credits were deducted. You can try again anytime.
        </p>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* RETRY */}
          <Link to="/pricing" className="flex-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg flex items-center justify-center gap-2"
            >
              Try Again
              <CreditCard className="w-4 h-4" />
            </motion.button>
          </Link>

          {/* HOME */}
          <Link to="/" className="flex-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full py-3 rounded-xl border transition flex items-center justify-center gap-2 ${secondaryBtn}`}
            >
              Go Home
              <ArrowLeft className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default PaymentFailed