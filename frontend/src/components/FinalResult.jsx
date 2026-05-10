import React, { useState } from "react"
import { motion } from "framer-motion"
import { Copy, Download, Zap, Star, HelpCircle } from "lucide-react"
import ReactMarkdown from "react-markdown"
import MermaidSetup from "./MermaidSetup"
import RechartSetUp from "./RechartSetUp"
import { useTheme } from "../context/ThemeContext"

const FinalResult = ({ result }) => {
  const { isDark } = useTheme()

  const [quickRevision, setQuickRevision] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!result) return null

  /* ---------- THEME ---------- */
  const textMain = isDark ? "text-white" : "text-slate-800"
  const textSub = isDark ? "text-blue-200/80" : "text-slate-600"
  const card = isDark
    ? "bg-white/5 border-blue-500/20"
    : "bg-white border-slate-200"
  const chip = isDark
    ? "bg-blue-500/5 border-blue-500/20 text-blue-100"
    : "bg-blue-50 border-blue-200 text-slate-700"

  /* ---------- MARKDOWN ---------- */
  const markdownComponents = {
    h1: ({ children }) => (
      <h1
        className={`text-3xl font-bold mt-8 mb-4 pb-2 border-b ${
          isDark
            ? "text-blue-300 border-blue-500/30"
            : "text-slate-800 border-slate-300"
        }`}
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        className={`text-2xl font-semibold mt-6 mb-3 ${
          isDark ? "text-blue-200" : "text-slate-700"
        }`}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className={`text-xl font-semibold mt-5 mb-2 ${
          isDark ? "text-blue-100" : "text-slate-700"
        }`}
      >
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className={`${textSub} leading-relaxed mb-3`}>{children}</p>
    ),
    ul: ({ children }) => (
      <ul className={`list-disc ml-6 space-y-1 mb-4 ${textSub}`}>
        {children}
      </ul>
    ),
    li: ({ children }) => <li>{children}</li>,
  }

  /* ---------- ACTIONS ---------- */
  const handleCopy = async () => {
    const text = quickRevision
      ? result.revisionPoints?.join("\n")
      : `${JSON.stringify(result.subTopics, null, 2)}\n\n${result.notes}`

    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const text = quickRevision
      ? result.revisionPoints?.join("\n")
      : `${JSON.stringify(result.subTopics, null, 2)}\n\n${result.notes}`

    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `${result.topic || "notes"}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className={`text-xl sm:text-2xl font-semibold ${textMain}`}>
          Generated Notes
        </h2>

        <div className="flex flex-wrap gap-2">
          {/* REVISION */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setQuickRevision(!quickRevision)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border ${
              quickRevision
                ? "bg-blue-500/20 border-blue-400 text-blue-300"
                : isDark
                ? "bg-white/5 border-blue-500/20 text-blue-200"
                : "bg-white border-slate-300 text-slate-700"
            }`}
          >
            <Zap className="w-4 h-4" />
            {quickRevision ? "Exit Revision" : "Quick Revision"}
          </motion.button>

          {/* COPY */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border ${
              isDark
                ? "bg-white/5 border-blue-500/20 text-blue-200"
                : "bg-white border-slate-300 text-slate-700"
            }`}
          >
            <Copy className="w-4 h-4" />
            {copied ? "Copied" : "Copy"}
          </motion.button>

          {/* DOWNLOAD */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm shadow"
          >
            <Download className="w-4 h-4" />
            Download
          </motion.button>
        </div>
      </div>

      {/* CONTENT */}
      <motion.div
        key={quickRevision ? "revision" : "notes"}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* REVISION */}
        {quickRevision ? (
          <ul className="space-y-2">
            {result.revisionPoints?.map((p, i) => (
              <li key={i} className={`rounded-lg px-3 py-2 border ${chip}`}>
                {p}
              </li>
            ))}
          </ul>
        ) : (
          <div className="space-y-8">
            {/* SUBTOPICS */}
            {result.subTopics && (
              <div>
                <h3 className={`text-lg font-semibold mb-4 flex gap-2 ${textMain}`}>
                  <Star className="w-4 h-4 text-blue-400" />
                  Priority Topics
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.entries(result.subTopics).map(
                    ([priority, topics]) => (
                      <div key={priority} className={`rounded-lg p-4 border ${card}`}>
                        <div className="text-blue-400 font-semibold mb-2">
                          {priority} Priority
                        </div>
                        <ul className={`space-y-1 text-sm ${textSub}`}>
                          {topics.map((t, i) => (
                            <li key={i}>• {t}</li>
                          ))}
                        </ul>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* NOTES */}
            <div className="prose max-w-none">
              <ReactMarkdown components={markdownComponents}>
                {result.notes}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* CHARTS */}
        {result?.charts?.length > 0 && <RechartSetUp charts={result.charts} />}

        {/* SHORT */}
        <Section title="Short Exam Questions" data={result.questions.short} isDark={isDark} />

        {/* LONG */}
        <Section title="Long Exam Questions" data={result.questions.long} isDark={isDark} />

        {/* DIAGRAM Q */}
        <div className={`rounded-lg border p-3 ${card}`}>
          <p className="text-blue-400 font-medium mb-1">Diagram question</p>
          <ul className={textSub}>
            <li>{result?.questions?.diagram}</li>
          </ul>
        </div>

        {/* MERMAID */}
        {result?.diagram?.data && <MermaidSetup diagram={result.diagram.data} />}
      </motion.div>
    </div>
  )
}

/* ---------- SECTION ---------- */
const Section = ({ title, data, isDark }) => {
  const card = isDark
    ? "bg-blue-500/5 border-blue-500/20 text-blue-100"
    : "bg-blue-50 border-blue-200 text-slate-700"

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-blue-400">{title}</h3>
      </div>

      <ul className="space-y-3">
        {data.map((q, i) => (
          <li key={i} className={`rounded-lg px-4 py-3 border ${card}`}>
            {q}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FinalResult