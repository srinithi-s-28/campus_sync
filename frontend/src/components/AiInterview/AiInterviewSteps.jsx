import React from "react"
import { motion } from "framer-motion"
import { BsRobot, BsMic, BsClock } from "react-icons/bs"
import { useTheme } from "../../context/ThemeContext"

import image1 from "../../assets/ai-ans.png"
import image2 from "../../assets/resume.png"
import image3 from "../../assets/pdf.png"
import image4 from "../../assets/history.png"

const steps = [
  {
    icon: <BsRobot size={22} />,
    step: "STEP 1",
    title: "Role & Experience Selection",
    desc: "AI adjusts difficulty based on selected job role.",
  },
  {
    icon: <BsMic size={22} />,
    step: "STEP 2",
    title: "Smart Voice Interview",
    desc: "Dynamic follow-up questions based on your answers.",
  },
  {
    icon: <BsClock size={22} />,
    step: "STEP 3",
    title: "Timer Based Simulation",
    desc: "Real interview pressure with time tracking.",
  },
]

const features = [
  {
    img: image1,
    title: "AI Answer Evaluation",
    desc: "Scores communication, technical accuracy and confidence."
  },
  {
    img: image2,
    title: "Resume Based Interview",
    desc: "Project-specific questions based on uploaded resume."
  },
  {
    img: image3,
    title: "Downloadable PDF Report",
    desc: "Detailed strengths, weaknesses and improvement insights."
  },
  {
    img: image4,
    title: "History & Analytics",
    desc: "Track progress with performance graphs and topic analysis."
  }
]

