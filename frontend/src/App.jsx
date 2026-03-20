import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Dashboard from './pages/dashboard/Dashboard'
import Landing from './pages/home/Landing'
import { Navigate } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Landing/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App