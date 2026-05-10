import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Bell,
  Home,
  MapPin,
  BookOpen,
  GraduationCap,
  MessageCircle,
  Sun,
  Moon, Package, ShoppingBag, AlertCircle, Briefcase 
} from "lucide-react";

import logo from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../main";
import toast from "react-hot-toast";
import { setUserData } from "../redux/userSlice";
import { useTheme } from "../context/ThemeContext";
import { fetchItems, fetchMarketplaceItems } from "../servers/api";

const notifications = [
  {
    id: 1,
    text: "new Lost item",
    icon: ShoppingBag,
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-900/20",
  },
  {
    id: 2,
    text: "New found items",
    icon: Package,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    id: 3,
    text: "New Books",
    icon: AlertCircle,
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-900/20",
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const { isDark, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);
  const notiRef = useRef(null);
  const [noti, setNoti] = useState(false);
  const [currentNot, setCurrentNoti] = useState("new Lost item");
  const { items, loading } = useSelector((state) => state.marketplace)
  const { itemData } = useSelector((state) => state.item)
  const { userData } = useSelector((state) => state.user);

  /* ---------- LOGOUT ---------- */
  const handleLogout = async () => {
    try {
      await axios.post(
        `${serverUrl}/api/user/logout`,
        {},
        { withCredentials: true },
      );
      dispatch(setUserData(null));
      navigate("/login");
      toast.success("Logout successfully");
    } catch {
      toast.error("Logout failed");
    }
  };

    useEffect(() => {
      fetchMarketplaceItems(dispatch)
    }, [dispatch])
  

 useEffect(() => {
    fetchItems(dispatch)
  }, [dispatch])

  /* ---------- CLOSE DROPDOWN ---------- */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
      if (notiRef.current && !notiRef.current.contains(e.target)) {
        setNoti(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Lost & Found", path: "/lost-found", icon: MapPin },
    { name: "MarketPlace", path: "/market", icon: BookOpen },
    { name: "AI Notes", path: "/study-material", icon: GraduationCap },
    { name: "AI Interview", path: "/ai-interview", icon: Briefcase },
    { name: "Chat", path: "/chat", icon: MessageCircle },
  ];

  const firstLetter = userData?.name?.charAt(0)?.toUpperCase() || "U";

  /* ---------- THEME COLORS ---------- */
  const logoMain = isDark ? "text-white" : "text-slate-800";
  const iconColor = isDark
    ? "text-gray-300 hover:text-blue-300"
    : "text-gray-600 hover:text-blue-600";

  const hoverBg = isDark ? "hover:bg-white/5" : "hover:bg-slate-100";

  const dropdownBg = isDark
    ? "bg-slate-900/95 border-blue-500/20 text-gray-300"
    : "bg-white border-slate-200 text-slate-700";

  const dropdownHover = isDark ? "hover:bg-slate-800" : "hover:bg-slate-100";

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 backdrop-blur-xl transition-colors ${
        isDark
          ? "bg-linear-to-r from-slate-950/95 via-blue-950/95 to-slate-950/95 border-b border-blue-500/30"
          : "bg-linear-to-r from-white/95 via-blue-50/95 to-white/95 border-b border-blue-200/40"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="CampusSync" className="w-10 h-10" />
            <span className="text-lg md:text-xl font-bold">
              <span className={logoMain}>Campus</span>
              <span className="bg-linear-to-r from-blue-500 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
                Sync
              </span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative group flex items-center gap-2 font-medium transition ${
                    isActive
                      ? isDark
                        ? "text-blue-300"
                        : "text-blue-600"
                      : isDark
                        ? "text-gray-300 hover:text-blue-300"
                        : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <Icon size={16} />
                  {item.name}

                  <span
                    className={`absolute left-0 -bottom-1 h-0.5 bg-linear-to-r from-blue-400 to-indigo-500 transition-all ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            {/* THEME */}
            {userData && (
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${hoverBg}`}
              >
                {isDark ? (
                  <Sun className={`w-5 h-5 ${iconColor}`} />
                ) : (
                  <Moon className={`w-5 h-5 ${iconColor}`} />
                )}
              </button>
            )}

            {/* NOTIFICATION */}
            <div className="relative" ref={notiRef}>
              <button 
                onClick={() => setNoti(!noti)}
                className={`relative p-2 rounded-lg ${hoverBg}`}
              >
                <Bell className={`w-5 h-5 ${iconColor}`} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
              </button>

          {noti && (
  <div
    className="
      fixed sm:absolute 
      left-4 right-4 top-20 sm:left-auto sm:right-0 sm:top-12
      w-auto sm:w-85 lg:w-95 sm:max-w-md
      rounded-xl border shadow-xl overflow-hidden
      bg-white border-gray-200
      dark:bg-gray-900 dark:border-gray-700
      z-50 max-h-[80vh] overflow-y-auto
    "
  >
    {/* Header */}
    <div className="px-4 py-2.5 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-800 dark:text-gray-200 text-sm">
      Notifications
    </div>

    {/* Tabs */}
    <div className="flex border-b border-gray-200 dark:border-gray-700">
      {notifications.map((t, index) => {
        const Icon = t.icon;
        const isActive = currentNot === t.text;
        return (
          <button
            key={index}
            onClick={() => setCurrentNoti(t.text)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 transition-colors ${
              isActive
                ? "border-b-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <div className={`p-1 rounded ${isActive ? t.bg : ""}`}>
              <Icon className={`w-4 h-4 ${isActive ? t.color : "text-gray-500 dark:text-gray-400"}`} />
            </div>
            <span className={`text-xs font-medium ${
              isActive ? "text-gray-900 dark:text-gray-100" : "text-gray-600 dark:text-gray-400"
            }`}>
              {t.text.replace("new ", "").replace("New ", "")}
            </span>
          </button>
        );
      })}
    </div>

    {/* Content */}
    <div className="max-h-80 overflow-y-auto">
      {currentNot === "new Lost item" && (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {itemData && itemData.length > 0 ? (
            itemData.filter(item => item.type === "lost").map((item) => (
              <Link
                key={item._id}
                to={`/item/${item._id}`}
                onClick={() => setNoti(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {item.location} • {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              No lost items yet
            </div>
          )}
        </div>
      )}

      {currentNot === "New found items" && (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {itemData && itemData.length > 0 ? (
            itemData.filter(item => item.type === "found").map((item) => (
              <Link
                key={item._id}
                to={`/item/${item._id}`}
                onClick={() => setNoti(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {item.location} • {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              No found items yet
            </div>
          )}
        </div>
      )}

      {currentNot === "New Books" && (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {items && items.length > 0 ? (
            items.map((item) => (
              <Link
                key={item._id}
                to={`/sell/${item._id}`}
                onClick={() => setNoti(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    ₹{item.price} • {item.category}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              No books available yet
            </div>
          )}
        </div>
      )}
    </div>

    {/* Footer */}
    <div className="px-4 py-2.5 border-t border-gray-200 dark:border-gray-700 text-center">
      <button
        onClick={() => {
          setNoti(false);
          if (currentNot === "new Lost item" || currentNot === "New found items") {
            navigate("/lost-found");
          } else {
            navigate("/market");
          }
        }}
        className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
      >
        View all
      </button>
    </div>
  </div>
)}
            </div>

            {/* USER */}
            {userData ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="w-9 h-9 rounded-full overflow-hidden bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold"
                >
                  {userData.ProfileImage ? (
                    <img
                      src={userData.ProfileImage}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    firstLetter
                  )}
                </button>

                <AnimatePresence>
                  {showProfile && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className={`absolute right-0 mt-3 w-44 backdrop-blur-xl border rounded-xl shadow-xl overflow-hidden ${dropdownBg}`}
                    >
                      <Link
                        to="/profile"
                        onClick={() => setShowProfile(false)}
                        className={`block px-4 py-2 text-sm ${dropdownHover}`}
                      >
                        Profile
                      </Link>

                      <Link
                        to="/item/myclaim"
                        onClick={() => setShowProfile(false)}
                        className={`block px-4 py-2 text-sm ${dropdownHover}`}
                      >
                        My Claims
                      </Link>

                      <Link
                        to="/item/claim-request"
                        onClick={() => setShowProfile(false)}
                        className={`block px-4 py-2 text-sm ${dropdownHover}`}
                      >
                        Claim Requests
                      </Link>

                      <Link
                        to="/notes/history"
                        onClick={() => setShowProfile(false)}
                        className={`block px-4 py-2 text-sm ${dropdownHover}`}
                      >
                        Notes History
                      </Link>

                      <Link
                        to="/ai-interview/history"
                        onClick={() => setShowProfile(false)}
                        className={`block px-4 py-2 text-sm ${dropdownHover}`}
                      >
                        Interview History
                      </Link>

                      <button
                        onClick={() => {
                          setShowProfile(false)
                          handleLogout()
                        }}
                        className="w-full text-left px-4 py-2 text-sm bg-red-500/10 text-red-500 hover:bg-red-500/20 border-t border-red-500/20"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/register"
                className="hidden sm:inline-flex px-4 py-2 text-sm font-medium rounded-lg bg-linear-to-r from-blue-500 to-indigo-600 text-white hover:scale-105 transition"
              >
                Sign Up
              </Link>
            )}

            {/* MOBILE BTN */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 ${iconColor}`}
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden backdrop-blur-xl ${
              isDark
                ? "border-t border-blue-500/20 bg-slate-950/95"
                : "border-t border-blue-200/40 bg-white/95"
            }`}
          >
            <div className="px-6 py-4 space-y-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 ${
                      isDark
                        ? "text-gray-300 hover:text-blue-300"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    <Icon size={16} />
                    {item.name}
                  </Link>
                );
              })}

              {userData && (
                <>
                  <div className={`pt-3 mt-3 border-t ${isDark ? "border-blue-500/20" : "border-blue-200/40"}`} />

                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 ${
                      isDark
                        ? "text-gray-300 hover:text-blue-300"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    <Home size={16} />
                    Profile
                  </Link>

                  <Link
                    to="/notes/history"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 ${
                      isDark
                        ? "text-gray-300 hover:text-blue-300"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    <BookOpen size={16} />
                    Notes History
                  </Link>

                  <Link
                    to="/ai-interview/history"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 ${
                      isDark
                        ? "text-gray-300 hover:text-blue-300"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    <Briefcase size={16} />
                    Interview History
                  </Link>
                </>
              )}

              {!userData && (
                <>
                  <div className={`pt-3 mt-3 border-t ${isDark ? "border-blue-500/20" : "border-blue-200/40"}`} />

                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-linear-to-r from-blue-500 to-indigo-600 text-white transition"
                  >
                    Sign Up
                  </Link>

                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className={`w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg border transition ${
                      isDark
                        ? "border-blue-500/30 text-gray-200 hover:bg-slate-800"
                        : "border-blue-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
