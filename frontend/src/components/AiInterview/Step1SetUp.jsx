import React, { useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  FaUserTie,
  FaMicrophoneAlt,
  FaChartLine,
  FaFileUpload,
  FaCheckCircle,
} from "react-icons/fa"
import axios from "axios"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { updateCreadits } from "../../redux/userSlice"
import { serverUrl } from "../../main"
import { useTheme } from "../../context/ThemeContext"

const features = [
  {
    icon: <FaUserTie className="text-blue-600 text-xl" />,
    text: "Choose Role & Experience",
  },
  {
    icon: <FaMicrophoneAlt className="text-blue-600 text-xl" />,
    text: "Smart Voice Interview",
  },
  {
    icon: <FaChartLine className="text-blue-600 text-xl" />,
    text: "Performance Analytics",
  },
]

const Step1SetUp = ({ onStart }) => {
  const dispatch = useDispatch()
  const userData = useSelector((state) => state.user.userData)
  const { isDark } = useTheme()

  const [role, setRole] = useState("")
  const [experience, setExperience] = useState("")
  const [mode, setMode] = useState("")
  const [resume, setResume] = useState(null)

  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [resumeText, setResumeText] = useState("")
  const [analysisDone, setAnalysisDone] = useState(false)
  const [analysing, setAnalysing] = useState(false)

  const canStart = useMemo(() => {
    return role.trim() && experience && mode && !loading
  }, [role, experience, mode, loading])

  /* ---------- RESUME ANALYSIS ---------- */

  const handleUploadResume = async () => {

    if (!resume) {
      toast.error("Please upload your resume first.")
      return
    }

    if (analysing) return

    setAnalysing(true)

    const toastId = toast.loading("Analyzing your resume...")

    try {
      const formdata = new FormData()
      formdata.append("resume", resume)

      const result = await axios.post(
        `${serverUrl}/api/interview/resume`,
        formdata,
        { withCredentials: true }
      )

      const data = result?.data || {}
      setProjects(data.projects || [])
      setSkills(data.skills || [])
      setResumeText(data.resumeText || data.text || "")
      setAnalysisDone(true)

      toast.success("Resume analyzed successfully!", { id: toastId })
    } catch (error) {
      console.error(error)
      setAnalysisDone(false)
      toast.error(
        error?.response?.data?.message ||
          "Resume analysis failed. Please upload a valid PDF.",
        { id: toastId }
      )
    } finally {
      setAnalysing(false)
    }
  }

  /* ---------- START INTERVIEW ---------- */

  const handleSubmit = async () => {

    if (!role.trim() || !experience || !mode) {
      toast.error("Please fill in role, experience, and interview mode.")
      return
    }

    setLoading(true)
    const toastId = toast.loading("Generating interview questions...")

    try {
      const result = await axios.post(
        `${serverUrl}/api/interview/generate-questions`,
        {
          role: role.trim(),
          experience,
          mode,
          resumeText,
          projects,
          skills,
        },
        { withCredentials: true }
      )

      toast.success("Interview ready! Let's go.", { id: toastId })

      if (result.data.remainingCredits !== undefined) {
        dispatch(updateCreadits(result.data.remainingCredits))
      }

      onStart(result.data.interview)

    } catch (error) {
      console.error(error)
      toast.error(
        error?.response?.data?.message || "Failed to start interview. Try again.",
        { id: toastId }
      )
      setLoading(false)
    }
  }

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 transition-all duration-300 ${
      isDark ? "text-white" : "text-black"
    }`}>
      <div className="grid lg:grid-cols-2 gap-8 xl:gap-12 items-start">

        {/* LEFT SIDE */}

        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="space-y-6"
        >

          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
            isDark ? "bg-blue-500/15 text-blue-300 border-blue-500/30" : "bg-blue-50 text-blue-700 border-blue-100"
          }`}>
            AI Interview Setup
          </span>

          <h2 className={`text-3xl sm:text-4xl font-bold leading-tight ${isDark ? "text-slate-100" : "text-slate-900"}`}>
            Start Your AI Interview
          </h2>

          <p className={`text-sm sm:text-base max-w-xl ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            Practice real interview scenarios powered by AI.
            Improve communication, technical skills, and confidence.
          </p>

          <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">

            {features.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                className={`rounded-xl border p-4 shadow-sm transition-all duration-300 ${
                  isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"
                }`}
              >
                <div className="mb-2">{item.icon}</div>
                <span className={`text-xs sm:text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>


        {/* RIGHT SIDE FORM */}

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className={`relative overflow-hidden rounded-2xl border p-6 sm:p-7 shadow-lg transition-all duration-300 ${
            isDark ? "border-slate-700 bg-slate-900/95" : "border-slate-200 bg-white/95"
          }`}
        >
          <div className={`absolute -top-24 -right-24 h-56 w-56 rounded-full blur-3xl ${
            isDark ? "bg-blue-500/20" : "bg-blue-100/60"
          }`} />

          <div className="relative space-y-5">

            {/* ROLE */}

            <div>
              <label className={`text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                Job Role
              </label>

              <input
                type="text"
                placeholder="Frontend Developer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={`w-full mt-1 p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 ${
                  isDark ? "border-slate-700 bg-slate-800 text-slate-100" : "border-slate-300 bg-white text-slate-900"
                }`}
              />
            </div>


            {/* EXPERIENCE */}

            <div>
              <label className={`text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                Experience Level
              </label>

              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className={`w-full mt-1 p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 ${
                  isDark ? "border-slate-700 bg-slate-800 text-slate-100" : "border-slate-300 bg-white text-slate-900"
                }`}
              >
                <option value="">Select Experience</option>
                <option value="fresher">Fresher</option>
                <option value="1-2">1-2 Years</option>
                <option value="3-5">3-5 Years</option>
                <option value="5+">5+ Years</option>
              </select>
            </div>


            {/* MODE */}

            <div>
              <label className={`text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                Interview Mode
              </label>

              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className={`w-full mt-1 p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 ${
                  isDark ? "border-slate-700 bg-slate-800 text-slate-100" : "border-slate-300 bg-white text-slate-900"
                }`}
              >
                <option value="">Select Mode</option>
                <option value="technical">Technical</option>
                <option value="hr">HR Interview</option>
               
              </select>
            </div>


            {/* RESUME */}

            <div>
              <label className={`text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                Upload Resume (PDF)
              </label>

              <label
                htmlFor="resume-upload"
                className={`mt-2 flex items-center justify-center gap-2 w-full border border-dashed rounded-lg p-3.5 cursor-pointer transition-all duration-300 hover:border-blue-500 ${
                  isDark ? "border-slate-700 hover:bg-blue-500/10" : "border-slate-300 hover:bg-blue-50"
                }`}
              >
                <FaFileUpload className="text-blue-600 text-lg" />
                <span className={`text-sm font-medium truncate ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                  {resume ? resume.name : "Choose your resume file"}
                </span>
              </label>

              <input
                id="resume-upload"
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0] || null
                  setResume(selectedFile)
                  setAnalysisDone(false)
                  setProjects([])
                  setSkills([])
                  setResumeText("")
                }}
                className="hidden"
              />

              {resume && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUploadResume()
                  }}
                  disabled={analysing}
                  className={`mt-3 text-white px-5 py-2 rounded-lg disabled:opacity-70 transition-all duration-300 ${
                    isDark ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-900 hover:bg-slate-800"
                  }`}
                >
                  {analysing ? "Analyzing..." : "Analyze Resume"}
                </motion.button>
              )}

              {analysisDone && (
                <p className="mt-2 text-xs text-emerald-600 font-medium inline-flex items-center gap-1">
                  <FaCheckCircle /> Resume analyzed successfully.
                </p>
              )}

            </div>


            {/* SHOW ANALYSIS */}

            {analysisDone && (

              <div className={`border rounded-xl p-3.5 space-y-3 transition-all duration-300 ${
                isDark ? "border-blue-500/30 bg-blue-500/10" : "border-blue-100 bg-blue-50/50"
              }`}>

                {/* SKILLS */}

                <div>

                  <p className={`text-sm font-semibold mb-2 ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                    Detected Skills
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 text-xs rounded-full ${
                          isDark ? "bg-blue-500/20 text-blue-200" : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {skill}
                      </span>
                    ))}

                  </div>

                </div>


                {/* PROJECTS */}

                {projects.length > 0 && (

                  <div>

                    <p className={`text-sm font-semibold mb-1 ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                      Projects
                    </p>

                    <ul className={`text-sm list-disc ml-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>

                      {projects.map((project, index) => (
                        <li key={index}>{project}</li>
                      ))}

                    </ul>

                  </div>

                )}

              </div>

            )}

            {/* START BUTTON */}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={!canStart}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Starting..." : "Start Interview"}
            </motion.button>

          </div>

        </motion.div>

      </div>

    </div>

  )
}

export default Step1SetUp