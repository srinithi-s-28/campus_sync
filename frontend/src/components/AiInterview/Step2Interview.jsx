import React, { useEffect, useRef, useState } from "react"
import maleVideo from "../../assets/male.mp4"
import femaleVideo from "../../assets/female.mp4"
import Timer from "./Timer"
import { FaMicrophone } from "react-icons/fa"
import axios from "axios"
import { serverUrl } from "../../main"
import { useTheme } from "../../context/ThemeContext"

const Step2Interview = ({ interviewData, onFinish }) => {
  const { isDark } = useTheme()

  const interviewId = interviewData?._id || ""
  const questions = interviewData?.questions || []
  const userName = interviewData?.userName || interviewData?.name || ""

  const [currentIndex,setCurrentIndex] = useState(0)
  const [answer,setAnswer] = useState("")
  const [subtitle,setSubtitle] = useState("")
  const [isIntroPhase,setIsIntroPhase] = useState(true)

  const [timeLeft,setTimeLeft] = useState(60)
  const [isSubmitting,setIsSubmitting] = useState(false)
  const [feedback,setFeedback] = useState("")

  const [selectedVoice,setSelectedVoice] = useState(null)
  const [voiceGender,setVoiceGender] = useState("female")
  const [isAIPlaying,setIsAIPlaying] = useState(false)
  const [isMicOn,setIsMicOn] = useState(false)

  const videoRef = useRef(null)
  const recognitionRef = useRef(null)
  const baseAnswerRef = useRef("")

  const currentQuestion = questions[currentIndex]?.question || ""
  const currentTimeLimit = questions[currentIndex]?.timeLimit || 60
  const totalQuestions = questions.length || 1

  /* ---------- STOP MIC ---------- */

  const stopMic = () => {
    if(recognitionRef.current){
      recognitionRef.current.stop()
      setIsMicOn(false)
    }
  }

  /* ---------- LOAD VOICES ---------- */

  useEffect(()=>{

    const loadVoices = ()=>{

      const voices = window.speechSynthesis.getVoices()

      if(!voices.length) return

      const female = voices.find(v =>
        v.name.toLowerCase().includes("female") ||
        v.name.toLowerCase().includes("zira") ||
        v.name.toLowerCase().includes("samantha")
      )

      if(female){
        setSelectedVoice(female)
        setVoiceGender("female")
        return
      }

      const male = voices.find(v =>
        v.name.toLowerCase().includes("male") ||
        v.name.toLowerCase().includes("david")
      )

      if(male){
        setSelectedVoice(male)
        setVoiceGender("male")
        return
      }

      setSelectedVoice(voices[0])

    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices

  },[])

  /* ---------- SPEAK TEXT ---------- */

  const speakText = (text)=>{

    return new Promise(resolve=>{

      if(!window.speechSynthesis || !selectedVoice){
        resolve()
        return
      }

      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)

      utterance.voice = selectedVoice
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 1

      utterance.onstart = ()=>{
        setIsAIPlaying(true)
        setSubtitle(text)
        videoRef.current?.play()
      }

      utterance.onend = ()=>{
        setIsAIPlaying(false)
        videoRef.current?.pause()
        videoRef.current.currentTime = 0
        resolve()
      }

      utterance.onerror = ()=>{
        setIsAIPlaying(false)
        resolve()
      }

      window.speechSynthesis.speak(utterance)

    })

  }

  /* ---------- INTRO + QUESTION FLOW ---------- */

  useEffect(()=>{

    if(!selectedVoice) return

    const runInterview = async()=>{

      if(isIntroPhase){

        await speakText(`Hi ${userName}. Welcome to your AI interview session.`)

        await speakText(
          "I will ask you a few questions. Please answer clearly and confidently."
        )

        setIsIntroPhase(false)

      }
      else if(currentQuestion){

        await new Promise(r=>setTimeout(r,800))

        if(currentIndex === questions.length-1){
          await speakText("This will be the final question.")
        }

        await speakText(currentQuestion)

      }

    }

    runInterview()

  },[selectedVoice,isIntroPhase,currentIndex])

  /* ---------- TIMER RESET ---------- */

  useEffect(()=>{
    setTimeLeft(currentTimeLimit)
  },[currentIndex,currentTimeLimit])

  /* ---------- TIMER ---------- */

  useEffect(()=>{

    if(isIntroPhase || isAIPlaying || timeLeft<=0 || isSubmitting) return

    const timer = setInterval(()=>{
      setTimeLeft(prev => prev>0 ? prev-1 : 0)
    },1000)

    return ()=>clearInterval(timer)

  },[timeLeft,isAIPlaying,isIntroPhase,isSubmitting,currentIndex])

  /* ---------- AUTO SUBMIT ---------- */

  useEffect(()=>{
    if(timeLeft===0 && !isAIPlaying && !isIntroPhase){
      handleSubmitAnswer(true)
    }
  },[timeLeft])

  /* ---------- SPEECH RECOGNITION ---------- */

  useEffect(()=>{

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if(!SpeechRecognition) return

    const recognition = new SpeechRecognition()

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onresult = (event)=>{
      let finalTranscript = ""
      let interimTranscript = ""

      for(let i=event.resultIndex;i<event.results.length;i++){
        const text = event.results[i][0].transcript
        if(event.results[i].isFinal){
          finalTranscript += text
        } else {
          interimTranscript += text
        }
      }

      const prefix = baseAnswerRef.current?.trim()
      const merged = `${prefix ? `${prefix} ` : ""}${finalTranscript}${interimTranscript}`.trim()
      setAnswer(merged)
    }

    recognition.onend = ()=>{
      setIsMicOn(false)
    }

    recognitionRef.current = recognition

    return ()=>{
      recognition.stop()
      recognitionRef.current = null
    }

  },[])

  /* ---------- MIC TOGGLE ---------- */

  const toggleMic = ()=>{

    if(!recognitionRef.current) return
    if(isAIPlaying || isSubmitting) return

    if(isMicOn){
      stopMic()
      return
    }

    baseAnswerRef.current = answer
    try {
      recognitionRef.current.start()
    } catch {
      return
    }
    setIsMicOn(true)

  }

  /* ---------- SUBMIT ANSWER ---------- */

  const handleSubmitAnswer = async(forceSubmit=false)=>{

    if(isSubmitting || !interviewId) return

    const finalAnswer = forceSubmit
      ? (answer.trim() || "No answer provided.")
      : answer.trim()

    if(!finalAnswer) return

    stopMic()
    setIsSubmitting(true)

    try{

      const timeTaken = Math.max(0,currentTimeLimit-timeLeft)

      const submitRes = await axios.post(
        `${serverUrl}/api/interview/submit-answer`,
        {
          interviewId,
          questionIndex:currentIndex,
          answer:finalAnswer,
          timeTaken
        },
        {withCredentials:true}
      )

      setFeedback(submitRes?.data?.question?.feedback || "")
      setAnswer("")

      if(currentIndex < questions.length-1){

        setCurrentIndex(prev=>prev+1)

      } else {

        const finishRes = await axios.post(
          `${serverUrl}/api/interview/finish`,
          {interviewId},
          {withCredentials:true}
        )

        onFinish?.(finishRes?.data || {})

      }

    }catch(error){

      console.error("Submit Answer Error:",error)

    }finally{

      setIsSubmitting(false)

    }

  }

  return (

    <div className={`min-h-screen px-4 py-8 transition-all duration-300 ${
      isDark
        ? "bg-linear-to-b from-slate-950 via-blue-950 to-slate-950 text-white"
        : "bg-linear-to-b from-slate-50 to-blue-50 text-black"
    }`}>

      <div className={`mx-auto max-w-6xl rounded-3xl border shadow-xl transition-all duration-300 ${
        isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"
      }`}>

        <div className="grid lg:grid-cols-[360px_1fr]">

          {/* LEFT PANEL */}

          <div className={`p-5 ${isDark ? "border-r border-slate-700" : "border-r"}`}>

            <div className={`overflow-hidden rounded-2xl border ${isDark ? "border-slate-700" : ""}`}>

              <video
                ref={videoRef}
                className="h-56 w-full object-cover"
                muted
                playsInline
                preload="auto"
                src={voiceGender==="female" ? femaleVideo : maleVideo}
              />

            </div>

            <div className={`mt-4 rounded-xl border p-4 transition-all duration-300 ${isDark ? "border-slate-700" : ""}`}>

              <div className="flex justify-between text-sm">

                <span className={`${isDark ? "text-slate-400" : "text-gray-500"}`}>Interview Status</span>

                <span className="font-semibold text-emerald-600">
                  {isAIPlaying ? "AI Speaking" : "Waiting"}
                </span>

              </div>

              <div className={`my-4 border-t ${isDark ? "border-slate-700" : ""}`} />

              <div className="flex justify-center">
                <Timer timeLeft={timeLeft} totalTime={currentTimeLimit}/>
              </div>

              <div className={`my-4 border-t ${isDark ? "border-slate-700" : ""}`} />

              <div className="grid grid-cols-2 text-center">

                <div>
                  <p className="text-xl font-bold text-blue-600">
                    {currentIndex+1}
                  </p>
                  <p className={`text-xs ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                    Current Question
                  </p>
                </div>

                <div>
                  <p className="text-xl font-bold text-blue-600">
                    {totalQuestions}
                  </p>
                  <p className={`text-xs ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                    Total Questions
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* RIGHT PANEL */}

          <div className="flex flex-col p-6">

            <h2 className={`text-2xl font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
              AI Smart Interview
            </h2>

            <div className={`mt-4 rounded-xl border p-4 transition-all duration-300 ${
              isDark ? "border-slate-700 bg-slate-800" : "bg-slate-50"
            }`}>

              <p className={`text-xs ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                Question {currentIndex+1} of {totalQuestions}
              </p>

              <div className={`mt-2 text-lg font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                {currentQuestion}
              </div>

            </div>

            {subtitle && (
              <div className={`mt-3 text-sm italic ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                {subtitle}
              </div>
            )}

            <textarea
              value={answer}
              onChange={(e)=>setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className={`mt-4 flex-1 rounded-xl border p-4 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300 ${
                isDark ? "border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500" : "bg-white text-slate-900"
              }`}
            />

            <div className="mt-4 flex gap-3">

              <button
                onClick={toggleMic}
                className={`flex h-12 w-12 items-center justify-center rounded-full text-white ${
                  isMicOn ? "bg-emerald-600" : "bg-black"
                }`}
              >
                <FaMicrophone/>
              </button>

              <button
                onClick={()=>handleSubmitAnswer(false)}
                disabled={isSubmitting || isAIPlaying}
                className="flex-1 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Submit Answer"}
              </button>

            </div>

            {feedback && (
              <p className={`mt-3 rounded-lg border px-3 py-2 text-sm ${
                isDark ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-emerald-100 bg-emerald-50 text-emerald-700"
              }`}>
                {feedback}
              </p>
            )}

            <p className={`mt-3 text-xs ${isDark ? "text-slate-500" : "text-gray-400"}`}>
              Candidate: {userName || "Student"} • ID: {interviewId}
            </p>

          </div>

        </div>

      </div>

    </div>

  )

}

export default Step2Interview