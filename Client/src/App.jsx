import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import RegisterFarmer from './pages/RegisterFarmer'
import RegisterRetailer from './pages/RegisterRetailer'
import Login from './pages/Login'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'

function AppContent() {
  const location = useLocation()
  const isLandingPage = location.pathname === '/'
  
  return (
    <div className="flex flex-col min-h-screen">
      {!isLandingPage && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register/farmer' element={<RegisterFarmer/>}/>
          <Route path='/register/retailer' element={<RegisterRetailer/>}/>
          <Route path='/Login' element={<Login/>}/>
        </Routes>
      </main>
      {!isLandingPage && <Footer />}
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App