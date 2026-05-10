import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
    selectedUser: null,
    conversationUsers: [],
    allUsers: [],
    onlineUsers: [],
    socket:null,
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setConversationUsers: (state, action) => {
      state.conversationUsers = action.payload;
    },
    setAllUsers: (state, action) => {
      state.allUsers = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setSocket:(state,action)=>{
      state.socket = action.payload
    }
    

  },
});

export const {
  setMessages,
  setSelectedUser,
  setConversationUsers,
  setAllUsers,
  setOnlineUsers,
  setSocket
} = messageSlice.actions;

export default messageSlice.reducer;
