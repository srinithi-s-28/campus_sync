import React, { useState } from "react"
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { signInWithPopup } from "firebase/auth"
import { auth, provider } from "../utils/firebase"
import toast from "react-hot-toast"
import axios from "axios"
import { serverUrl } from "../main"
import { useDispatch } from "react-redux"
import { setUserData } from "../redux/userSlice"
import { useTheme } from "../context/ThemeContext"

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isDark } = useTheme()

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  /* ---------- LOGIN ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await axios.post(
        `${serverUrl}/api/user/login`,
        formData,
        { withCredentials: true }
      )
      dispatch(setUserData(res.data.user))
      toast.success("Login successful 🎉")
      navigate("/")
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  /* ---------- GOOGLE ---------- */
  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      const response = await signInWithPopup(auth, provider)
      const { user } = response

      const res = await axios.post(
        `${serverUrl}/api/user/google-login`,
        { email: user.email },
        { withCredentials: true }
      )
      dispatch(setUserData(res.data.user))
      toast.success("Google login successful 🎉")
      navigate("/")
    } catch (error) {
      toast.error(error.response?.data?.message || "Google login failed")
    } finally {
      setLoading(false)
    }
  }

  /* ---------- THEME COLORS ---------- */
  const pageBg = isDark
    ? "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950"
    : "bg-gradient-to-br from-white via-blue-50 to-white"

  const cardBg = isDark
    ? "bg-white/5 border-blue-500/30"
    : "bg-white border-slate-200"

  const labelColor = isDark ? "text-slate-300" : "text-slate-700"

  const inputBg = isDark
    ? "bg-slate-900/70 border-blue-500/30 text-white placeholder:text-slate-400"
    : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"

  const dividerBg = isDark ? "bg-slate-950" : "bg-white"
  const dividerText = isDark ? "text-slate-400" : "text-slate-500"

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 sm:py-10 ${pageBg}`}>
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl shadow-2xl p-6 sm:p-8 border backdrop-blur-xl ${cardBg}`}
        >
          {/* HEADER */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-white text-lg sm:text-xl font-bold">CS</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-blue-500 mb-2">
              Welcome Back
            </h1>
            <p className={`${labelColor} text-sm sm:text-base`}>
              Login to continue to Campus Sync
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* EMAIL */}
            <div>
              <label className={`text-sm font-semibold mb-2 block ${labelColor}`}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@email.com"
                className={`w-full px-4 py-3 rounded-xl border ${inputBg}`}
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className={`text-sm font-semibold mb-2 block ${labelColor}`}>
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-xl border pr-12 ${inputBg}`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* LOGIN */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-xl shadow-lg"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="relative my-6">
            <div className="border-t border-blue-500/20"></div>
            <span
              className={`absolute left-1/2 -translate-x-1/2 -top-3 px-3 text-xs ${dividerText} ${dividerBg}`}
            >
              OR CONTINUE WITH
            </span>
          </div>

          {/* GOOGLE */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`w-full py-3 rounded-xl flex items-center justify-center gap-3 border ${
              isDark
                ? "border-blue-500/30 text-white"
                : "border-slate-300 text-slate-800 bg-white"
            }`}
          >
            <FaGoogle className="text-blue-500" />
            {loading ? "Connecting..." : "Continue with Google"}
          </button>

          {/* SIGNUP */}
          <p className={`text-center text-sm mt-6 ${labelColor}`}>
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-500 font-semibold">
              Sign Up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Login