// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../main";
import { setUserData } from "../redux/userSlice";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const theme = userData?.theme || "dark";

  // ✅ boolean dark state
  const [isDark, setIsDark] = useState(theme === "light");

  // sync boolean with theme
  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  // apply to html
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
  }, [isDark]);

  // toggle theme
  const toggleTheme = async () => {
    if (!userData) return;

    const newTheme = isDark ? "light" : "dark";

    try {
      const res = await axios.put(
        `${serverUrl}/api/user/theme`,
        { theme: newTheme },
        { withCredentials: true }
      );

      // update redux
      dispatch(
        setUserData({
          ...userData,
          theme: res.data.theme,
        })
      );
    } catch (err) {
      console.error("Theme update failed");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);