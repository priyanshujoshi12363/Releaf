import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import AppFlow from './Component/Dashboard.jsx'
import MainDashboard from './Component/MainDashboard.jsx'
import Achievement from './Component/moreComponenet/Achievement.jsx'
import Leaderboard from './Component/moreComponenet/Leaderboard.jsx'
import EarthFacts from './Component/moreComponenet/WorldMap.jsx'
import Chatbot from './Component/moreComponenet/Chatbot.jsx'
import Quize from './Component/moreComponenet/Quize.jsx'
import Clan from './Component/moreComponenet/clan.jsx'
import Roadmap from './Component/Learning.jsx'
import Intro from './Component/Content/Intro.jsx'
import Resources from './Component/Content/Resource.jsx'
import Pollution from './Component/Content/Pollution.jsx'
import Climate from './Component/Content/Climate.jsx'
const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/dashboard' />} />
      <Route path='/dashboard' element={<AppFlow />} />
      <Route path='/maindashboard' element={<MainDashboard />} />
      <Route path='/achievement' element={<Achievement/>} />
      <Route path='/leaderboard' element={<Leaderboard />} />
      <Route path='/earthfact' element={<EarthFacts />} />
      <Route path='/bot' element={<Chatbot />}/>
      <Route path="/quize" element={<Quize />} />
      <Route path="/clan" element={<Clan />} />
      <Route path="/learn" element={<Roadmap/>} />
      <Route path="/intro" element={<Intro/>} />
      <Route path='/resources' element={<Resources />} />
      <Route path='/pollution' element={<Pollution />} />
      <Route path='/climate' element={<Climate />} />
    </Routes>
  )
}

export default App
