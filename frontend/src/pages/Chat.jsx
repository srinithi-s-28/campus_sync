import React from "react"
import { useDispatch, useSelector } from "react-redux"
import ChatMessages from "../components/ChatMessages"
import MessageSideBar from "../components/MessageSideBar"
import { useTheme } from "../context/ThemeContext"

const Chat = () => {
  const { selectedUser } = useSelector((state) => state.message)
  const dispatch = useDispatch();
  const { isDark } = useTheme();

  

  return (
    <div className={`min-h-screen lg:h-[85vh] p-2 lg:p-10 flex rounded-lg overflow-hidden ${
      isDark 
        ? "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950" 
        : "bg-gradient-to-br from-blue-50 via-white to-blue-50"
    }`}>
      
      {/* LEFT SIDEBAR - Show on desktop always, on mobile only when no user selected */}
      <div className={`${selectedUser ? 'hidden' : 'block'} lg:block`}>
        <MessageSideBar />
      </div>

      {/* CHAT MESSAGES - Show on desktop always, on mobile only when user selected */}
      <div className={`flex-1 flex-col ${selectedUser ? 'flex' : 'hidden lg:flex'}`}>
        <ChatMessages />
      </div>

    </div>
  )
}

export default Chat