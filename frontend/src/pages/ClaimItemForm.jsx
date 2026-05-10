import React, { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { MapPin, CalendarDays, UploadCloud } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { fetchItems } from "../servers/api"
import axios from "axios"
import { serverUrl } from "../main"
import toast from "react-hot-toast"
import { useTheme } from "../context/ThemeContext"

const ClaimItemForm = ({ item: itemProp }) => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { itemData } = useSelector((state) => state.item)
  const { isDark } = useTheme()

  useEffect(() => {
    if (!itemData || itemData.length === 0) {
      fetchItems(dispatch)
    }
  }, [dispatch, itemData])

  const item = useMemo(
    () => itemProp || itemData.find((i) => i._id === id),
    [itemProp, itemData, id]
  )

  const [form, setForm] = useState({
    identifyingDetails: "",
    lostLocation: "",
    lostDate: "",
    itemImage: null,
  })

  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)

  const handleChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleImage = (file) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file")
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB")
      return
    }

    setForm((p) => ({ ...p, itemImage: file }))

    // Create preview using URL.createObjectURL
    try {
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)

      // Cleanup function to revoke URL when component unmounts or new file is selected
      return () => URL.revokeObjectURL(objectUrl)
    } catch (error) {
      console.error("Error creating preview:", error)
      toast.error("Failed to create image preview")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData()
    Object.entries(form).forEach(([k, v]) => v && data.append(k, v))
    data.append("itemId", item._id)

    try {
      setLoading(true)
      await axios.post(`${serverUrl}/api/item/claim/${item._id}`, data, {
        withCredentials: true,
      })
      toast.success("Claim submitted successfully")
      setForm({
        identifyingDetails: "",
        lostLocation: "",
        lostDate: "",
        itemImage: null,
      })
      setPreview(null)
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit claim")
    } finally {
      setLoading(false)
    }
  }

  if (!item) {
    return (
      <div
        className={`min-h-screen p-6 ${
          isDark
            ? "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white"
            : "bg-slate-50 text-slate-900"
        }`}
      >
        <div className="max-w-2xl mx-auto">
          Loading claim form...
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen p-6 ${
        isDark
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-2xl mx-auto mt-10 p-6 rounded-2xl border shadow-xl space-y-5 ${
          isDark
            ? "bg-white/5 border-blue-500/20"
            : "bg-white border-slate-200"
        }`}
      >
        {/* HEADER */}
        <div>
          <h2 className="text-2xl font-bold">Claim Item</h2>
          <p className={isDark ? "text-blue-200/80 text-sm" : "text-slate-600 text-sm"}>
            Provide details so the owner can verify the item belongs to you
          </p>
        </div>

        {/* ITEM SUMMARY */}
        <div
          className={`p-4 rounded-xl border ${
            isDark
              ? "bg-white/5 border-blue-500/20"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          <p className="font-semibold">{item.title}</p>
          <p className={isDark ? "text-blue-300/70 text-xs" : "text-slate-500 text-xs"}>
            {item.category} • {item.location}
          </p>
        </div>

        {/* IDENTIFYING */}
        <div>
          <label className={isDark ? "text-blue-200 text-sm" : "text-slate-700 text-sm"}>
            Identifying Details *
          </label>
          <textarea
            required
            rows={4}
            value={form.identifyingDetails}
            onChange={(e) =>
              handleChange("identifyingDetails", e.target.value)
            }
            className={`w-full mt-1 px-4 py-3 rounded-lg border ${
              isDark
                ? "bg-slate-900 border-blue-500/20 text-white"
                : "bg-white border-slate-300 text-slate-900"
            }`}
          />
        </div>

        {/* LOST LOCATION */}
        <Input
          isDark={isDark}
          icon={<MapPin size={16} />}
          label="Where did you lose it?"
          value={form.lostLocation}
          onChange={(v) => handleChange("lostLocation", v)}
        />

        {/* LOST DATE */}
        <Input
          isDark={isDark}
          icon={<CalendarDays size={16} />}
          label="When did you lose it?"
          type="date"
          value={form.lostDate}
          onChange={(v) => handleChange("lostDate", v)}
        />

        {/* IMAGE */}
        <div>
          <label className={isDark ? "text-blue-200 text-sm" : "text-slate-700 text-sm"}>
            Proof Image (optional)
          </label>

          <label
            className={`mt-2 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-5 cursor-pointer ${
              isDark
                ? "border-blue-500/30 hover:border-blue-400"
                : "border-slate-300 hover:border-blue-400"
            }`}
          >
            <UploadCloud className={isDark ? "text-blue-400 mb-2" : "text-blue-500 mb-2"} />
            <span className={isDark ? "text-blue-200 text-sm" : "text-slate-600 text-sm"}>
              Upload proof photo
            </span>

            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleImage(e.target.files?.[0])}
            />
          </label>

          {preview && (
            <img
              src={preview}
              alt="proof"
              className={`mt-3 rounded-lg max-h-40 border ${
                isDark ? "border-blue-500/20" : "border-slate-200"
              }`}
            />
          )}
        </div>

        {/* SUBMIT */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Claim"}
        </motion.button>
      </motion.form>
    </div>
  )
}

export default ClaimItemForm

/* ---------- INPUT ---------- */
const Input = ({ label, value, onChange, type = "text", icon, required, isDark }) => (
  <div>
    <label className={isDark ? "text-blue-200 text-sm" : "text-slate-700 text-sm"}>
      {label} {required && "*"}
    </label>
    <div className="relative mt-1">
      {icon && (
        <div className={isDark ? "absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" : "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"}>
          {icon}
        </div>
      )}
      <input
        required={required}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 rounded-lg border ${
          isDark
            ? "bg-slate-900 border-blue-500/20 text-white"
            : "bg-white border-slate-300 text-slate-900"
        } ${icon ? "pl-10" : ""}`}
      />
    </div>
  </div>
)