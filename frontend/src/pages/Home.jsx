import React from 'react'
import { useTheme } from '../context/ThemeContext'
import HeroSlider from '../components/HeroSlider'
import CampusFeatures from '../components/CampusFeatures'
import WhyChooseCampusSync from '../components/WhyChooseCampusSync'
import HowItWorks from '../components/HowItWorks'
import Testimonials from '../components/Testimonials'
import JoinCTA from '../components/JoinCTA'


const Home = () => {
  const { isDark } = useTheme()
  return (
   
         <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900' : 'bg-gradient-to-br from-white via-blue-50 to-white'}`}>


      <HeroSlider />
       <CampusFeatures />
       <WhyChooseCampusSync/>
       <HowItWorks/>
       <Testimonials/>
       <JoinCTA/>
      
       
    </div>
   
  )
}

export default Home
