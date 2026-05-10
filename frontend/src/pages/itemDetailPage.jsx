import React, { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import {
  MapPin,
  CalendarDays,
  Tag,
  Mail,
  MessageCircle,
  User,
  ArrowLeft,
  Clock,
  BadgeCheck,
  FileSearch,
  Phone,
} from "lucide-react"
import { fetchItems } from "../servers/api"
import { useTheme } from "../context/ThemeContext"
import { setSelectedUser } from "../redux/messageSlice"

const ItemDetailPage = () => {
  const { isDark } = useTheme()
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { itemData } = useSelector((state) => state.item)
  const { userData } = useSelector((state) => state.user)
  

  useEffect(() => {
    if (!itemData || itemData.length === 0) {
      fetchItems(dispatch)
    }
  }, [dispatch, itemData])

  const item = itemData.find((i) => i._id === id)

  if (!item) {
    return (
      <div
        className={`min-h-screen p-6 ${
          isDark
            ? "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white"
            : "bg-slate-50 text-slate-900"
        }`}
      >
        Loading item...
      </div>
    )
  }

  const isOwnItem = userData?._id === item.postedBy?._id

  const related = itemData
    .filter((i) => i.category === item.category && i._id !== id)
    .slice(0, 4)

  const handleEmail = () => {
    const subject = `Regarding your ${item.type} item: ${item.title}`
    window.location.href = `mailto:${item.postedBy?.email}?subject=${encodeURIComponent(
      subject
    )}`
  }

  const handleMessage = () => {
    dispatch(
      setSelectedUser({
        _id: item?.postedBy?._id,
        name: item?.postedBy?.name || "User",
        profileImage: item?.postedBy?.profileImage || item?.postedBy?.ProfileImage || "",
      })
    )
    navigate(`/chat`)
  }

  return (
    <div
      className={`min-h-screen p-6 ${
        isDark
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="max-w-7xl mx-auto">

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className={
            isDark
              ? "inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 mb-6"
              : "inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
          }
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* IMAGE */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div
              className={`rounded-2xl overflow-hidden border ${
                isDark
                  ? "border-blue-500/20 bg-white/5"
                  : "border-slate-200 bg-white"
              }`}
            >
              {item.images?.[0] ? (
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div
                  className={`h-96 flex items-center justify-center ${
                    isDark ? "text-blue-300/40" : "text-slate-400"
                  }`}
                >
                  No Image
                </div>
              )}
            </div>
          </motion.div>

          {/* DETAILS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* TYPE */}
            <span
              className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                item.type === "lost"
                  ? "bg-red-500 text-white"
                  : "bg-green-500 text-white"
              }`}
            >
              {item.type?.toUpperCase()}
            </span>

            <h1 className="text-3xl font-bold">{item.title}</h1>

            {/* META */}
            <div
              className={`grid sm:grid-cols-2 gap-3 text-sm ${
                isDark ? "text-blue-200/80" : "text-slate-600"
              }`}
            >
              <Meta icon={<MapPin />} text={item.location} />
              <Meta
                icon={<CalendarDays />}
                text={`Lost/Found: ${new Date(item.date).toLocaleDateString()}`}
              />
              <Meta
                icon={<Clock />}
                text={`Posted: ${new Date(item.createdAt).toLocaleDateString()}`}
              />
              <Meta icon={<Tag />} text={`Category: ${item.category}`} />
              <Meta icon={<BadgeCheck />} text={`Status: ${item.status}`} />
            </div>

            {/* DESCRIPTION */}
            <p className={isDark ? "text-blue-100/90" : "text-slate-700"}>
              {item.description}
            </p>

            {/* USER CARD */}
            <div
              className={`rounded-xl border p-4 flex items-center gap-3 ${
                isDark
                  ? "bg-white/5 border-blue-500/20"
                  : "bg-white border-slate-200"
              }`}
            >
              <div
                className={`p-3 rounded-full ${
                  isDark ? "bg-blue-500/20" : "bg-blue-100"
                }`}
              >
                <User
                  className={
                    isDark ? "w-5 h-5 text-blue-300" : "w-5 h-5 text-blue-600"
                  }
                />
              </div>

              <div>
                <p className="font-semibold">{item.postedBy?.name}</p>
                <p
                  className={
                    isDark ? "text-xs text-blue-300/70" : "text-xs text-slate-500"
                  }
                >
                  Posted this item
                </p>
                {item.postedBy?.email && (
                  <p
                    className={
                      isDark ? "text-xs text-blue-200/80" : "text-xs text-slate-500"
                    }
                  >
                    {item.postedBy.email}
                  </p>
                )}
                {item.postedBy?.phone && (
                  <p
                    className={
                      isDark ? "text-xs text-blue-200/80" : "text-xs text-slate-500"
                    }
                  >
                    {item.postedBy.phone}
                  </p>
                )}
              </div>
            </div>

            {/* CONTACT */}
            {!isOwnItem && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Contact & Actions</h3>

                <div className="flex flex-wrap gap-3">
                  <ActionBtn icon={<Mail />} label="Email" onClick={handleEmail} color="blue"/>
                  <ActionBtn icon={<MessageCircle />} label="Message" onClick={handleMessage} color="indigo"/>
                  {item.postedBy?.phone && (
                    <ActionBtn
                      icon={<Phone />}
                      label="Call"
                      onClick={() => window.location.href = `tel:${item.postedBy.phone}`}
                      color="green"
                    />
                  )}
                  <ActionBtn
                    icon={<FileSearch />}
                    label="Claim This Item"
                    onClick={() => navigate(`/claim-item/${item._id}`)}
                    color="green"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* RELATED */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-6">Related Items</h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((r) => (
                <motion.div
                  key={r._id}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/item/${r._id}`)}
                  className={`cursor-pointer rounded-xl border overflow-hidden ${
                    isDark
                      ? "border-blue-500/20 bg-white/5"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className={isDark ? "h-40 bg-slate-800" : "h-40 bg-slate-100"}>
                    {r.images?.[0] && (
                      <img src={r.images[0]} alt={r.title} className="w-full h-full object-cover"/>
                    )}
                  </div>

                  <div className="p-3">
                    <p className="font-semibold truncate">{r.title}</p>
                    <p className={isDark ? "text-xs text-blue-300/70" : "text-xs text-slate-500"}>
                      {r.location}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ItemDetailPage

/* ---------- META ---------- */
const Meta = ({ icon, text }) => (
  <span className="flex items-center gap-2">
    {React.cloneElement(icon, { className: "w-4 h-4" })}
    {text}
  </span>
)

/* ---------- ACTION BUTTON ---------- */
const ActionBtn = ({ icon, label, onClick, color }) => {
  const colors = {
    blue: "bg-blue-500 hover:bg-blue-600",
    indigo: "bg-indigo-600 hover:bg-indigo-700",
    green: "bg-green-600 hover:bg-green-700",
  }
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white shadow ${colors[color]}`}
    >
      {React.cloneElement(icon, { className: "w-4 h-4" })}
      {label}
    </motion.button>
  )
}