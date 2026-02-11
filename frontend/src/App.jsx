import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './Components/Navbar'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import Profilepage from './pages/ProfilePage'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

const App = () => {
  const { authUser,checkAuth, isCheckingAuth } = useAuthStore();
  const {theme} = useThemeStore()


  useEffect(() => {
    checkAuth()

  }, [checkAuth]);

  console.log({ authUser }); 

  if (isCheckingAuth && !authUser ) 
  return (
    <div className='flex item-center justify-center h-screen'>
      <Loader className="size-10 animate-spin" />
    </div>
    // <div className="bg-red-500 text-white p-10 text-3xl">
    //   Tailwind Works ✅
    // </div>

  )


  return (
      <div data-theme={theme}>
        <Navbar/>

        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login"/> } />
          <Route path="/signup" element={ !authUser ? <SignUpPage /> : <Navigate to="/"/>} />
          <Route path="/login" element={ !authUser ? <LoginPage /> : <Navigate to="/"/> } />
          <Route path="/Settings" element={<SettingsPage /> } />
          <Route path="/Profile" element={ authUser ? <Profilepage /> : <Navigate to="/login" /> } />
        </Routes>

        <Toaster />
    </div>
  )
}

export default App
