import React, { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  IndianRupee,
  Tag,
  MapPin,
  User,
  Mail,
  Clock,
  ShoppingBag,
  Info,
  Package,
  MessageCircle,
  Phone,
} from "lucide-react"
import { fetchMarketplaceItemById } from "../servers/api"
import toast from "react-hot-toast"
import { useTheme } from "../context/ThemeContext"
import { useSelector, useDispatch } from "react-redux"
import { setSelectedUser } from "../redux/messageSlice"

const MarketItemDetailPage = () => {
  const { isDark } = useTheme()
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.user)

  const [item, setItem] = useState(null)
  const [relatedItems, setRelatedItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const loadItem = async () => {
      try {
        setLoading(true)
        const data = await fetchMarketplaceItemById(id)
        setItem(data.item)
        console.log("marketitem->",item);
        
        setRelatedItems(data.relatedItems || [])
      } catch {
        toast.error("Failed to load item")
        navigate("/sell")
      } finally {
        setLoading(false)
      }
    }
    loadItem()
  }, [id, navigate])

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white"
          : "bg-slate-50 text-slate-900"
      }`}>
        Loading...
      </div>
    )
  }

  if (!item) return null

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })

  const conditionLabels = {
    new: "Brand New",
    like_new: "Like New",
    good: "Good Condition",
    fair: "Fair Condition",
  }

  const statusColors = {
    available: "text-green-500",
    sold: "text-red-500",
    reserved: "text-yellow-500",
  }

  return (
    <div className={`min-h-screen p-6 ${
      isDark
        ? "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white"
        : "bg-slate-50 text-slate-900"
    }`}>
      <div className="max-w-7xl mx-auto">

        {/* BACK */}
        <button
          onClick={() => navigate("/sell")}
          className={isDark
            ? "flex items-center gap-2 text-blue-300 hover:text-blue-200 mb-6"
            : "flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Marketplace
        </button>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* IMAGES */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-2xl overflow-hidden border aspect-square ${
                isDark
                  ? "border-blue-500/20 bg-slate-900/50"
                  : "border-slate-200 bg-white"
              }`}
            >
              {item.images?.length ? (
                <img
                  src={item.images[selectedImage]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={isDark
                  ? "w-full h-full flex items-center justify-center text-blue-300/30"
                  : "w-full h-full flex items-center justify-center text-slate-400"}>
                  <ShoppingBag className="w-24 h-24" />
                </div>
              )}
            </motion.div>

            {item.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {item.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`rounded-lg overflow-hidden border-2 ${
                      selectedImage === i
                        ? "border-blue-500"
                        : isDark
                        ? "border-blue-500/20"
                        : "border-slate-200"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover"/>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <h1 className="text-3xl font-bold">{item.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium uppercase ${
                  statusColors[item.status]
                } ${isDark ? "bg-white/10" : "bg-slate-100"}`}>
                  {item.status}
                </span>
              </div>

              <div className="flex items-center gap-1 text-4xl font-bold text-green-500">
                <IndianRupee className="w-8 h-8"/>
                {item.price}
              </div>
            </div>

            {/* INFO GRID */}
            <div className={`grid grid-cols-2 gap-4 p-4 rounded-xl border ${
              isDark
                ? "bg-white/5 border-blue-500/20"
                : "bg-white border-slate-200"
            }`}>
              <InfoItem isDark={isDark} icon={<Tag/>} label="Category" value={item.category}/>
              <InfoItem isDark={isDark} icon={<Info/>} label="Condition"
                value={conditionLabels[item.condition] || item.condition}/>
              <InfoItem isDark={isDark} icon={<Clock/>} label="Posted"
                value={formatDate(item.createdAt)}/>
              {item.location && (
                <InfoItem isDark={isDark} icon={<MapPin/>} label="Location"
                  value={item.location}/>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className={`p-4 rounded-xl border ${
              isDark
                ? "bg-white/5 border-blue-500/20"
                : "bg-white border-slate-200"
            }`}>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Package className={isDark ? "text-blue-400" : "text-blue-500"} />
                Description
              </h3>
              <p className={isDark ? "text-blue-100/80" : "text-slate-600"}>
                {item.description}
              </p>
            </div>

            {/* SELLER */}
            <div className={`p-4 rounded-xl border ${
              isDark
                ? "bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border-blue-500/30"
                : "bg-slate-50 border-slate-200"
            }`}>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <User className={isDark ? "text-blue-400" : "text-blue-500"} />
                Seller Information
              </h3>

              <div className={isDark ? "space-y-2 text-blue-200" : "space-y-2 text-slate-700"}>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4"/>
                  {item.seller?.name}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4"/>
                  {item.seller?.email}
                </div>
                {item.seller?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4"/>
                    {item.seller.phone}
                  </div>
                )}
              </div>

              {item.status === "available" && userData?._id !== item.seller?._id && (
                <div className="mt-4 space-y-3">
                  <h4 className="font-medium text-sm">Contact Seller</h4>
                  <div className="flex flex-wrap gap-2">
                    <ContactBtn
                      icon={<MessageCircle />}
                      label="Message"
                      onClick={() => {
                        dispatch(
                          setSelectedUser({
                            _id: item?.seller?._id,
                            name: item?.seller?.name || "User",
                            profileImage: item?.seller?.profileImage || item?.seller?.ProfileImage || "",
                          })
                        )
                        navigate('/chat')
                      }}
                      color="indigo"
                    />
                    <ContactBtn
                      icon={<Mail />}
                      label="Email"
                      onClick={() => {
                        const subject = `Interested in: ${item.title}`
                        window.location.href = `mailto:${item.seller?.email}?subject=${encodeURIComponent(subject)}`
                      }}
                      color="blue"
                    />
                    {item.seller?.phone && (
                      <ContactBtn
                        icon={<Phone />}
                        label="Call"
                        onClick={() => window.location.href = `tel:${item.seller.phone}`}
                        color="green"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RELATED */}
        {relatedItems.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Tag className={isDark ? "text-blue-400" : "text-blue-500"} />
              Related Items
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedItems.map((rel) => (
                <Link key={rel._id} to={`/sell/${rel._id}`}
                  className={`block rounded-2xl border overflow-hidden ${
                    isDark
                      ? "border-blue-500/20 bg-white/5"
                      : "border-slate-200 bg-white"
                  }`}>
                  <div className={isDark ? "h-40 bg-slate-800" : "h-40 bg-slate-100"}>
                    {rel.images?.[0] ? (
                      <img src={rel.images[0]} alt="" className="w-full h-full object-cover"/>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ShoppingBag className="w-12 h-12"/>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-sm">{rel.title}</h3>
                    <div className="flex items-center gap-1 text-lg font-bold text-green-500">
                      <IndianRupee className="w-4 h-4"/>
                      {rel.price}
                    </div>
                    <div className={isDark ? "text-blue-300/70 text-xs" : "text-slate-500 text-xs"}>
                      {rel.category}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MarketItemDetailPage

/* ---------- INFO ITEM ---------- */
const InfoItem = ({ icon, label, value, isDark }) => (
  <div>
    <div className={isDark ? "flex items-center gap-1.5 text-xs text-blue-300/70" : "flex items-center gap-1.5 text-xs text-slate-500"}>
      {React.cloneElement(icon, { className: "w-3.5 h-3.5" })}
      {label}
    </div>
    <div className={isDark ? "font-medium text-blue-100" : "font-medium text-slate-900"}>
      {value}
    </div>
  </div>
)

/* ---------- CONTACT BUTTON ---------- */
const ContactBtn = ({ icon, label, onClick, color }) => {
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
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium shadow ${colors[color]}`}
    >
      {React.cloneElement(icon, { className: "w-4 h-4" })}
      {label}
    </motion.button>
  )
}