import React from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from '../home/Home.jsx'
import Default from '../default/Default.jsx'
import Mobile from '../mobile/Mobile.jsx'
import Admin from '../admin/Admin.jsx'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/default' element={<Default />} />
        <Route path='/mobile' element={<Mobile />} />
        <Route path='/admin1806051891' element={<Admin/>} />
      </Routes>
    </div>
  )
}

export default App
