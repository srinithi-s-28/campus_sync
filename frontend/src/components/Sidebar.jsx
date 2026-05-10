import React from "react"
import { motion } from "framer-motion"
import {
  Pin,
  Star,
  FireExtinguisher,
  FileQuestionMark
} from "lucide-react"
import { useTheme } from "../context/ThemeContext"

const Sidebar = ({ result }) => {
  const { isDark } = useTheme()

  if (
    !result ||
    !result.subTopics ||
    !result.questions?.short ||
    !result.questions?.long
  ) {
    return null
  }

  /* THEME */
  const textMain = isDark ? "text-blue-100" : "text-slate-800"
  const textHead = isDark ? "text-blue-300" : "text-slate-700"
  const textSub = isDark ? "text-blue-200" : "text-slate-600"
  const card = isDark
    ? "bg-white/5 border-blue-500/20"
    : "bg-white border-slate-200 shadow-sm"
  const badge = isDark
    ? "bg-blue-500/20 text-blue-300"
    : "bg-blue-100 text-blue-700"

  return (
    <div className={`space-y-6 text-sm ${textMain}`}>
      {/* HEADER */}
      <div className={`flex items-center gap-2 font-semibold text-base ${textHead}`}>
        <Pin className="w-4 h-4" />
        Quick Exam View
      </div>

      {/* SUBTOPICS */}
      <section>
        <div className={`flex items-center gap-2 mb-2 font-medium ${textSub}`}>
          <Star className="w-4 h-4" />
          Sub Topics (Priority)
        </div>

        <div className="space-y-3">
          {Object.entries(result.subTopics).map(([star, topics]) => (
            <motion.div
              key={star}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`rounded-lg border p-3 ${card}`}
            >
              <p className={`font-medium mb-1 ${textHead}`}>
                {star} Priority
              </p>

              <ul className="space-y-1 list-disc list-inside">
                {topics.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* IMPORTANCE */}
      <section className={`rounded-lg border p-3 ${card}`}>
        <div className={`flex items-center gap-2 mb-2 font-medium ${textSub}`}>
          <FireExtinguisher className="w-4 h-4" />
          Exam Importance
        </div>

        <span className={`inline-block mb-3 px-3 py-1 rounded-full font-semibold ${badge}`}>
          {result.importance}
        </span>

        {/* QUESTIONS */}
        <div className={`flex items-center gap-2 mb-2 font-medium ${textSub}`}>
          <FileQuestionMark className="w-4 h-4" />
          Important Questions
        </div>

        <div className="space-y-3">
          {/* SHORT */}
          <div className={`rounded-lg border p-3 ${card}`}>
            <p className={`font-medium mb-1 ${textHead}`}>
              Short question
            </p>
            <ul className="list-disc list-inside space-y-1">
              {result.questions.short.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>

          {/* LONG */}
          <div className={`rounded-lg border p-3 ${card}`}>
            <p className={`font-medium mb-1 ${textHead}`}>
              Long question
            </p>
            <ul className="list-disc list-inside space-y-1">
              {result.questions.long.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>

          {/* DIAGRAM */}
          {result.questions.diagram && (
            <div className={`rounded-lg border p-3 ${card}`}>
              <p className={`font-medium mb-1 ${textHead}`}>
                Diagram question
              </p>
              <ul>
                <li>{result.questions.diagram}</li>
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Sidebar