const AiInterviewSteps = () => {

  const { isDark } = useTheme()

  const cardStyle = isDark
    ? "bg-white/5 border-blue-500/20 text-white"
    : "bg-white border-slate-200 text-slate-800 shadow-sm"

  return (
    <section className="max-w-7xl mx-auto px-4 py-24 transition-all duration-300">

      {/* ---------------- TIMELINE SECTION ---------------- */}

      <h2 className={`text-center text-3xl md:text-4xl font-bold mb-16 ${isDark ? "text-white" : "text-slate-900"}`}>
        How AI Interview Works
      </h2>

      <div className="flex flex-col items-center gap-8 md:hidden">
        {steps.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className={`w-full max-w-sm rounded-xl p-6 border text-center ${cardStyle}`}
          >
            <div className="flex justify-center mb-3">
              <div className={`rounded-lg p-3 shadow inline-flex ${isDark ? "bg-blue-500/20 border border-blue-400/50 text-blue-300" : "bg-blue-100 border border-blue-400 text-blue-600"}`}>
                {item.icon}
              </div>
            </div>

            <span className={`text-xs font-semibold ${isDark ? "text-blue-400" : "text-blue-600"}`}>
              {item.step}
            </span>

            <h3 className="text-lg font-semibold mt-1">
              {item.title}
            </h3>

            <p className={`text-sm mt-2 ${isDark ? "text-blue-200/80" : "text-slate-600"}`}>
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* DESKTOP TIMELINE */}
      <div className="hidden md:block space-y-20 relative">

        <div className="absolute left-1/2 top-0 h-full w-0.5 bg-blue-500/30 transform -translate-x-1/2" />

        {steps.map((item, index) => {

          const isLeft = index % 2 === 0

          return (
            <div key={index} className="relative flex items-center">

              <motion.div
                initial={{ opacity: 0, x: isLeft ? -80 : 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`w-[45%] rounded-xl p-6 border ${cardStyle} ${
                  isLeft ? "mr-auto" : "ml-auto"
                }`}
              >
                <span className={`text-xs font-semibold ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                  {item.step}
                </span>

                <h3 className="text-lg font-semibold mt-1">
                  {item.title}
                </h3>

                <p className={`text-sm mt-2 ${isDark ? "text-blue-200/80" : "text-slate-600"}`}>
                  {item.desc}
                </p>
              </motion.div>

              <div className={`absolute left-1/2 transform -translate-x-1/2 rounded-lg p-3 shadow ${isDark ? "bg-blue-500/20 border border-blue-400/50 text-blue-300" : "bg-blue-100 border border-blue-400 text-blue-600"}`}>
                {item.icon}
              </div>

            </div>
          )
        })}

      </div>

      {/* ---------------- FEATURES SECTION ---------------- */}

      <h2 className={`text-center text-3xl md:text-4xl font-bold mt-32 mb-16 ${isDark ? "text-white" : "text-slate-900"}`}>
        Advanced AI <span className="text-blue-500">Capabilities</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {features.map((item,index)=>(
          <motion.div
            key={index}
            initial={{opacity:0,y:40}}
            whileInView={{opacity:1,y:0}}
            viewport={{once:true}}
            transition={{duration:0.5,delay:index*0.1}}
            whileHover={{y:-6}}
            className={`rounded-xl p-6 border ${cardStyle}`}
          >

            <img
              src={item.img}
              alt=""
              className="w-full h-32 object-contain mb-4"
            />

            <h3 className="font-semibold text-lg mb-1">
              {item.title}
            </h3>

            <p className={`${isDark ? "text-blue-200/80" : "text-slate-600"} text-sm`}>
              {item.desc}
            </p>

          </motion.div>
        ))}


      </div>
      
      {/* ---------------- INTERVIEW MODES ---------------- */}

<h2
  className={`text-center text-3xl md:text-4xl font-bold mt-32 mb-20 ${
    isDark ? "text-white" : "text-slate-900"
  }`}
>
  Multiple Interview <span className="text-blue-500">Modes</span>
</h2>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">

  {/* LEFT SIDE */}
  <div className="flex flex-col gap-6">

    <motion.div
      whileHover={{ y: -6 }}
      initial={{ opacity: 0, x: -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`rounded-xl p-6 border ${cardStyle}`}
    >
      <img src={image1} className="h-20 mb-4 object-contain" />
      <h3 className="font-semibold text-lg">Confidence Detection</h3>
      <p className={`text-sm ${isDark ? "text-blue-200/80" : "text-slate-600"}`}>
        Body tone and voice analysis insights.
      </p>
    </motion.div>

    <motion.div
      whileHover={{ y: -6 }}
      initial={{ opacity: 0, x: -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`rounded-xl p-6 border ${cardStyle}`}
    >
      <img src={image2} className="h-20 mb-4 object-contain" />
      <h3 className="font-semibold text-lg">Credits System</h3>
      <p className={`text-sm ${isDark ? "text-blue-200/80" : "text-slate-600"}`}>
        Unlock premium interview sessions easily.
      </p>
    </motion.div>

  </div>


  {/* CENTER TITLE */}
  <div className="text-center hidden lg:block">

    <motion.h3
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`text-3xl font-bold ${
        isDark ? "text-white" : "text-slate-900"
      }`}
    >
      Multiple Interview <span className="text-blue-500">Modes</span>
    </motion.h3>

  </div>


  {/* RIGHT SIDE */}
  <div className="flex flex-col gap-6">

    <motion.div
      whileHover={{ y: -6 }}
      initial={{ opacity: 0, x: 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`rounded-xl p-6 border ${cardStyle}`}
    >
      <img src={image3} className="h-20 mb-4 object-contain" />
      <h3 className="font-semibold text-lg">HR Interview Mode</h3>
      <p className={`text-sm ${isDark ? "text-blue-200/80" : "text-slate-600"}`}>
        Behavioral and communication based evaluation.
      </p>
    </motion.div>

    <motion.div
      whileHover={{ y: -6 }}
      initial={{ opacity: 0, x: 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`rounded-xl p-6 border ${cardStyle}`}
    >
      <img src={image4} className="h-20 mb-4 object-contain" />
      <h3 className="font-semibold text-lg">Technical Mode</h3>
      <p className={`text-sm ${isDark ? "text-blue-200/80" : "text-slate-600"}`}>
        Deep technical questioning based on selected role.
      </p>
    </motion.div>

  </div>

</div>

    </section>
  )
}

export default AiInterviewSteps