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
import ProtectedRoute from './pages/ProtectedRoute'
import AdminProtectedRoute from './pages/AdminProtectedRoute'
import AdminModal from './adminModule/AdminModal'

function App() {
  return (
    <div>
      
      <Routes>
      <Route path="/" element={<Home/>}/>
            <Route path="/about" element={<About/>}/>
            <Route path='/admin-login' element={<AdminModal/>}/>
            <Route path="/admin" element={<AdminProtectedRoute><AdminHome/> </AdminProtectedRoute> }/>
                        <Route path="/manager" element={<ProtectedRoute allowedRoles={["Manager"]}><StoreManagerHome/></ProtectedRoute>}/>
                        <Route path="/cashier" element={<ProtectedRoute allowedRoles={["Cashier"]}><CashierHome/></ProtectedRoute>}/>


      </Routes>
    </div>
  )
}

export default App
