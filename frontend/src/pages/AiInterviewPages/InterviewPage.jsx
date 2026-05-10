import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Step1SetUp from '../../components/AiInterview/Step1SetUp';
import Step2Interview from '../../components/AiInterview/Step2Interview';
import { useTheme } from '../../context/ThemeContext';

const InterviewPage = () => {
    const [step,setStep] = useState(1);
    const [interviewData,setInterviewData]= useState(null)
  const { isDark } = useTheme()
  const navigate = useNavigate()
  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDark
        ? 'bg-linear-to-br from-slate-950 via-blue-950 to-slate-950 text-white'
        : 'bg-linear-to-br from-blue-50 via-white to-blue-50 text-black'
    }`}>
      {step == 1  && (
        <div>
            <Step1SetUp onStart={(data)=>{setInterviewData(data);setStep(2)}} />
        </div>
      )}
      {step == 2   && (
        <div>
            <Step2Interview
              interviewData={interviewData}
              onFinish={(report) => {
                setInterviewData(report)
                const reportId = report?._id || report?.interviewId
                if (reportId) {
                  navigate(`/ai-interview/report/${reportId}`)
                  return
                }
                navigate('/ai-interview/history')
              }}
            />
        </div>
      )}

    
    </div>
  )
}

export default InterviewPage
