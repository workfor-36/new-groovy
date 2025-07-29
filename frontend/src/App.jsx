import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Header from "./components/Header"
import About from './pages/About'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import axios from "axios";
import AdminHome from './adminModule/AdminHome'
import StoreManagerHome from './storeManagerModule/StoreManagerHome'
import CashierHome from './cashierModule/CashierHome'


function App() {
  return (
    <div>
      
      <Navbar/>
      <Routes>
      <Route path="/" element={<Home/>}/>
            <Route path="/about" element={<About/>}/>
            <Route path="/admin" element={<AdminHome/>}/>
                        <Route path="/manager" element={<StoreManagerHome/>}/>
                        <Route path="/cashier" element={<CashierHome/>}/>


      </Routes>
    </div>
  )
}

export default App
