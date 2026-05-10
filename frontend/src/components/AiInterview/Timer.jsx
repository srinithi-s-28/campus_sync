import React from 'react'
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { useTheme } from '../../context/ThemeContext'

const Timer = ({ timeLeft = 0, totalTime = 60 }) => {
  const { isDark } = useTheme()
    const safeTotalTime = totalTime > 0 ? totalTime : 60
    const safeTimeLeft = Math.max(0, Math.min(timeLeft, safeTotalTime))
    const percentage = (safeTimeLeft / safeTotalTime) * 100

    const minutes = Math.floor(safeTimeLeft / 60)
    const seconds = safeTimeLeft % 60
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`

    const progressColor = percentage > 50 ? "#2563eb" : percentage > 20 ? "#f59e0b" : "#ef4444"

  return (
    <div className='flex flex-col items-center gap-2'>
      <div className='w-20 h-20 md:w-24 md:h-24'>
        <CircularProgressbar
          value={percentage}
          text={formattedTime}
          strokeWidth={10}
          styles={buildStyles({
            pathColor: progressColor,
            textColor: isDark ? "#f8fafc" : "#0f172a",
            trailColor: isDark ? "#334155" : "#dbeafe",
            textSize: "16px",
            strokeLinecap: "round",
          })}
        />
      </div>

      <p className={`text-xs font-medium transition-all duration-300 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
        Time Left
      </p>
    </div>
  )
}

export default Timer
