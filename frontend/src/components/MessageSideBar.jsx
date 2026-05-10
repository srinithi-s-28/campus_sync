import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Users, Search, MessageCircle } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import { useDispatch, useSelector } from "react-redux"
import { fetchConversationUsers, fetchAllUsers } from "../servers/api"
import { setSelectedUser } from "../redux/messageSlice"

const MessageSideBar = () => {
  const { isDark } = useTheme()
  const dispatch = useDispatch()
  const [search, setSearch] = useState("")
  const [viewMode, setViewMode] = useState("conversations") // 'conversations' or 'allUsers'
  const { conversationUsers = [], allUsers = [], selectedUser, onlineUsers = [], socket } = useSelector((state) => state.message)

  useEffect(() => {
    fetchConversationUsers(dispatch)
  }, [dispatch])

  // Listen for new messages and refresh conversation list
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = () => {
      // Refresh conversation list when a new message arrives
      fetchConversationUsers(dispatch);
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, dispatch]);

  const formatTime = (value) => {
    if (!value) return ""
    return new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleViewToggle = (mode) => {
    setViewMode(mode)
    if (mode === "allUsers" && allUsers.length === 0) {
      fetchAllUsers(dispatch)
    }
  }

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId)
  }

  const displayUsers = viewMode === "conversations" ? conversationUsers : allUsers
  const filteredUsers = displayUsers.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  )

  const onlineFilteredUsers = filteredUsers.filter((u) => isUserOnline(u._id))

  return (
    <div
      className={`h-[710px] rounded-lg w-screen md:w-80 flex flex-col border-r shadow-lg ${
        isDark
          ? "bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 border-blue-500/20 shadow-black/30"
          : "bg-white border-blue-200 shadow-blue-100"
      }`}
    >

      {/* HEADER */}
      <div
        className={`px-5 py-4 border-b flex items-center gap-2 ${
          isDark ? "border-blue-500/20" : "border-blue-200"
        }`}
      >
        <Users className="w-5 h-5 text-blue-500" />

        <h2
          className={`font-semibold ${
            isDark ? "text-blue-300" : "text-blue-700"
          }`}
        >
          Messages
        </h2>
      </div>

      {/* TOGGLE BUTTONS */}
      <div
        className={`px-3 py-2 border-b flex gap-2 ${
          isDark ? "border-blue-500/20" : "border-blue-200"
        }`}
      >
        <button
          onClick={() => handleViewToggle("conversations")}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            viewMode === "conversations"
              ? isDark
                ? "bg-blue-600 text-white"
                : "bg-blue-500 text-white"
              : isDark
              ? "bg-slate-900/50 text-blue-300 hover:bg-slate-900"
              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
          }`}
        >
          <MessageCircle className="w-4 h-4 inline mr-1" />
          Messages
        </button>
        <button
          onClick={() => handleViewToggle("allUsers")}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            viewMode === "allUsers"
              ? isDark
                ? "bg-blue-600 text-white"
                : "bg-blue-500 text-white"
              : isDark
              ? "bg-slate-900/50 text-blue-300 hover:bg-slate-900"
              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
          }`}
        >
          <Users className="w-4 h-4 inline mr-1" />
          All Users
        </button>
      </div>

      {/* SEARCH */}
      <div
        className={`px-3 py-3 border-b ${
          isDark ? "border-blue-500/20" : "border-blue-200"
        }`}
      >
        <div className="relative">

          <Search className="w-4 h-4 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search user..."
            className={`w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none ${
              isDark
                ? "bg-slate-900/70 border border-blue-500/20 text-blue-100"
                : "bg-blue-50 border border-blue-200 text-blue-900"
            }`}
          />

        </div>
      </div>

      {/* ONLINE USERS SECTION */}
      {onlineFilteredUsers.length > 0 && (
        <div
          className={`px-3 py-2 border-b ${
            isDark ? "border-blue-500/20" : "border-blue-200"
          }`}
        >
          <p
            className={`text-xs font-medium mb-2 ${
              isDark ? "text-green-400" : "text-green-600"
            }`}
          >
            Online ({onlineFilteredUsers.length})
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {onlineFilteredUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => dispatch(setSelectedUser(user))}
                className="flex-shrink-0 cursor-pointer outline-none focus:outline-none"
              >
                <div className="relative">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className={`w-12 h-12 rounded-full object-cover transition-all ${
                        selectedUser?._id === user._id 
                          ? "border-4 border-blue-500 ring-2 ring-blue-400/50" 
                          : "border-2 border-green-500"
                      }`}
                    />
                  ) : (
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm transition-all ${
                      selectedUser?._id === user._id 
                        ? "border-4 border-blue-500 ring-2 ring-blue-400/50" 
                        : "border-2 border-green-500"
                    }`}>
                      {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <p
                  className={`text-[10px] text-center mt-1 truncate w-12 ${
                    isDark ? "text-blue-200" : "text-blue-800"
                  }`}
                >
                  {user.name?.split(" ")[0]}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* USER LIST */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">

        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (

            <motion.div
              key={user._id}
              whileHover={{ scale: 1.02 }}
              onClick={() => dispatch(setSelectedUser(user))}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${
                selectedUser?._id === user?._id
                  ? isDark
                    ? "bg-blue-500/20 border border-blue-400/40"
                    : "bg-blue-100 border border-blue-300"
                  : isDark
                    ? "bg-white/5 border border-blue-500/20 hover:bg-blue-500/10"
                    : "bg-blue-50 border border-blue-200 hover:bg-blue-100"
              }`}
            >

              {/* Avatar with online indicator */}
              <div className="relative">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-blue-300/30"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                {/* Online indicator dot */}
                {isUserOnline(user._id) && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>

              {/* Name */}
              <div className="flex-1">

                <p
                  className={`text-sm font-medium ${
                    isDark ? "text-blue-100" : "text-blue-900"
                  }`}
                >
                  {user.name}
                </p>

                <p
                  className={`text-xs ${
                    isDark ? "text-blue-300/70" : "text-blue-700/70"
                  }`}
                >
                  {isUserOnline(user._id) ? (
                    <span className="text-green-500 font-medium">● Online</span>
                  ) : viewMode === "conversations" ? (
                    user.lastMessage || "Start conversation"
                  ) : (
                    <span className="text-gray-500">○ Offline</span>
                  )}
                </p>

              </div>

              {viewMode === "conversations" && !isUserOnline(user._id) && (
                <span className={isDark ? "text-[10px] text-blue-300/70" : "text-[10px] text-blue-700/70"}>
                  {formatTime(user.lastMessageAt)}
                </span>
              )}

            </motion.div>

          ))
        ) : (

          <div
            className={`flex flex-col items-center justify-center py-8 ${
              isDark ? "text-blue-300/70" : "text-blue-700/70"
            }`}
          >
            <MessageCircle className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">
              {viewMode === "conversations" ? "No conversations yet" : "No users found"}
            </p>
          </div>

        )}

      </div>
    </div>
  )
}

export default MessageSideBar