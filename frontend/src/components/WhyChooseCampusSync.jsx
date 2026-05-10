import React from "react";
import { motion } from "framer-motion";
import { SearchCheck, BookOpen, MessageCircle, Brain } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const features = [
  {
    title: "Smart Lost & Found",
    desc: "Report lost items and get intelligent matches with found items using AI-powered recognition.",
    icon: SearchCheck,
  },
  {
    title: "Book Marketplace",
    desc: "Buy and sell textbooks with verified sellers. Find deals on your course materials.",
    icon: BookOpen,
  },
  {
    title: "Real-Time Chat",
    desc: "Connect instantly with other students for item exchanges and academic discussions.",
    icon: MessageCircle,
  },
  {
    title: "AI Notes & Interview Prep",
    desc: "Generate smart AI notes with topic summaries and practice AI interviews with role-based questions, timed rounds, and instant feedback.",
    icon: Brain,
  },
];

const WhyChooseCampusSync = () => {
  const { isDark } = useTheme();

  return (
    <section
      className={`py-12 sm:py-16 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto ${
        isDark ? "bg-transparent" : "bg-white"
      }`}
    >
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20"
      >
        {/* GLOW */}
        <div className="absolute inset-0 flex justify-center">
          <div
            className={`w-60 h-60 sm:w-80 sm:h-80 md:w-96 md:h-96 blur-[140px] rounded-full ${
              isDark ? "bg-blue-500/20" : "bg-blue-400/20"
            }`}
          />
        </div>

        <h2
          className={`relative text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          Why Choose{" "}
          <span className="bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
            CampusSync
          </span>
          ?
        </h2>

        <p
          className={`relative text-base sm:text-lg leading-relaxed px-4 ${
            isDark ? "text-blue-200/90" : "text-slate-600"
          }`}
        >
          Powerful features designed specifically for students to make campus
          life easier and more connected.
        </p>

        <div className="mt-6 sm:mt-8 flex justify-center">
          <div className="h-[2px] w-20 sm:w-28 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full" />
        </div>
      </motion.div>

      {/* FEATURES GRID */}
      <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => {
          const Icon = f.icon;

          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.03 }}
              className={`group relative rounded-2xl p-[1px] ${
                isDark
                  ? "bg-gradient-to-br from-blue-500/40 via-indigo-500/20 to-transparent"
                  : "bg-gradient-to-br from-blue-200 via-indigo-200 to-transparent"
              }`}
            >
              {/* CARD */}
              <div
                className={`h-full rounded-2xl backdrop-blur-xl p-6 relative overflow-hidden border ${
                  isDark
                    ? "bg-slate-950/90 border-blue-500/10"
                    : "bg-white border-slate-200 shadow-lg"
                }`}
              >
                {/* HOVER GLOW */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-40 transition duration-500 ${
                    isDark
                      ? "bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-transparent"
                      : "bg-gradient-to-br from-blue-100 via-indigo-100 to-transparent"
                  }`}
                />

                {/* ICON */}
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                    isDark
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/40"
                      : "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md"
                  }`}
                >
                  <Icon className="text-white" size={22} />
                </div>

                {/* TITLE */}
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {f.title}
                </h3>

                {/* DESC */}
                <p
                  className={`text-sm leading-relaxed ${
                    isDark ? "text-gray-300/90" : "text-slate-600"
                  }`}
                >
                  {f.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default WhyChooseCampusSync;