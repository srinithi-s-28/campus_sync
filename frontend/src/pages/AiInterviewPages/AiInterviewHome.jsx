import React from 'react'
import AiInterviewNavbar from '../../components/AiInterview/AiInterviewNavbar'
import AiInterviewHeroSection from '../../components/AiInterview/AiInterviewHeroSection'
import AiInterviewSteps from '../../components/AiInterview/AiInterviewSteps'
import { useTheme } from '../../context/ThemeContext'

const AiInterviewHome = () => {
  const { isDark } = useTheme()

  return (
    <div className={`${
      isDark
        ? 'bg-linear-to-br from-slate-950 via-blue-950 to-slate-950 text-white'
        : 'bg-linear-to-br from-blue-50 via-white to-blue-50 text-black'
    } transition-all duration-300`}>

        <AiInterviewNavbar/>
        <AiInterviewHeroSection/>
        <AiInterviewSteps/>
      
    </div>
  ) 
}

export default AiInterviewHome
