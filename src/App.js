import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Today from './Pages/Today'
import Home from './Pages/Home'
import Simulation from './Pages/Simulation'
import SolarCell from 'Pages/SolarCell'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/today' element={<Today />} />
      <Route path='/simulation' element={<Simulation />} />
      <Route path='/solarcell' element={<SolarCell />} />
    </Routes>
  )
}

export default App
