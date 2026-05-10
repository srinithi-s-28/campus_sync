import React from 'react'
import ExamNavbar from '../components/ExamNavbar'
import HeroExam from '../components/HeroExam'
import { useTheme } from "../context/ThemeContext"

const StudyHome = () => {
  
  const { isDark } = useTheme()
  return (
    <div>
        <ExamNavbar/>
        <HeroExam/>
    </div>
  )
}

export default StudyHome

