import React, { useState, useRef, useEffect } from "react"
import logo from "../assets/logo.png"
import { Diamond, Plus, X, FileText } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import TopicForm from "../components/TopicForm"
import { useSelector } from "react-redux"
import Sidebar from "../components/Sidebar"
import FinalResult from "../components/FinalResult"
import { useTheme } from "../context/ThemeContext"
import { useNavigate } from "react-router-dom"

const Notes = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme()
  const [open, setOpen] = useState(false)
  const popupRef = useRef(null)
  const { userData } = useSelector((state) => state.user)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState(null)

  useEffect(() => {
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div
      className={`min-h-screen ${
        isDark
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950"
          : "bg-slate-100"
      }`}
    >
      {/* NAVBAR */}
      <header
        className={`sticky top-0 z-50 backdrop-blur border-b ${
          isDark
            ? "bg-slate-950/70 border-blue-500/20"
            : "bg-white/80 border-slate-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="ExamNotes" className="w-9 h-9" />
            <div>
              <h1 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                Exam<span className="text-blue-500">Notes</span>
              </h1>
              <p className={isDark ? "text-xs text-blue-200/70" : "text-xs text-slate-500"}>
                AI study workspace
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            <motion.button onClick={()=>navigate("/notes/history")}
              whileHover={{ y: -2 }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm ${
                isDark
                  ? "bg-white/5 border-blue-500/20 text-blue-200"
                  : "bg-white border-slate-200 text-slate-700 shadow-sm"
              }`}
            >
              <FileText className="w-4 h-4"  />
              Your Notes
            </motion.button>

            {/* CREDITS */}
            <div className="relative flex items-center gap-2">
              <Diamond className="w-5 h-5 text-cyan-400" />
              <span className={isDark ? "text-blue-300 text-sm font-semibold" : "text-slate-700 text-sm font-semibold"}>
                {userData?.credits}
              </span>

              <motion.button whileHover={{ rotate: 90 }} onClick={() => setOpen((p) => !p)}>
                <Plus className="w-4 h-4 text-blue-500" />
              </motion.button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    ref={popupRef}
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`absolute right-0 top-10 w-72 rounded-xl p-5 border shadow-xl ${
                      isDark
                        ? "bg-slate-900 border-blue-500/20 text-white"
                        : "bg-white border-slate-200 text-slate-900"
                    }`}
                  >
                    <button
                      onClick={() => setOpen(false)}
                      className="absolute top-3 right-3 text-slate-400"
                    >
                      <X size={16} />
                    </button>

                    <h3 className="font-semibold mb-2">Buy Credits</h3>
                    <p className={isDark ? "text-gray-400 text-sm mb-4" : "text-slate-500 text-sm mb-4"}>
                      Generate AI notes, diagrams & PDFs.
                    </p>

                    <button onClick={()=>navigate("/pricing")} className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                      Buy More Credits
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* FORM CARD */}
        <div
          className={`rounded-2xl p-6 border ${
            isDark
              ? "bg-white/5 border-blue-500/20"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <TopicForm
            loading={loading}
            setLoading={setLoading}
            setResult={setResult}
            setError={setError}
          />

          {error && (
            <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* EMPTY */}
        {!result && (
          <div className="text-center py-16">
            <div className={isDark ? "text-blue-200/80" : "text-slate-500"}>
              <p className="text-lg font-medium">Your notes will appear here</p>
              <p className="text-sm mt-2">
                Enter a topic above to generate AI notes
              </p>
            </div>
          </div>
        )}

        {/* RESULT */}
        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* SIDEBAR */}
            <div
              className={`lg:col-span-1 rounded-2xl p-4 border ${
                isDark
                  ? "bg-white/5 border-blue-500/20"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <Sidebar result={result.content} />
            </div>

            {/* CONTENT */}
            <div
              className={`lg:col-span-3 rounded-2xl p-6 border ${
                isDark
                  ? "bg-white/5 border-blue-500/20"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <FinalResult result={result.content} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notes