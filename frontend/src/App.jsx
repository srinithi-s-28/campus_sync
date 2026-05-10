import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";

import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LostAndFound from "./pages/LostAndFound";
import { useEffect } from "react";
import {  getCurrentuser } from "./servers/api";
import { useDispatch, useSelector } from "react-redux";
import StudyHome from "./pages/StudyHome";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Notes from "./pages/Notes";
import AddItemForm from "./pages/AddItemForm";
import History from "./pages/History";
import Pricing from "./pages/Priceing";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import FloatingActions from "./components/FloatingActions";
import ItemDetailPage from "./pages/itemDetailPage";
import ClaimItemForm from "./pages/ClaimItemForm";
import ClaimRequestPages from "./pages/ClaimRequestPages";
import MyClaim from "./pages/MyClaim";
import MarketPlace from "./pages/MarketPlace";
import AddSellItem from "./pages/AddSellItem";
import MarketItemDetailPage from "./pages/MarketItemDetailPage";
import Profile from "./pages/Profile";
import UserSellPost from "./pages/UserSellPost";
import Chat from "./pages/Chat";
import { useTheme } from "./context/ThemeContext";
import { io } from "socket.io-client";
import { serverUrl } from "./main";
import { setOnlineUsers, setSocket } from "./redux/messageSlice";
import SellLostAndFoundPostedItem from "./pages/SellLostAndFoundPostedItem";
import AiInterviewHome from "./pages/AiInterviewPages/AiInterviewHome";
import InterviewPage from "./pages/AiInterviewPages/InterviewPage";
import InterviewHistory from "./pages/AiInterviewPages/InterviewHistory";
import InterviewReport from "./pages/AiInterviewPages/InterviewReport";


const App = () => {
  const dispatch = useDispatch();
  const {userData} = useSelector((state)=>state.user)
  const { isDark } = useTheme()
  console.log(userData);
  
  useEffect(() => {
    getCurrentuser(dispatch);
  }, [dispatch]);




  useEffect(() => {
    if (!userData?._id) return; // don't connect until we have a userId

    const socketio = io(serverUrl, {
      query: {
        userId: userData._id,
      },
    });

    socketio.on("connect", () => {
      console.log("Connected:", socketio.id);
    });

    dispatch(setSocket(socketio));

    socketio.on("getOnlineUsers", (users) => {
      dispatch(setOnlineUsers(users));
    });

    return () => {
      socketio.disconnect(); // cleanup
      dispatch(setSocket(null));
    };
  }, [userData?._id, dispatch]);

  return (
   
      <div className={`min-h-screen ${isDark ? "bg-linear-to-b from-slate-950 via-blue-950 to-slate-950" : "bg-linear-to-b from-white via-blue-50 to-white"} transition-colors duration-300`}>
        <Toaster position="top-center" reverseOrder={false} />

        <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* PROTECTED AUTH ROUTES */}
        <Route
          path="/register"
          element={userData ? <Navigate to="/" /> : <SignUp />}
        />

        <Route
          path="/login"
          element={userData ? <Navigate to="/" /> : <Login />}
        />

        <Route path="/lost-found" element={<LostAndFound />} />
        <Route path="/study-material" element={<StudyHome />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/note" element={<Notes />} />
        <Route path="/notes/history" element={<History />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/lost-found/add" element={<AddItemForm />} />
        <Route path="/item/:id" element={<ItemDetailPage />} />
        <Route path="/claim-item/:id" element={<ClaimItemForm />} />
        <Route path="/item/claim-request" element={<ClaimRequestPages/>} />
        <Route path="/item/myclaim" element={<MyClaim/>} />
        <Route path="/market" element={<MarketPlace/>} />
        <Route path="/sell" element={<MarketPlace/>} />
        <Route path="/sell/:id" element={<MarketItemDetailPage/>} />
        <Route path="/sell/add" element={<AddSellItem/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/all-sell-items" element={<UserSellPost/>} />
        <Route path="/all-lost-found-items" element={<SellLostAndFoundPostedItem/>} />
        <Route path="/chat" element={<Chat/>} />
        <Route path="/ai-interview" element={<AiInterviewHome/>} />
        <Route path="/ai-interview/start" element={<InterviewPage/>} />
        <Route path="/ai-interview/history" element={<InterviewHistory/>} />
        <Route path="/ai-interview/report/:interviewId" element={<InterviewReport/>} />

       
      </Routes>
 <FloatingActions />
        <Footer />
      </div>
   
  )
};

export default App;
