import axios from "axios"
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { FaArrowRight, FaClock, FaHistory, FaPlayCircle, FaStar } from "react-icons/fa"
import { serverUrl } from "../../main"
import { useTheme } from "../../context/ThemeContext"

const getStatusClasses = (status, isDark) => {
  return status === "completed"
    ? isDark
      ? "bg-emerald-500/15 text-emerald-300"
      : "bg-emerald-100 text-emerald-700"
    : isDark
      ? "bg-amber-500/15 text-amber-300"
      : "bg-amber-100 text-amber-700"
}

const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const { isDark } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    const getMyInterviews = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/interview/my-interviews`,
          { withCredentials: true }
        )

        setInterviews(result?.data?.interviews || [])
      } catch (error) {
        console.error(error)
        toast.error(error?.response?.data?.message || "Failed to load interview history")
      } finally {
        setLoading(false)
      }
    }

    getMyInterviews()
  }, [])

  return (
    <div className={`min-h-screen px-4 py-10 md:px-8 transition-all duration-300 ${
      isDark
        ? "bg-linear-to-b from-slate-950 via-blue-950 to-slate-950 text-white"
        : "bg-linear-to-b from-slate-50 via-blue-50 to-white text-black"
    }`}>
      <div className="mx-auto max-w-6xl">
        <div className={`flex flex-col gap-4 rounded-3xl border p-6 shadow-lg md:flex-row md:items-center md:justify-between md:p-8 transition-all duration-300 ${
          isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"
        }`}>
          <div>
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
              isDark ? "bg-blue-500/15 text-blue-300" : "bg-blue-50 text-blue-700"
            }`}>
              <FaHistory /> Interview History
            </div>
            <h1 className={`mt-3 text-3xl font-bold md:text-4xl ${isDark ? "text-slate-100" : "text-slate-900"}`}>
              Track your past AI interviews
            </h1>
            <p className={`mt-2 max-w-2xl text-sm md:text-base ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Review your interview attempts, completion status, and overall scores in one place.
            </p>
          </div>

          <button
            onClick={() => navigate("/ai-interview/start")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-3 font-semibold text-white shadow-md hover:from-blue-700 hover:to-indigo-700"
          >
            <FaPlayCircle /> Start New Interview
          </button>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className={`animate-pulse rounded-2xl border p-5 shadow-sm ${
                  isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"
                }`}
              >
                <div className={`h-5 w-32 rounded ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
                <div className={`mt-4 h-4 w-24 rounded ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
                <div className={`mt-6 h-20 rounded-xl ${isDark ? "bg-slate-800" : "bg-slate-100"}`} />
              </div>
            ))}
          </div>
        ) : interviews.length === 0 ? (
          <div className={`mt-8 rounded-3xl border border-dashed p-10 text-center shadow-sm transition-all duration-300 ${
            isDark ? "border-slate-700 bg-slate-900" : "border-slate-300 bg-white"
          }`}>
            <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
              isDark ? "bg-blue-500/15 text-blue-300" : "bg-blue-50 text-blue-600"
            }`}>
              <FaHistory className="text-2xl" />
            </div>
            <h2 className={`mt-4 text-2xl font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>No interview history yet</h2>
            <p className={`${isDark ? "text-slate-300" : "text-slate-600"} mt-2`}>
              Start your first AI interview to see your attempts here.
            </p>
            <button
              onClick={() => navigate("/ai-interview/start")}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Start Interview <FaArrowRight />
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {interviews.map((interview) => (
              <div
                key={interview._id}
                onClick={() => navigate(`/ai-interview/report/${interview._id}`)}
                className={`cursor-pointer rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className={`text-xl font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                      {interview.role || "Untitled Interview"}
                    </h2>
                    <p className={`mt-1 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      {interview.experience || "Experience not specified"}
                    </p>
                  </div>

                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(interview.status, isDark)}`}>
                    {interview.status || "Incompleted"}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className={`rounded-xl p-3 ${isDark ? "bg-slate-800" : "bg-slate-50"}`}>
                    <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Mode</p>
                    <p className={`mt-1 font-semibold capitalize ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                      {interview.mode || "mixed"}
                    </p>
                  </div>

                  <div className={`rounded-xl p-3 ${isDark ? "bg-slate-800" : "bg-slate-50"}`}>
                    <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Final Score</p>
                    <p className={`mt-1 inline-flex items-center gap-1 font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                      <FaStar className="text-amber-400" /> {interview.finalScore ?? 0}/10
                    </p>
                  </div>
                </div>

                <div className={`mt-5 flex items-center justify-between border-t pt-4 text-sm ${
                  isDark ? "border-slate-700 text-slate-400" : "border-slate-100 text-slate-500"
                }`}>
                  <span className="inline-flex items-center gap-2">
                    <FaClock /> {new Date(interview.createdAt).toLocaleDateString()}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate("/ai-interview/start")
                    }}
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Practice Again
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default InterviewHistory

