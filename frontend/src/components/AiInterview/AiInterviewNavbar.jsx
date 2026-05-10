import React, { useState, useRef, useEffect } from "react"
import logo from "../../assets/Ailogo.png"
import { Diamond, Plus, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../../context/ThemeContext"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"


const AiInterviewNavbar = () => {

  const { isDark } = useTheme()
  const { userData } = useSelector((state) => state.user)

  const [open, setOpen] = useState(false)
  const popupRef = useRef(null)

  const navigate = useNavigate()

  /* close popup outside */
  useEffect(() => {
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)

  }, [])


  const titleMain = isDark ? "text-white" : "text-slate-900"
  const creditsText = isDark ? "text-blue-300" : "text-slate-700"

  const popupBg = isDark
    ? "bg-slate-900 border-blue-500/20 text-white"
    : "bg-white border-slate-200 text-slate-800"


  const popupSub = isDark ? "text-gray-400" : "text-slate-500"



  return (

<header className="w-full h-16 px-4 md:px-8 flex items-center justify-between transition-all duration-300">

{/* LEFT SIDE */}
<div
className="flex items-center gap-3 cursor-pointer"
onClick={()=>navigate("/")}
>

<img
src={logo}
alt="AI Interview"
className="w-9 h-9 object-contain"
/>

<h1 className="text-lg md:text-xl font-semibold leading-none">

<span className={titleMain}>
AI
</span>

<span className="bg-linear-to-r from-blue-500 via-cyan-500 to-indigo-500 bg-clip-text text-transparent">
 Interview
</span>

</h1>

</div>



{/* RIGHT SIDE */}
<div className="flex items-center gap-4 relative">

{/* CREDIT BUTTON */}
<motion.button

whileTap={{scale:0.95}}

onClick={()=>setOpen(!open)}

className="flex items-center gap-2 px-3 py-2 rounded-xl border border-blue-500/40 hover:border-blue-500 transition-all duration-300"

>

<Diamond className="w-5 h-5 text-cyan-500"/>

<span className={`text-sm font-semibold ${creditsText}`}>
{userData?.credits || 0}
</span>

<Plus className="w-4 h-4 text-blue-500"/>

</motion.button>



{/* POPUP */}

<AnimatePresence>

{open && (

<motion.div

ref={popupRef}

initial={{opacity:0,scale:0.9,y:-10}}

animate={{opacity:1,scale:1,y:0}}

exit={{opacity:0,scale:0.9,y:-10}}

className={`absolute right-0 top-12 w-72 rounded-xl shadow-xl p-5 z-50 border ${popupBg}`}

>

<button
onClick={()=>setOpen(false)}
className="absolute top-3 right-3 opacity-60 hover:opacity-100"
>
<X size={16}/>
</button>

<h3 className="font-semibold mb-2">
Buy Credits
</h3>

<p className={`text-sm mb-4 ${popupSub}`}>
Use credits to generate AI interviews and reports.
</p>

<button

onClick={()=>navigate("/pricing")}

className="w-full py-2 rounded-lg bg-linear-to-r from-blue-500 to-indigo-600 text-white font-medium hover:scale-105 transition"

>

Buy More Credits

</button>

</motion.div>

)}

</AnimatePresence>

</div>

</header>

  )
}



export default AiInterviewNavbar
