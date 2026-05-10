import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchMyClaims } from "../servers/api"
import { motion } from "framer-motion"
import {
  CalendarDays,
  MapPin,
  BadgeCheck,
  FileText,
  Mail,
  MessageCircle,
  User,
  Phone,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"

const MyClaim = () => {
  const { isDark } = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { myClaimData } = useSelector((state) => state.claim)

  useEffect(() => {
    fetchMyClaims(dispatch)
  }, [dispatch])

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
            My <span className="text-blue-500">Claims</span>
          </h1>
          <p className={isDark ? "text-blue-200/80 text-sm" : "text-slate-600 text-sm"}>
            Track the status of items you claimed
          </p>
        </div>

        {/* EMPTY */}
        {myClaimData.length === 0 ? (
          <div className={isDark ? "text-blue-300/70" : "text-slate-500"}>
            No claims submitted yet.
          </div>
        ) : (
          <div className="grid gap-6">
            {myClaimData.map((claim) => (
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

                    {claim.status === "approved" && (
                      <p className="mt-2 text-sm text-green-500">
                        Approved! You can collect the item now.
                      </p>
                    )}

                    {claim.status === "rejected" && claim.rejectReason && (
                      <p className="mt-2 text-sm text-red-500">
                        Rejected: {claim.rejectReason}
                      </p>
                    )}
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                      claim.status === "approved"
                        ? "bg-green-600"
                        : claim.status === "rejected"
                        ? "bg-red-600"
                        : "bg-yellow-500"
                    }`}
                  >
                    {claim.status}
                  </span>
                </div>

                {/* PANELS */}
                <div className="mt-4 grid lg:grid-cols-2 gap-6">
                  {/* ITEM */}
                  <InfoPanel isDark={isDark} title="Posted Item Info">
                    <Meta icon={<MapPin />} text={claim.item?.location} />
                    <Meta
                      icon={<CalendarDays />}
                      text={
                        claim.item?.date
                          ? new Date(claim.item.date).toLocaleDateString()
                          : "-"
                      }
                    />

                    {claim.item?.images?.[0] && (
                      <img
                        src={claim.item.images[0]}
                        alt="item"
                        className={`mt-2 max-h-36 rounded-lg border ${
                          isDark ? "border-blue-500/20" : "border-slate-200"
                        }`}
                      />
                    )}
                  </InfoPanel>

                  {/* POSTER */}
                  <InfoPanel isDark={isDark} title="Poster Info">
                    <Meta icon={<User />} text={claim.postedBy?.name} />

                    {claim.postedBy?.email && (
                      <Meta icon={<Mail />} text={claim.postedBy.email} />
                    )}

                    {/* CONTACT */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {claim.postedBy?.email && (
                        <ActionBtn
                          icon={<Mail />}
                          label="Email"
                          onClick={() =>
                            (window.location.href = `mailto:${claim.postedBy.email}`)
                          }
                          color="blue"
                        />
                      )}

                      {claim.postedBy?.phone && (
                        <ActionBtn
                          icon={<Phone />}
                          label="Call"
                          href={`tel:${claim.postedBy.phone}`}
                          color="emerald"
                        />
                      )}

                      {claim.postedBy?._id && (
                        <ActionBtn
                          icon={<MessageCircle />}
                          label="Message"
                          onClick={() => navigate(`/chat/${claim.postedBy._id}`)}
                          color="indigo"
                        />
                      )}
                    </div>
                  </InfoPanel>

                  {/* YOUR CLAIM */}
                  <InfoPanel isDark={isDark} title="Your Claim Details">
                    <Meta icon={<FileText />} text={claim.identifyingDetails} />

                    {claim.lostLocation && (
                      <Meta icon={<MapPin />} text={claim.lostLocation} />
                    )}

                    {claim.lostDate && (
                      <Meta
                        icon={<CalendarDays />}
                        text={new Date(claim.lostDate).toLocaleDateString()}
                      />
                    )}

                    {claim.itemImage && (
                      <img
                        src={claim.itemImage}
                        alt="claim"
                        className={`mt-2 max-h-36 rounded-lg border ${
                          isDark ? "border-blue-500/20" : "border-slate-200"
                        }`}
                      />
                    )}
                  </InfoPanel>
                </div>

                {/* META FOOTER */}
                <div
                  className={
                    isDark
                      ? "mt-4 flex gap-4 text-xs text-blue-200/70"
                      : "mt-4 flex gap-4 text-xs text-slate-500"
                  }
                >
                  Requested: {new Date(claim.createdAt).toLocaleDateString()}
                  {claim.score !== null && ` • Score: ${claim.score}`}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyClaim

/* ---------- INFO PANEL ---------- */
const InfoPanel = ({ title, children, isDark }) => (
  <div
    className={`rounded-xl border p-4 ${
      isDark
        ? "border-blue-500/20 bg-slate-900/40"
        : "border-slate-200 bg-slate-50"
    }`}
  >
    <h3
      className={
        isDark
          ? "text-blue-200 text-sm font-semibold mb-3"
          : "text-slate-700 text-sm font-semibold mb-3"
      }
    >
      {title}
    </h3>
    <div
      className={
        isDark
          ? "space-y-2 text-sm text-blue-100/90"
          : "space-y-2 text-sm text-slate-700"
      }
    >
      {children}
    </div>
  </div>
)

/* ---------- META ---------- */
const Meta = ({ icon, text }) => (
  <div className="flex items-center gap-2">
    {React.cloneElement(icon, { className: "w-4 h-4" })}
    <span>{text || "-"}</span>
  </div>
)

/* ---------- ACTION BUTTON ---------- */
const ActionBtn = ({ icon, label, onClick, href, color }) => {
  const base =
    "px-3 py-2 rounded-lg text-white text-sm flex items-center gap-2"
  const colors = {
    blue: "bg-blue-600 hover:bg-blue-500",
    emerald: "bg-emerald-600 hover:bg-emerald-500",
    indigo: "bg-indigo-600 hover:bg-indigo-500",
  }

  if (href)
    return (
      <a href={href} className={`${base} ${colors[color]}`}>
        {icon}
        {label}
      </a>
    )

  return (
    <button onClick={onClick} className={`${base} ${colors[color]}`}>
      {icon}
      {label}
    </button>
  )
}