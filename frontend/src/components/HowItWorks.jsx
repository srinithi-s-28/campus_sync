import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { Upload, BellRing, MessageCircle, Brain, Briefcase } from "lucide-react";

const steps = [
  {
    title: "Post Item or Resource",
    desc: "Upload lost/found items, books for sale, or study materials using our simple and intuitive interface.",
    icon: Upload,
    gradient: "from-blue-500 to-cyan-400",
    glow: "bg-blue-500/20",
    border: "border-blue-500/40",
    iconColor: "text-blue-400",
  },
  {
    title: "Get Smart Matches",
    desc: "Our AI analyzes images and details to match lost items, suggest books, and organize study content.",
    icon: BellRing,
    gradient: "from-indigo-500 to-blue-400",
    glow: "bg-indigo-500/20",
    border: "border-indigo-500/40",
    iconColor: "text-indigo-400",
  },
  {
    title: "Chat & Exchange",
    desc: "Connect securely with students to recover items, buy books, or collaborate through real-time chat.",
    icon: MessageCircle,
    gradient: "from-purple-500 to-indigo-400",
    glow: "bg-purple-500/20",
    border: "border-purple-500/40",
    iconColor: "text-purple-400",
  },
  {
    title: "AI Study Notes",
    desc: "Generate smart notes, summaries, and personalized study suggestions to learn faster and stay organized.",
    icon: Brain,
    gradient: "from-pink-500 to-purple-400",
    glow: "bg-pink-500/20",
    border: "border-pink-500/40",
    iconColor: "text-pink-400",
  },
  {
    title: "AI Interview Practice",
    desc: "Practice HR and technical rounds with role-based AI questions, timed sessions, and instant feedback.",
    icon: Briefcase,
    gradient: "from-cyan-500 to-blue-500",
    glow: "bg-cyan-500/20",
    border: "border-cyan-500/40",
    iconColor: "text-cyan-400",
  },
];

const HowItWorks = () => {
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
          How It{" "}
          <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Works
          </span>
        </h2>

        <p
          className={`relative text-base sm:text-lg px-4 ${
            isDark ? "text-gray-200" : "text-slate-600"
          }`}
        >
          Simple steps to recover lost items, trade books, create AI notes, and
          practice AI interviews.
        </p>
      </motion.div>

      {/* STEPS */}
      <div className="relative grid gap-8 sm:gap-10 md:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {/* CONNECTING LINE */}
        <div
          className={`hidden lg:block absolute top-10 left-0 right-0 h-[2px] ${
            isDark
              ? "bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-pink-500/40"
              : "bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300"
          }`}
        />

        {steps.map((step, i) => {
          const Icon = step.icon;

          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="relative text-center group"
            >
              {/* NUMBER + ICON */}
              <div className="mx-auto mb-6 relative">
                <div
                  className={`w-14 h-14 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                >
                  {i + 1}
                </div>

                <div
                  className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border flex items-center justify-center ${
                    isDark
                      ? `bg-slate-950 ${step.border}`
                      : `bg-white border-slate-200 shadow-sm`
                  }`}
                >
                  <Icon size={16} className={step.iconColor} />
                </div>
              </div>

              {/* TITLE */}
              <h3
                className={`text-xl font-semibold mb-3 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {step.title}
              </h3>

              {/* DESC */}
              <p
                className={`text-sm leading-relaxed max-w-xs mx-auto ${
                  isDark ? "text-gray-300" : "text-slate-600"
                }`}
              >
                {step.desc}
              </p>

              {/* HOVER GLOW */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 blur-2xl rounded-full ${
                  isDark ? step.glow : "bg-blue-200/40"
                }`}
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default HowItWorks;