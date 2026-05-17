import { useState } from 'react'
import NavBar from './components/Navbar.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home.jsx'
import Contact from './pages/Contact.jsx'
import About from './pages/About.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Footer from './components/Footer.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import TermsOfService from './pages/Terms.jsx'
import ScrollToTop from './components/ScrollToTop.tsx'
import Movie from './pages/Movie.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Profile from './pages/Profile.jsx'

function App() {
 return (
    <BrowserRouter>
      <ScrollToTop />
      <NavBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movie' element={<Movie />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/privacy' element={<PrivacyPolicy />} />
        <Route path='/terms' element={<TermsOfService />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/admin' element={<AdminDashboard />} />
      </Routes>
      <Footer />
    </BrowserRouter>
 )
}

export default App
