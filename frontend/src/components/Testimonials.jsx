import React from "react"
import { motion } from "framer-motion"
import { useTheme } from "../context/ThemeContext"

const testimonials = [
  {
    name: "Aisha R.",
    role: "2nd Year, CS",
    quote:
      "Found my lost laptop within hours — the matching feature is incredible!",
    initial: "A"
  },
  {
    name: "Rohit K.",
    role: "4th Year, Chemistry",
    quote:
      "Sold my old textbooks quickly and safely through CampusSync.",
    initial: "R"
  },
  {
    name: "Meera S.",
    role: "1st Year, Arts",
    quote:
      "The chat feature made coordinating pickup so smooth. Highly recommend.",
    initial: "M"
  },
  {
    name: "Arjun P.",
    role: "3rd Year, IT",
    quote:
      "AI Interview mode helped me practice technical + HR rounds with instant feedback before placements.",
    initial: "A"
  }
]

const Testimonials = () => {
  const { isDark } = useTheme()
  return (
    <section className="py-12 sm:py-16 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20"
      >
        {/* GLOW */}
        <div className="absolute inset-0 flex justify-center">
          <div className={`w-60 h-60 sm:w-80 sm:h-80 md:w-96 md:h-96 ${isDark ? "bg-blue-500/20" : "bg-blue-400/15"} blur-[140px] rounded-full`} />
        </div>

        <h2 className="relative text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
          <span className={isDark ? "text-white" : "text-slate-900"}>What Students </span>
          <span className={`bg-clip-text text-transparent ${isDark ? "bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400" : "bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500"}`}>
            Say
          </span>
        </h2>

        <p className={`relative ${isDark ? "text-gray-200" : "text-slate-600"} text-base sm:text-lg px-4`}>
          Real students, real results — from lost-item recovery to AI Notes and AI Interview prep.
        </p>
      </motion.div>

      {/* CARDS */}
      <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`group relative rounded-2xl p-[1px] ${isDark ? "bg-gradient-to-br from-blue-500/40 via-indigo-500/20 to-transparent" : "bg-gradient-to-br from-blue-400/30 via-indigo-400/15 to-transparent"}`}
          >
            {/* CARD */}
            <div className={`h-full rounded-2xl ${isDark ? "bg-slate-950/90" : "bg-white/90"} backdrop-blur-xl ${isDark ? "border-blue-500/10" : "border-blue-300/20"} border p-6 relative overflow-hidden`}>

              {/* HOVER GLOW */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 ${isDark ? "bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-transparent" : "bg-gradient-to-br from-blue-400/10 via-indigo-400/10 to-transparent"}`} />

              {/* AVATAR */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold mb-4 shadow-lg shadow-blue-500/40">
                {t.initial}
              </div>

              {/* QUOTE */}
              <p className={`${isDark ? "text-gray-200" : "text-slate-600"} text-sm leading-relaxed mb-4`}>
                "{t.quote}"
              </p>

              {/* NAME */}
              <div className={`${isDark ? "text-white" : "text-slate-900"} font-semibold`}>
                {t.name}
              </div>

              {/* ROLE */}
              <div className={`${isDark ? "text-blue-300" : "text-blue-600"} text-xs`}>
                {t.role}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default Testimonials
