import React from "react"
import { motion } from "framer-motion"
import { MapPin, Clock } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

const LostItemCard = ({ item }) => {
  const { isDark } = useTheme()

  const cardBg = isDark
    ? "bg-slate-950/80 border-blue-500/20 hover:shadow-blue-500/10"
    : "bg-white border-slate-200 hover:shadow-slate-300/40"

  const title = isDark ? "text-white" : "text-slate-800"
  const text1 = isDark ? "text-blue-200/80" : "text-slate-600"
  const text2 = isDark ? "text-blue-300/60" : "text-slate-500"

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className={`rounded-2xl overflow-hidden border backdrop-blur-xl shadow-lg transition ${cardBg}`}
    >
      {/* IMAGE */}
      <div className="h-44 w-full overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover hover:scale-105 transition duration-500"
        />
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h3 className={`font-semibold text-lg mb-2 ${title}`}>
          {item.title}
        </h3>

        <div className={`flex items-center text-sm gap-2 mb-1 ${text1}`}>
          <MapPin size={14} className="text-blue-400" />
          {item.location}
        </div>

        <div className={`flex items-center text-xs gap-2 ${text2}`}>
          <Clock size={14} />
          {item.date}
        </div>

        <button className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium hover:scale-[1.02] transition">
          View Details
        </button>
      </div>
    </motion.div>
  )
}

export default LostItemCard