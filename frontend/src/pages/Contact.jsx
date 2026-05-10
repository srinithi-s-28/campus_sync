import React from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

const contactInfo = [
  { icon: Mail, title: "Email", value: "support@campussync.com" },
  { icon: Phone, title: "Phone", value: "+91 98765 43210" },
  { icon: MapPin, title: "Location", value: "Your Campus, India" },
]

const Contact = () => {
  const { isDark } = useTheme()

  /* ---------- COLORS ---------- */

  const pageBg = isDark
    ? "bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white"
    : "bg-gradient-to-b from-white via-blue-50 to-white text-slate-900"

  const cardBg = isDark
    ? "bg-white/5 border-blue-500/20"
    : "bg-white border-slate-200"

  const labelColor = isDark ? "text-slate-300" : "text-slate-600"
  const textPrimary = isDark ? "text-white" : "text-slate-900"

  const inputBg = isDark
    ? "bg-slate-900/70 border-blue-500/20 text-white placeholder:text-slate-400"
    : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"

  const glow = isDark ? "bg-blue-600/20" : "bg-blue-400/20"

  return (
    <section className={`relative min-h-screen overflow-hidden ${pageBg}`}>
      {/* GLOW */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] ${glow} blur-[160px] rounded-full`}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-24">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${textPrimary}`}>
            Contact{" "}
            <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 bg-clip-text text-transparent">
              Us
            </span>
          </h2>

          <p className={labelColor}>
            Have questions, feedback, or need help? We’d love to hear from you.
            Reach out anytime.
          </p>
        </motion.div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* LEFT INFO */}
          <div className="space-y-6">
            {contactInfo.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ scale: 1.03 }}
                  className={`flex items-center gap-4 p-5 rounded-xl backdrop-blur-xl border ${cardBg}`}
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center border ${
                      isDark
                        ? "bg-blue-500/20 border-blue-500/20"
                        : "bg-blue-100 border-blue-200"
                    }`}
                  >
                    <Icon className="w-5 h-5 text-blue-500" />
                  </div>

                  <div>
                    <p className={`text-sm ${labelColor}`}>{item.title}</p>
                    <p className={`font-medium ${textPrimary}`}>
                      {item.value}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* FORM */}
          <motion.form
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className={`space-y-5 p-8 rounded-2xl backdrop-blur-xl shadow-lg border ${cardBg}`}
          >
            {/* NAME */}
            <div>
              <label className={`text-sm ${labelColor}`}>Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className={`w-full mt-1 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/30 ${inputBg}`}
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className={`text-sm ${labelColor}`}>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className={`w-full mt-1 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/30 ${inputBg}`}
              />
            </div>

            {/* MESSAGE */}
            <div>
              <label className={`text-sm ${labelColor}`}>Message</label>
              <textarea
                rows="4"
                placeholder="Write your message..."
                className={`w-full mt-1 px-4 py-3 rounded-lg outline-none resize-none focus:ring-2 focus:ring-blue-500/30 ${inputBg}`}
              />
            </div>

            {/* BUTTON */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/30"
            >
              <Send className="w-4 h-4" />
              Send Message
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}

export default Contact