import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchItems, deleteItem, updateItem } from "../servers/api"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"

const SellLostAndFoundPostedItem = () => {
  const { isDark } = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
   const { itemData } = useSelector((state) => state.item)
  const { userData } = useSelector((state) => state.user)

  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    date: "",
  })
  const [loading, setLoading] = useState(false)

  /* ---------- THEME ---------- */
  const pageBg = isDark
    ? "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white"
    : "bg-gradient-to-br from-white via-blue-50 to-white text-slate-900"

  const cardBg = isDark
    ? "bg-white/5 border-blue-500/20"
    : "bg-white border-slate-200 shadow"

  const subText = isDark ? "text-blue-300/70" : "text-slate-500"

  const inputBg = isDark
    ? "bg-slate-900/60 border-blue-500/20 text-white"
    : "bg-white border-slate-300 text-slate-900"

  useEffect(() => {
    fetchItems(dispatch)
  }, [dispatch])

  const myItems = (itemData || []).filter(
    (i) =>
      i?.postedBy?._id === userData?._id &&
      (i?.type === "lost" || i?.type === "found")
  ).sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))

  const startEdit = (it) => {
    setEditingId(it?._id)
    setForm({
      title: it?.title || "",
      category: it?.category || "",
      description: it?.description || "",
      location: it?.location || "",
      date: it?.date
        ? new Date(it.date).toISOString().slice(0, 10)
        : "",
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({
      title: "",
      category: "",
      description: "",
      location: "",
      date: "",
    })
  }

  const submitEdit = async (id) => {
    setLoading(true)
    const res = await updateItem(id, form)
    setLoading(false)

    if (res?.error) alert(res.message || "Update failed")
    else {
      fetchItems(dispatch)
      cancelEdit()
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Delete this post?")) return
    const res = await deleteItem(id)
    if (res?.error) alert(res.message || "Delete failed")
    else fetchItems(dispatch)
  }

  const formatDate = (value) => {
    if (!value) return "N/A"
    return new Date(value).toLocaleDateString()
  }

  return (
    <div className={`min-h-screen p-4 sm:p-6 ${pageBg}`}>
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold">
            My Lost & Found Posts
          </h2>

          <button
            onClick={() => navigate("/lost-found/add")}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium"
          >
            + New
          </button>
        </div>

        {myItems.length === 0 && (
          <div className={`text-center py-16 ${subText}`}>You have no posts yet.</div>
        )}

        {/* LIST */}
        <div className="grid gap-5">
          {myItems.map((it) => (
            <div
              key={it._id}
              className={`rounded-2xl border overflow-hidden ${cardBg}`}
            >
              <div className="grid md:grid-cols-[220px_1fr]">
                {/* IMAGE */}
                <div className={isDark ? "h-48 md:h-full bg-slate-900/60" : "h-48 md:h-full bg-slate-100"}>
                  {it?.images?.[0] ? (
                    <img
                      src={it.images[0]}
                      alt={it?.title || "item"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center text-sm ${subText}`}>
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-5">
                  {/* TOP */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-lg sm:text-xl">
                        {it?.title}
                      </h3>
                      <div className={`text-sm ${subText}`}>
                        {it?.category} • {it?.location}
                      </div>
                      <div className={`text-xs mt-1 ${subText}`}>
                        Date: {formatDate(it?.date || it?.createdAt)}
                      </div>
                    </div>

                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold w-fit ${
                        it?.type === "lost"
                          ? "bg-red-500/20 text-red-500"
                          : "bg-green-500/20 text-green-500"
                      }`}
                    >
                      {(it?.type || "item").toUpperCase()}
                    </span>
                  </div>

                  <p className={`text-sm mt-3 ${subText}`}>
                    {it?.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <button
                      onClick={() => startEdit(it)}
                      className="px-3 py-1.5 rounded-lg bg-yellow-500 text-white text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(it?._id)}
                      className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => navigate(`/item/${it?._id}`)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm"
                    >
                      View
                    </button>
                  </div>

                  {/* EDIT FORM */}
                  {editingId === it?._id && (
                    <div className={isDark ? "mt-4 space-y-2 p-3 rounded-xl bg-slate-900/40" : "mt-4 space-y-2 p-3 rounded-xl bg-slate-50"}>
                      <input
                        value={form.title}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Title"
                        className={`w-full p-2 rounded border ${inputBg}`}
                      />

                      <input
                        value={form.category}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            category: e.target.value,
                          }))
                        }
                        placeholder="Category"
                        className={`w-full p-2 rounded border ${inputBg}`}
                      />

                      <input
                        value={form.location}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            location: e.target.value,
                          }))
                        }
                        placeholder="Location"
                        className={`w-full p-2 rounded border ${inputBg}`}
                      />

                      <input
                        type="date"
                        value={form.date}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            date: e.target.value,
                          }))
                        }
                        className={`w-full p-2 rounded border ${inputBg}`}
                      />

                      <textarea
                        value={form.description}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Description"
                        className={`w-full p-2 rounded border ${inputBg}`}
                      />

                      <div className="flex gap-2 pt-1">
                        <button
                          disabled={loading}
                          onClick={() => submitEdit(it?._id)}
                          className="px-3 py-2 rounded-lg bg-green-600 text-white text-sm"
                        >
                          {loading ? "Saving..." : "Save"}
                        </button>

                        <button
                          onClick={cancelEdit}
                          className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SellLostAndFoundPostedItem