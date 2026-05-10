import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const JoinCTA = () => {
  const { isDark } = useTheme();

  return (
    <section
      className={`relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 overflow-hidden ${
        isDark ? "bg-transparent" : "bg-white"
      }`}
    >
      {/* GLOW BLOBS */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] blur-[160px] rounded-full ${
          isDark ? "bg-blue-600/20" : "bg-blue-400/20"
        }`}
      />
      <div
        className={`absolute bottom-0 right-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] blur-[160px] rounded-full ${
          isDark ? "bg-indigo-600/20" : "bg-indigo-400/20"
        }`}
      />

      {/* CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative max-w-4xl mx-auto text-center"
      >
        {/* GLASS CARD */}
        <div
          className={`relative p-[1px] rounded-2xl sm:rounded-3xl ${
            isDark
              ? "bg-gradient-to-br from-blue-500/40 via-indigo-500/30 to-transparent"
              : "bg-gradient-to-br from-blue-200 via-indigo-200 to-transparent"
          }`}
        >
          <div
            className={`rounded-2xl sm:rounded-3xl backdrop-blur-xl px-6 py-10 sm:px-10 sm:py-16 border ${
              isDark
                ? "bg-slate-950/80 border-blue-500/20"
                : "bg-white border-slate-200 shadow-xl"
            }`}
          >
            {/* TITLE */}
            <h2
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Built for Students,{" "}
              <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Powered by Technology
              </span>
            </h2>

            {/* SUBTEXT */}
            <p
              className={`text-base sm:text-lg max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2 ${
                isDark ? "text-gray-200" : "text-slate-600"
              }`}
            >
              Join thousands of students who are already using CampusSync to
              make their campus life better. Start your journey today!
            </p>

            {/* BUTTON */}
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold text-base sm:text-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 overflow-hidden ${
                  isDark
                    ? "shadow-lg shadow-blue-500/30"
                    : "shadow-lg shadow-blue-500/20"
                }`}
              >
                <span className="relative z-10">
                  Join CampusSync Today
                </span>

                {/* BUTTON GLOW */}
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400/40 to-indigo-500/40 opacity-0 hover:opacity-100 transition duration-300 blur-xl" />
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default JoinCTA;