import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  fetchMarketplaceItems,
  deleteMarketplaceItem,
  updateMarketplaceItem,
} from "../servers/api"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Pencil, Trash2, Eye, Plus } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

const UserSellPost = () => {
  const { isDark } = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items } = useSelector((state) => state.marketplace)
  const { userData } = useSelector((state) => state.user)

  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
  })
  const [loading, setLoading] = useState(false)

  /* ---------- THEME ---------- */
  const pageBg = isDark
    ? "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white"
    : "bg-gradient-to-br from-white via-blue-50 to-white text-slate-900"

  const cardBg = isDark
    ? "bg-white/5 border-blue-500/20"
    : "bg-white border-slate-200 shadow-sm"

  const textMuted = isDark ? "text-blue-300/70" : "text-slate-500"
  const descText = isDark ? "text-blue-200/80" : "text-slate-600"

  const inputStyle = isDark
    ? "bg-slate-900/60 border-blue-500/20 text-white"
    : "bg-white border-slate-300 text-slate-900"

  useEffect(() => {
    fetchMarketplaceItems(dispatch, { category: "all", status: "all", search: "" })
  }, [dispatch])

  const myItems = (items || []).filter(
    (i) => i?.seller?._id === userData?._id && i?.isActive !== false
  )

  const startEdit = (item) => {
    setEditingId(item._id)
    setForm({
      title: item.title || "",
      price: item.price || "",
      category: item.category || "",
      description: item.description || "",
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({ title: "", price: "", category: "", description: "" })
  }

  const submitEdit = async (id) => {
    setLoading(true)
    const res = await updateMarketplaceItem(id, form)
    setLoading(false)

    if (!res?.error) {
      fetchMarketplaceItems(dispatch, { category: "all" })
      cancelEdit()
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Delete this item?")) return
    const res = await deleteMarketplaceItem(id)
    if (!res?.error) {
      fetchMarketplaceItems(dispatch, { category: "all" })
    }
  }

  return (
    <div className={`min-h-screen p-6 ${pageBg}`}>
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">My Sell Posts</h2>

          <button
            onClick={() => navigate("/sell/add")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow"
          >
            <Plus className="w-4 h-4" />
            New Item
          </button>
        </div>

        {/* EMPTY */}
        {myItems.length === 0 && (
          <div className={`text-center py-20 ${textMuted}`}>
            No items listed yet
          </div>
        )}

        {/* GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myItems.map((item) => (
            <motion.div
              key={item._id}
              whileHover={{ y: -4 }}
              className={`rounded-2xl border overflow-hidden flex flex-col ${cardBg}`}
            >
              {/* IMAGE */}
              <div className={isDark ? "h-48 bg-slate-900/50" : "h-48 bg-slate-100"}>
                {item.images?.[0] ? (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`h-full flex items-center justify-center ${textMuted}`}>
                    No Image
                  </div>
                )}
              </div>

              {/* BODY */}
              <div className="p-4 flex flex-col flex-1">

                {/* TITLE + PRICE */}
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold line-clamp-1">
                    {item?.title}
                  </h3>
                  <span className="text-blue-500 font-semibold">
                    ₹{item?.price}
                  </span>
                </div>

                {/* CATEGORY */}
                <span className={`text-xs mt-1 ${textMuted}`}>
                  {item?.category}
                </span>

                {/* DESC */}
                <p className={`text-sm mt-2 line-clamp-2 flex-1 ${descText}`}>
                  {item?.description}
                </p>

                {/* EDIT MODE */}
                {editingId === item?._id && (
                  <div className="mt-3 space-y-2">
                    <input
                      value={form.title}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, title: e.target.value }))
                      }
                      className={`w-full px-3 py-2 rounded border ${inputStyle}`}
                    />
                    <input
                      value={form.price}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, price: e.target.value }))
                      }
                      className={`w-full px-3 py-2 rounded border ${inputStyle}`}
                    />
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, description: e.target.value }))
                      }
                      className={`w-full px-3 py-2 rounded border ${inputStyle}`}
                    />

                    <div className="flex gap-2">
                      <button
                        disabled={loading}
                        onClick={() => submitEdit(item?._id)}
                        className="flex-1 py-2 rounded bg-green-600 text-white"
                      >
                        {loading ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 py-2 rounded bg-gray-500 text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* ACTIONS */}
                {editingId !== item?._id && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => startEdit(item)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded bg-yellow-500/20 text-yellow-600 border border-yellow-500/40"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item?._id)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded bg-red-500/20 text-red-600 border border-red-500/40"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>

                    <button
                      onClick={() => navigate(`/sell/${item?._id}`)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded bg-blue-500/20 text-blue-600 border border-blue-500/40"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserSellPost