import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../../main'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import {
  FaArrowLeft, FaDownload, FaBriefcase,
  FaClock, FaStar, FaCheckCircle
} from 'react-icons/fa'
import { useTheme } from '../../context/ThemeContext'

/* ─── helpers ─────────────────────────────────────────────── */
const getMotivation = (score) => {
  if (score >= 9) return { msg: "Exceptional! You're interview-ready.", sub: "Outstanding across all dimensions." }
  if (score >= 7) return { msg: "Needs minor improvement before interviews.", sub: "Good foundation, refine articulation." }
  if (score >= 5) return { msg: "Solid effort! Keep practicing consistently.", sub: "Work on clarity and examples." }
  return { msg: "Keep going! Practice makes perfect.", sub: "Focus on fundamentals and confidence." }
}

const scoreColor = (v) => {
  if (v >= 8) return '#22c55e'
  if (v >= 5) return '#f59e0b'
  return '#ef4444'
}

const avg = (arr, key) =>
  arr?.length
    ? +(arr.reduce((s, q) => s + (q[key] || 0), 0) / arr.length).toFixed(1)
    : 0

/* ─── Loading skeleton ────────────────────────────────────── */
const Skeleton = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full"
    />
  </div>
)

/* ─── Skill bar ───────────────────────────────────────────── */
const SkillBar = ({ label, value, delay }) => (
  <div className="mb-5">
    <div className="flex justify-between mb-1.5">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-bold text-green-500">{value}</span>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-2.5">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(value / 10) * 100}%` }}
        transition={{ duration: 1.2, delay, ease: 'easeOut' }}
        className="h-2.5 rounded-full bg-linear-to-r from-green-400 to-green-600"
      />
    </div>
  </div>
)

/* ─── Custom Tooltip ──────────────────────────────────────── */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white shadow-lg rounded-xl px-3 py-2 border border-gray-100 text-sm">
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="font-bold text-green-500">{payload[0].value} / 10</p>
    </div>
  )
}

/* ─── Main component ──────────────────────────────────────── */
const InterviewReport = () => {
  const { interviewId } = useParams()
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/interview/report/${interviewId}`,
          { withCredentials: true }
        )
        setReport(result?.data || null)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    if (interviewId) fetchReport()
  }, [interviewId])

  if (loading) return <Skeleton />
  if (!report) return (
    <div className={`min-h-screen flex flex-col items-center justify-center gap-3 transition-all duration-300 ${
      isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-black'
    }`}>
      <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-gray-500'}`}>Report not found.</p>
      <button onClick={() => navigate('/ai-interview/history')}
        className="text-green-500 underline text-sm">← Back to History</button>
    </div>
  )

  const questions = report.questions || []
  const chartData = questions.map((q, i) => ({ name: `Q${i + 1}`, score: q.score || 0 }))
  const avgConf = avg(questions, 'confidence')
  const avgComm = avg(questions, 'communication')
  const avgCorr = avg(questions, 'correctness')
  const mot = getMotivation(report.finalScore)
  const mainColor = scoreColor(report.finalScore)

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: 'easeOut' }
  })

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDark
        ? 'bg-linear-to-br from-slate-950 via-blue-950 to-slate-950 text-white'
        : 'bg-gray-50 text-black'
    }`}>

      {/* ── Header ── */}
      <motion.div
        {...fadeUp(0)}
        className={`border-b px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm gap-2 transition-all duration-300 ${
          isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/ai-interview/history')}
            className="shrink-0 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FaArrowLeft className="text-gray-600 text-sm sm:text-base" />
          </motion.button>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-lg font-bold text-gray-800 leading-tight">Interview Analytics Dashboard</h1>
            <p className="text-[10px] sm:text-sm text-gray-400 hidden xs:block">AI-powered performance insights</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => window.print()}
          className="shrink-0 flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm font-semibold shadow-md shadow-green-100"
        >
          <FaDownload size={11} />
          <span className="hidden sm:inline">Download PDF</span>
          <span className="sm:hidden">PDF</span>
        </motion.button>
      </motion.div>

      {/* ── Meta bar ── */}
      <motion.div {...fadeUp(0.05)}
        className={`px-3 sm:px-6 py-2 border-b flex flex-wrap gap-x-4 gap-y-1.5 text-xs transition-all duration-300 ${
          isDark ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-white border-gray-100 text-gray-500'
        }`}
      >
        <span className="flex items-center gap-1.5">
          <FaBriefcase className="text-green-400 shrink-0" />
          <span className="truncate max-w-32 sm:max-w-none">{report.role}</span>
          <span className="text-gray-300">·</span>
          <span>{report.experience}yr</span>
        </span>
        <span className="flex items-center gap-1.5"><FaStar className="text-amber-400 shrink-0" /> {report.mode}</span>
        <span className="flex items-center gap-1.5">
          <FaClock className="text-blue-400 shrink-0" />
          {new Date(report.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
        <span className="flex items-center gap-1.5">
          <FaCheckCircle className={report.status === 'completed' ? 'text-green-500 shrink-0' : 'text-yellow-400 shrink-0'} />
          <span className={report.status === 'completed' ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
            {report.status}
          </span>
        </span>
      </motion.div>

      {/* ── Grid ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

        {/* ── Overall Performance ── */}
        <motion.div {...fadeUp(0.1)}
          className={`rounded-2xl shadow-sm border p-5 sm:p-7 flex flex-col items-center text-center transition-all duration-300 ${
            isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-100'
          }`}
        >
          <p className="text-gray-400 text-sm font-medium mb-4 sm:mb-5">Overall Performance</p>
          <div className="w-32 h-32 sm:w-40 sm:h-40 mb-4 sm:mb-5">
            <CircularProgressbar
              value={(report.finalScore / 10) * 100}
              text={`${report.finalScore}/10`}
              styles={buildStyles({
                pathColor: mainColor,
                textColor: mainColor,
                trailColor: '#f3f4f6',
                textSize: '17px',
                pathTransitionDuration: 1.4,
              })}
            />
          </div>
          <p className="text-gray-400 text-xs mb-3 sm:mb-4">Out of 10</p>
          <div className="bg-gray-50 rounded-xl px-4 sm:px-5 py-3 w-full">
            <p className="font-bold text-gray-800 text-sm sm:text-base leading-snug">{mot.msg}</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">{mot.sub}</p>
          </div>
        </motion.div>

        {/* ── Performance Trend ── */}
        <motion.div {...fadeUp(0.2)}
          className={`rounded-2xl shadow-sm border p-4 sm:p-6 transition-all duration-300 ${
            isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-100'
          }`}
        >
          <p className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Performance Trend</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#22c55e"
                strokeWidth={2.5}
                fill="url(#perfGrad)"
                dot={{ fill: '#22c55e', r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#16a34a' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* ── Skill Evaluation ── */}
        <motion.div {...fadeUp(0.3)}
          className={`rounded-2xl shadow-sm border p-4 sm:p-6 transition-all duration-300 ${
            isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-100'
          }`}
        >
          <p className="font-semibold text-gray-800 mb-4 sm:mb-5 text-sm sm:text-base">Skill Evaluation</p>
          <SkillBar label="Confidence"    value={avgConf} delay={0.6} />
          <SkillBar label="Communication" value={avgComm} delay={0.75} />
          <SkillBar label="Correctness"   value={avgCorr} delay={0.9} />

          {/* mini score chips */}
          <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-5">
            {[
              { label: 'Confidence', short: 'Conf.',  val: avgConf },
              { label: 'Communication', short: 'Comm.', val: avgComm },
              { label: 'Correctness', short: 'Correct', val: avgCorr },
            ].map(({ label, short, val }) => (
              <div key={label}
                className="flex-1 text-center py-2.5 sm:py-3 rounded-xl border border-gray-100 bg-gray-50">
                <p className="text-base sm:text-lg font-bold" style={{ color: scoreColor(val) }}>{val}</p>
                <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5 hidden sm:block">{label}</p>
                <p className="text-[9px] text-gray-400 mt-0.5 sm:hidden">{short}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Question Breakdown ── */}
        <motion.div {...fadeUp(0.4)}
          className={`rounded-2xl shadow-sm border p-4 sm:p-6 transition-all duration-300 ${
            isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-100'
          }`}
        >
          <p className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Question Breakdown</p>
          <div className="space-y-3 max-h-130 overflow-y-auto pr-0.5 sm:pr-1">
            {questions.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className={`border rounded-xl overflow-hidden ${isDark ? 'border-slate-700' : 'border-gray-100'}`}
              >
                {/* question header — clickable to expand */}
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="w-full flex items-start justify-between gap-2 p-3 sm:p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex gap-2 sm:gap-3 flex-1 min-w-0">
                    <span
                      className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold text-white mt-0.5"
                      style={{ backgroundColor: scoreColor(q.score) }}
                    >{i + 1}</span>
                    <p className="text-xs sm:text-sm font-medium text-gray-800 leading-snug line-clamp-2">{q.question}</p>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <span className={`hidden sm:inline text-xs px-2 py-0.5 rounded-full font-medium ${
                      q.difficulty === 'hard' ? 'bg-red-50 text-red-500' :
                      q.difficulty === 'medium' ? 'bg-amber-50 text-amber-500' :
                      'bg-green-50 text-green-500'}`}>
                      {q.difficulty}
                    </span>
                    <span className="text-xs sm:text-sm font-bold whitespace-nowrap" style={{ color: scoreColor(q.score) }}>{q.score}/10</span>
                    <motion.span
                      animate={{ rotate: expanded === i ? 180 : 0 }}
                      className="text-gray-400 text-[10px]"
                    >▼</motion.span>
                  </div>
                </button>

                {/* expandable detail */}
                <motion.div
                  initial={false}
                  animate={{ height: expanded === i ? 'auto' : 0, opacity: expanded === i ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-2.5 sm:space-y-3">
                    {/* difficulty badge on mobile (shown inside expanded) */}
                    <span className={`sm:hidden inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${
                      q.difficulty === 'hard' ? 'bg-red-50 text-red-500' :
                      q.difficulty === 'medium' ? 'bg-amber-50 text-amber-500' :
                      'bg-green-50 text-green-500'}`}>
                      {q.difficulty}
                    </span>
                    {q.answer && (
                      <div>
                        <p className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Your Answer</p>
                        <p className="text-xs text-gray-600 bg-gray-50 rounded-lg p-2.5 sm:p-3 leading-relaxed">{q.answer}</p>
                      </div>
                    )}
                    <div className="bg-green-50 border border-green-100 rounded-lg p-2.5 sm:p-3">
                      <p className="text-[10px] sm:text-[11px] font-semibold text-green-600 uppercase tracking-wide mb-1">AI Feedback</p>
                      <p className="text-xs text-gray-700 leading-relaxed">{q.feedback}</p>
                    </div>
                    <div className="flex gap-1.5 sm:gap-2">
                      {[
                        { label: 'Confidence', short: 'Conf.', val: q.confidence },
                        { label: 'Comm.',       short: 'Comm.', val: q.communication },
                        { label: 'Correctness', short: 'Corr.', val: q.correctness },
                      ].map(({ label, short, val }) => (
                        <div key={label}
                          className="flex-1 text-center bg-gray-50 rounded-lg py-1.5 sm:py-2 border border-gray-100">
                          <p className="text-xs sm:text-sm font-bold" style={{ color: scoreColor(val) }}>{val}</p>
                          <p className="text-[9px] sm:text-[10px] text-gray-400">{short}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  )
}

export default InterviewReport
