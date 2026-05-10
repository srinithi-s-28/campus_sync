import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles } from "lucide-react"
import { generateNotes } from "../servers/api"
import { useDispatch } from "react-redux"
import { updateCreadits } from "../redux/userSlice"
import { useTheme } from "../context/ThemeContext"

const TopicForm = ({ loading, setLoading, setResult, setError }) => {
  const { isDark } = useTheme()
  const dispatch = useDispatch()

  const [topic, setTopic] = useState("")
  const [classLevel, setClassLevel] = useState("")
  const [examType, setExamType] = useState("")
  const [revisionMode, setRevisionMode] = useState(false)
  const [includeDiagram, setIncludeDiagram] = useState(false)
  const [includeChart, setIncludeChart] = useState(false)

  const [progress, setProgress] = useState(0)
  const [progressText, setProgressText] = useState("")

  /* ---------- THEME ---------- */
  const formBg = isDark
    ? "bg-white/5 border-blue-500/20 text-white"
    : "bg-white border-slate-200 text-slate-900 shadow-sm"

  const labelText = isDark ? "text-blue-200" : "text-slate-600"
  const inputBg = isDark
    ? "bg-slate-900/70 border-blue-500/20 text-white"
    : "bg-white border-slate-300 text-slate-900"

  const progressBg = isDark ? "bg-slate-800" : "bg-slate-200"
  const progressTextColor = isDark ? "text-blue-300" : "text-slate-600"

  /* ---------- AI PROGRESS ---------- */
  useEffect(() => {
    if (!loading) {
      setProgress(0)
      return
    }

    const steps = [
      { p: 15, t: "Analyzing topic..." },
      { p: 35, t: "Structuring exam notes..." },
      { p: 55, t: "Generating key concepts..." },
      { p: 75, t: "Building diagrams & charts..." },
      { p: 90, t: "Finalizing notes..." }
    ]

    let i = 0
    const interval = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i].p)
        setProgressText(steps[i].t)
        i++
      }
    }, 700)

    return () => clearInterval(interval)
  }, [loading])

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!topic.trim()) {
      setError("Please enter a topic")
      return
    }

    try {
      setError("")
      setResult(null)
      setLoading(true)

      const data = await generateNotes({
        topic,
        classLevel,
        examType,
        revisionMode,
        includeDiagram,
        includeChart
      })

      setProgress(100)
      setProgressText("Notes ready ✔")

      setTimeout(() => {
        if (data?.error) {
          setError(data.message)
        } else {
          setResult(data.notes)
          setTopic("")
          setClassLevel("")
          setExamType("")
          setRevisionMode(false)
          setIncludeDiagram(false)
          setIncludeChart(false)

          if (typeof data.remainingCredits === "number")
            dispatch(updateCreadits(data.remainingCredits))
        }
        setLoading(false)
      }, 500)

    } catch (err) {
      setError("Failed to generate notes")
      setLoading(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className={`max-w-xl mx-auto p-8 rounded-xl border backdrop-blur-xl ${formBg}`}
    >
      {/* TITLE */}
      <div className="mb-6 flex items-center gap-2">
        <Sparkles className="text-blue-500" />
        <h2 className="text-xl font-semibold">
          Generate AI Notes
        </h2>
      </div>

      {/* TOPIC */}
      <div className="mb-4">
        <label className={`text-sm ${labelText}`}>Topic</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic (e.g. Web Development)"
          className={`w-full mt-1 px-4 py-3 rounded-lg border outline-none focus:border-blue-500 ${inputBg}`}
        />
      </div>

      {/* CLASS LEVEL */}
      <div className="mb-4">
        <label className={`text-sm ${labelText}`}>Class / Level</label>
        <select
          value={classLevel}
          onChange={(e) => setClassLevel(e.target.value)}
          className={`w-full mt-1 px-4 py-3 rounded-lg border outline-none focus:border-blue-500 ${inputBg}`}
        >
          <option value="">Select level</option>
          <option>School</option>
          <option>Diploma</option>
          <option>Undergraduate</option>
          <option>Postgraduate</option>
          <option>Competitive Exam</option>
        </select>
      </div>

      {/* EXAM TYPE */}
      <div className="mb-4">
        <label className={`text-sm ${labelText}`}>Exam Type</label>
        <select
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
          className={`w-full mt-1 px-4 py-3 rounded-lg border outline-none focus:border-blue-500 ${inputBg}`}
        >
          <option value="">Select exam</option>
          <option>Semester</option>
          <option>Midterm</option>
          <option>Final</option>
          <option>Competitive</option>
          <option>Revision Only</option>
        </select>
      </div>

      {/* TOGGLES */}
      <div className="space-y-3 mb-6">
        <Toggle label="Revision Mode" value={revisionMode} onChange={setRevisionMode} isDark={isDark} />
        <Toggle label="Include Diagrams" value={includeDiagram} onChange={setIncludeDiagram} isDark={isDark} />
        <Toggle label="Include Charts" value={includeChart} onChange={setIncludeChart} isDark={isDark} />
      </div>

      {/* BUTTON */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        disabled={loading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg disabled:opacity-50 mb-4"
      >
        {loading ? "Generating..." : "Generate Notes"}
      </motion.button>

      {/* PROGRESS */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full flex flex-col items-center mb-2"
          >
            <div className={`w-full rounded-lg h-6 overflow-hidden border ${progressBg}`}>
              <motion.div
                className="h-6 bg-gradient-to-r from-blue-500 to-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
            <p className={`text-xs mt-2 ${progressTextColor}`}>
              {progressText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  )
}

/* ---------- TOGGLE ---------- */
const Toggle = ({ label, value, onChange, isDark }) => {
  const bg = isDark
    ? "bg-slate-900/60 border-blue-500/20 text-blue-200"
    : "bg-white border-slate-300 text-slate-700"

  return (
    <label
      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${bg}`}
      onClick={() => onChange(!value)}
    >
      <span className="text-sm">{label}</span>

      <div
        className={`w-10 h-5 rounded-full p-1 transition ${
          value ? "bg-blue-500" : isDark ? "bg-gray-600" : "bg-slate-300"
        }`}
      >
        <div
          className={`w-3 h-3 bg-white rounded-full transition ${
            value ? "translate-x-5" : ""
          }`}
        />
      </div>
    </label>
  )
}

export default TopicForm