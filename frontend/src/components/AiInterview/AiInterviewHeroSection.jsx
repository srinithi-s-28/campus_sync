import React from "react"
import aivid from "../../assets/aiVideo.mp4"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../../context/ThemeContext"




const AiInterviewHeroSection = () => {

  const navigate = useNavigate()
  const { isDark } = useTheme()

  const titleColor = isDark ? "text-white" : "text-slate-900"
  const textColor = isDark ? "text-blue-200/80" : "text-slate-600"

  const cardStyle = isDark
    ? "bg-white/5 border-blue-500/20"
    : "bg-white border-slate-200 shadow-sm"

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 transition-all duration-300">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

        {/* LEFT SIDE */}
        <div className="space-y-7">

          {/* TITLE */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className={`text-4xl md:text-5xl font-bold leading-tight ${titleColor}`}
          >
            Practice Interviews with{" "}
            <span className="bg-linear-to-r from-blue-500 via-cyan-400 to-indigo-500 bg-clip-text text-transparent">
              AI
            </span>
          </motion.h1>

          {/* TEXT */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className={`text-lg ${textColor}`}
          >
            Prepare for real interviews with an AI interviewer.
            Get instant feedback and improve your confidence.
          </motion.p>

          {/* BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="flex gap-4 flex-row"
          >

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/ai-interview/start")}
              className="flex-1 md:flex-none px-6 py-3 rounded-lg bg-linear-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-lg whitespace-nowrap"
            >
              Start Interview
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/ai-interview/history")}
              className={`flex-1 md:flex-none px-6 py-3 rounded-lg border font-medium whitespace-nowrap ${cardStyle}`}
            >
              Interview History
            </motion.button>

          </motion.div>

        </div>


        {/* RIGHT VIDEO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          whileHover={{ y: -8 }}
          className={`rounded-2xl overflow-hidden border ${cardStyle}`}
        >

          <motion.video
            src={aivid}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

        </motion.div>

      </div>

    </section>
  )
}

export default AiInterviewHeroSection