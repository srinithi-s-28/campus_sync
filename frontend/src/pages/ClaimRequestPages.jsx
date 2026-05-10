import React, { useEffect, useState } from "react"
import axios from "axios"
import { serverUrl } from "../main"
import { motion } from "framer-motion"
import { CalendarDays, MapPin, User, BadgeCheck, FileText } from "lucide-react"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { fetchClaimRequests } from "../servers/api"
import { useTheme } from "../context/ThemeContext"

const ClaimRequestPages = () => {
  const { isDark } = useTheme()
  const dispatch = useDispatch()
  const { claimData } = useSelector((state) => state.claim)

  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [scoreInputs, setScoreInputs] = useState({})
  const [reasonInputs, setReasonInputs] = useState({})

  useEffect(() => {
    const load = async () => {
      try {
        await fetchClaimRequests(dispatch)
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load claim requests")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [dispatch])

  useEffect(() => {
    setClaims(claimData || [])
    const initialScores = {}
    ;(claimData || []).forEach((c) => {
      if (c.score !== null && c.score !== undefined) {
        initialScores[c._id] = c.score
      }
    })
    setScoreInputs(initialScores)
  }, [claimData])

  const handleReasonChange = (id, value) => {
    setReasonInputs((prev) => ({ ...prev, [id]: value }))
  }

  const handleScoreChange = (id, value) => {
    setScoreInputs((prev) => ({ ...prev, [id]: value }))
  }

  const handleSaveScore = async (id) => {
    try {
      const rawScore = scoreInputs[id]
      if (rawScore === "" || rawScore === undefined) {
        toast.error("Enter score 0–100")
        return
      }
      const score = Number(rawScore)
      if (Number.isNaN(score) || score < 0 || score > 100) {
        toast.error("Score must be 0–100")
        return
      }

      const payload = { score }
      if (score < 60) payload.rejectReason = reasonInputs[id] || ""

      await axios.patch(`${serverUrl}/api/item/claim/${id}/score`, payload, {
        withCredentials: true,
      })

      toast.success("Score updated")
      setClaims((prev) =>
        prev.map((c) => (c._id === id ? { ...c, score } : c))
      )
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update score")
    }
  }

  return (
    <div
      className={`min-h-screen p-6 ${
        isDark
          ? "bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Claim <span className="text-blue-500">Requests</span>
          </h1>
          <p className={isDark ? "text-blue-200/80 text-sm" : "text-slate-600 text-sm"}>
            Review requests for items you posted
          </p>
        </div>

        {loading && (
          <div className={isDark ? "text-blue-200/70" : "text-slate-500"}>
            Loading requests...
          </div>
        )}

        {!loading && claims.length === 0 && (
          <div className={isDark ? "text-blue-300/70" : "text-slate-500"}>
            No claim requests yet.
          </div>
        )}

        <div className="grid gap-6">
          {claims.map((claim) => (
            <motion.div
              key={claim._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border p-5 ${
                isDark
                  ? "border-blue-500/20 bg-white/5"
                  : "border-slate-200 bg-white shadow-sm"
              }`}
            >
              {/* TOP */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">
                    {claim.item?.title || "Item"}
                  </h2>
                  <p className={isDark ? "text-blue-200/70 text-sm" : "text-slate-500 text-sm"}>
                    {claim.item?.category} • {claim.item?.location}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    claim.status === "approved"
                      ? "bg-green-600 text-white"
                      : claim.status === "rejected"
                      ? "bg-red-600 text-white"
                      : "bg-yellow-500 text-white"
                  }`}
                >
                  {claim.status}
                </span>
              </div>

              {/* INFO PANELS */}
              <div className="mt-4 grid lg:grid-cols-2 gap-6">
                {/* ITEM */}
                <div
                  className={`rounded-xl border p-4 ${
                    isDark
                      ? "border-blue-500/20 bg-slate-900/40"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <h3 className={isDark ? "text-blue-200 text-sm font-semibold mb-3" : "text-slate-700 text-sm font-semibold mb-3"}>
                    Your Posted Item Info
                  </h3>

                  <div className={isDark ? "space-y-2 text-sm text-blue-100/90" : "space-y-2 text-sm text-slate-700"}>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {claim.item?.location || "-"}
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      {claim.item?.date ? new Date(claim.item.date).toLocaleDateString() : "-"}
                    </div>
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="w-4 h-4" />
                      {claim.item?.status || "-"}
                    </div>

                    {claim.item?.images?.[0] && (
                      <img
                        src={claim.item.images[0]}
                        alt="item"
                        className={`mt-2 max-h-36 rounded-lg border object-cover ${
                          isDark ? "border-blue-500/20" : "border-slate-200"
                        }`}
                      />
                    )}
                  </div>
                </div>

                {/* CLAIMANT */}
                <div
                  className={`rounded-xl border p-4 ${
                    isDark
                      ? "border-blue-500/20 bg-slate-900/40"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <h3 className={isDark ? "text-blue-200 text-sm font-semibold mb-3" : "text-slate-700 text-sm font-semibold mb-3"}>
                    Claimant Info
                  </h3>

                  <div className={isDark ? "space-y-2 text-sm text-blue-100/90" : "space-y-2 text-sm text-slate-700"}>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {claim.claimant?.name || "User"}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {claim.lostLocation || "-"}
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      {claim.lostDate ? new Date(claim.lostDate).toLocaleDateString() : "-"}
                    </div>
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 mt-0.5" />
                      {claim.identifyingDetails}
                    </div>

                    {claim.itemImage && (
                      <img
                        src={claim.itemImage}
                        alt="claim"
                        className={`mt-2 max-h-36 rounded-lg border object-cover ${
                          isDark ? "border-blue-500/20" : "border-slate-200"
                        }`}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* META */}
              <div className={isDark ? "mt-4 flex flex-wrap gap-4 text-xs text-blue-200/70" : "mt-4 flex flex-wrap gap-4 text-xs text-slate-500"}>
                Requested: {new Date(claim.createdAt).toLocaleDateString()}
                {claim.score !== null && ` • Score: ${claim.score}`}
              </div>

              {/* SCORE */}
              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap gap-3">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Score 0–100"
                    value={scoreInputs[claim._id] ?? ""}
                    onChange={(e) => handleScoreChange(claim._id, e.target.value)}
                    disabled={claim.status !== "pending"}
                    className={`w-40 px-3 py-2 rounded-lg border ${
                      isDark
                        ? "bg-slate-900 border-blue-500/20 text-white"
                        : "bg-white border-slate-300 text-slate-800"
                    }`}
                  />

                  {Number(scoreInputs[claim._id]) < 60 &&
                    claim.status === "pending" && (
                      <input
                        type="text"
                        placeholder="Reason for rejection"
                        value={reasonInputs[claim._id] ?? ""}
                        onChange={(e) =>
                          handleReasonChange(claim._id, e.target.value)
                        }
                        className={`flex-1 min-w-[220px] px-3 py-2 rounded-lg border ${
                          isDark
                            ? "bg-slate-900 border-blue-500/20 text-white"
                            : "bg-white border-slate-300 text-slate-800"
                        }`}
                      />
                    )}

                  <button
                    onClick={() => handleSaveScore(claim._id)}
                    disabled={claim.status !== "pending"}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm disabled:opacity-50"
                  >
                    Save Score
                  </button>
                </div>

                <div className={isDark ? "text-xs text-blue-200/70" : "text-xs text-slate-500"}>
                  Score ≥60 → Approved • Score &lt;60 → Rejected
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ClaimRequestPages