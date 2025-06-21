import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from "sonner"
import {Dashboard} from './pages/dashboard'

import { LoginForm } from "./pages/login-form"

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<div className="flex min-h-svh flex-col items-center justify-center">
              <LoginForm className="w-full max-w-lg"/>
            </div>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
      <Toaster richColors position="top-right" /> 
    </>
  )
}

export default App