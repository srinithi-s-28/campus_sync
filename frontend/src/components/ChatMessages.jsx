import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MessageCircle, ArrowLeft, Image, Smile, Send } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import { serverUrl } from "../main";
import { setMessages, setSelectedUser } from "../redux/messageSlice";
import { fetchMessages, fetchConversationUsers } from "../servers/api";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import { useTheme } from "../context/ThemeContext";

const ChatMessages = () => {
  const dispatch = useDispatch();
  const { isDark } = useTheme();

  const { userData } = useSelector((state) => state.user);
  const { selectedUser, messages = [], onlineUsers = [], socket } = useSelector(
    (state) => state.message
  );

  const [input, setInput] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);

  const imageRef = useRef(null);
  const endRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const firstLetter = selectedUser?.name?.charAt(0)?.toUpperCase() || "U";
  const isOnline = onlineUsers?.includes(selectedUser?._id);

  useEffect(() => {
    if (!selectedUser?._id) {
      dispatch(setMessages([]));
      return;
    }

    fetchMessages(selectedUser._id, dispatch);
  }, [selectedUser?._id, dispatch]);

  /* ================= SOCKET EVENTS ================= */
  useEffect(() => {
    if (!socket || !selectedUser?._id) return;

    const handleNewMessage = (newMessage) => {
      // Compare IDs properly - convert to string for consistency
      const senderId = newMessage?.sender?._id?.toString() || newMessage?.sender?.toString();
      const receiverId = newMessage?.receiver?._id?.toString() || newMessage?.receiver?.toString();
      const selectedUserId = selectedUser?._id?.toString();
      const currentUserId = userData?._id?.toString();

      // Add message if it's from or to the selected user
      if (
        (senderId === selectedUserId || receiverId === selectedUserId) &&
        (senderId === currentUserId || receiverId === currentUserId)
      ) {
        // Check if message already exists to avoid duplicates
        if (!messages.some((msg) => msg?._id?.toString() === newMessage?._id?.toString())) {
          dispatch(setMessages([...messages, newMessage]));
        }
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedUser?._id, userData?._id, messages, dispatch]);

  /* ================= AUTO SCROLL TO BOTTOM ================= */
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  /* ================= IMAGE ================= */
  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB");
      return;
    }

    try {
      const objectUrl = URL.createObjectURL(file);
      setFrontendImage(objectUrl);
      setBackendImage(file);

      // Cleanup function to revoke URL when image is cleared
      return () => URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Error creating image preview:", error);
      toast.error("Failed to create image preview");
    }
  };

  /* ================= SEND MESSAGE ================= */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!backendImage && !input.trim()) return;

    try {
      const formData = new FormData();
      if (input.trim()) formData.append("message", input.trim());
      if (backendImage) formData.append("image", backendImage);

      const res = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser?._id}`,
        formData,
        { withCredentials: true }
      );

      // Handle response - backend returns message directly
      const newMessage = res?.data;

      if (newMessage?._id) {
        // Add new message to messages array
        dispatch(setMessages([...messages, newMessage]));
        // Refresh conversation list
        fetchConversationUsers(dispatch);
      }

      setInput("");
      setFrontendImage(null);
      setBackendImage(null);

      if (imageRef.current) imageRef.current.value = "";
    } catch (err) {
      console.error("Send message error:", err?.response?.data || err.message);
    }
  };

  /* ================= EMOJI ================= */
  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + (emojiData?.emoji ?? ""));
  };

  const formatMessageTime = (dateValue) => {
    if (!dateValue) return "";
    return new Date(dateValue).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`w-full h-[700px] lg:h-[85vh] flex flex-col border rounded-lg overflow-hidden shadow-lg ${
      isDark 
        ? "bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 border-blue-500/20" 
        : "bg-white border-blue-200"
    }`}>
      {selectedUser ? (
        <>
          {/* ================= HEADER ================= */}
          <div className={`flex-shrink-0 flex items-center justify-between px-3 lg:px-4 py-3 border-b ${
            isDark 
              ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 border-blue-500/20" 
              : "bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-200"
          }`}>
            <div className="flex items-center gap-3">
              {/* Back button mobile */}
              <button
                onClick={() => dispatch(setSelectedUser(null))}
                className="lg:hidden text-white hover:bg-white/10 p-2 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* Avatar */}
              <div className="relative">
                {selectedUser.profileImage ? (
                  <img
                    src={selectedUser.profileImage}
                    alt={selectedUser.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 font-semibold border-2 border-white">
                    {firstLetter}
                  </div>
                )}
                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>

              {/* Name */}
              <div>
                <p className="font-semibold text-white">
                  {selectedUser.name}
                </p>
                <p
                  className={`text-xs ${
                    isOnline ? "text-green-200" : "text-gray-200"
                  }`}
                >
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          </div>

          {/* ================= MESSAGES ================= */}
          <div ref={messagesContainerRef} className={`flex-1 overflow-y-auto p-3 lg:p-4 space-y-3 ${
            isDark 
              ? "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" 
              : "bg-gradient-to-b from-gray-50 to-blue-50/30"
          }`}>
            {messages.map((msg) => {
              const isSender =
                msg?.sender?._id === userData?._id ||
                msg?.sender === userData?._id;

              if (isSender) {
                return (
                  <SenderMessage
                    key={msg?._id}
                    image={msg?.image}
                    message={msg?.message}
                    time={formatMessageTime(msg?.createdAt)}
                  />
                );
              }

              return (
                <ReceiverMessage
                  key={msg?._id}
                  image={msg?.image}
                  message={msg?.message}
                  time={formatMessageTime(msg?.createdAt)}
                />
              );
            })}

            <div ref={endRef} />
          </div>

          {/* ================= INPUT ================= */}
          <div className={`flex-shrink-0 p-2 lg:p-3 border-t ${
            isDark 
              ? "bg-slate-950 border-blue-500/20" 
              : "bg-white border-blue-200"
          }`}>
            <div className="relative">
              {/* Emoji Picker */}
              {showPicker && (
                <div className="absolute bottom-16 left-0 z-20">
                  <EmojiPicker
                    width={300}
                    height={400}
                    onEmojiClick={onEmojiClick}
                    theme={isDark ? "dark" : "light"}
                  />
                </div>
              )}

              {/* Image Preview */}
              {frontendImage && (
                <div className="mb-2 relative inline-block">
                  <img
                    src={frontendImage}
                    alt="preview"
                    className="w-32 h-32 rounded-lg object-cover border-2 border-blue-500"
                  />

                  <button
                    onClick={() => {
                      setFrontendImage(null);
                      setBackendImage(null);
                      if (imageRef.current)
                        imageRef.current.value = "";
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2"
              >
                {/* Emoji */}
                <button
                  type="button"
                  onClick={() =>
                    setShowPicker((prev) => !prev)
                  }
                  className={`p-2 rounded-lg transition ${
                    isDark 
                      ? "hover:bg-blue-500/20 text-blue-400" 
                      : "hover:bg-blue-100 text-blue-600"
                  }`}
                >
                  <Smile className="w-5 h-5" />
                </button>

                {/* File input */}
                <input
                  type="file"
                  hidden
                  ref={imageRef}
                  accept="image/*"
                  capture="environment"
                  onChange={handleImage}
                />

                {/* Upload btn */}
                <button
                  type="button"
                  onClick={() =>
                    imageRef.current?.click()
                  }
                  className={`p-2 rounded-lg transition ${
                    isDark 
                      ? "hover:bg-blue-500/20 text-blue-400" 
                      : "hover:bg-blue-100 text-blue-600"
                  }`}
                >
                  <Image className="w-5 h-5" />
                </button>

                {/* Text */}
                <input
                  type="text"
                  value={input}
                  onChange={(e) =>
                    setInput(e.target.value)
                  }
                  placeholder="Type a message..."
                  className={`flex-1 px-3 lg:px-4 py-2 rounded-lg text-sm outline-none transition ${
                    isDark 
                      ? "bg-slate-900 border border-blue-500/20 text-blue-100 placeholder-blue-400/50 focus:ring-2 focus:ring-blue-500" 
                      : "bg-blue-50 border border-blue-200 text-blue-900 placeholder-blue-400 focus:ring-2 focus:ring-blue-500"
                  }`}
                />

                {/* Send */}
                <button
                  type="submit"
                  disabled={!input.trim() && !backendImage}
                  className="px-3 lg:px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg flex items-center gap-2 hover:from-blue-600 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </>
      ) : (
        /* NO USER */
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className={`w-16 lg:w-20 h-16 lg:h-20 rounded-full flex items-center justify-center mb-4 ${
            isDark 
              ? "bg-gradient-to-br from-blue-900/30 to-indigo-900/30" 
              : "bg-gradient-to-br from-blue-100 to-indigo-100"
          }`}>
            <MessageCircle className={`w-8 lg:w-10 h-8 lg:h-10 ${
              isDark ? "text-blue-400" : "text-blue-500"
            }`} />
          </div>

          <h3 className={`text-lg lg:text-xl font-semibold mb-2 ${
            isDark ? "text-blue-100" : "text-blue-900"
          }`}>
            Select a conversation
          </h3>

          <p className={`text-xs lg:text-sm max-w-sm ${
            isDark ? "text-blue-300/70" : "text-blue-600/70"
          }`}>
            Choose a user from the sidebar to start chatting
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;