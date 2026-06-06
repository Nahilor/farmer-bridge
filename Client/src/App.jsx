import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import RegisterFarmer from './pages/RegisterFarmer'
import RegisterRetailer from './pages/RegisterRetailer'
import Login from './pages/Login'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import ProtectedRoute from './components/layout/ProtectedRoute'

import FarmerDashboard from './pages/Farmer/FarmerDashboard'
import FarmerProfile from './pages/Farmer/FarmerProfile'
import MyProducts from './pages/Farmer/MyProducts'
import OrdersReceived from './pages/Farmer/OrdersReceived'
import AddProduct from './pages/Farmer/AddProduct'
import EditProduct from './pages/Farmer/EditProduct'

import RetailerDashboard from './pages/Retailer/retailerDashboard';
import BrowseFarmers from './pages/Retailer/BrowseFarmers';
import FarmerProfileView from './pages/Retailer/FarmerProfileView';
import MyOrders from './pages/Retailer/MyOrders';

import AdminDashboard from './pages/Admin/AdminDashboard';
import PendingApprovals from './pages/Admin/PendingApproval';
import UserManagement from './pages/Admin/UserManagement';

import Help from './pages/Help'
import Contact from './pages/Contact'

import About from './pages/About'

function AppContent() {
  const location = useLocation()
  const isLandingPage = location.pathname === '/'
  
  return (
    <div className="flex flex-col min-h-screen">
      {!isLandingPage && <Header />}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/register/farmer' element={<RegisterFarmer/>}/>
          <Route path='/register/retailer' element={<RegisterRetailer/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path="/help" element={<Help />} />
          <Route path="/profile" element={<FarmerProfile/>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Farmer Portal Routes (Protected) */}
          <Route path='/farmer/dashboard' element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <FarmerDashboard />
            </ProtectedRoute>
          } />
          
          
          <Route path='/farmer/profile' element={
            <ProtectedRoute allowedRoles={['FARMER']}>
                <FarmerProfile />
            </ProtectedRoute>
          } />

          <Route path='/farmer/MyProducts' element={
            <ProtectedRoute allowedRoles={['FARMER']}>
                <MyProducts />
            </ProtectedRoute>
          } />

          <Route path='/farmer/OrdersReceived' element={
            <ProtectedRoute allowedRoles={['FARMER']}>
                <OrdersReceived />
            </ProtectedRoute>
          } />

          <Route path='/farmer/AddProduct' element={
            <ProtectedRoute allowedRoles={['FARMER']}>
                <AddProduct />
            </ProtectedRoute>
          } />

          <Route path="/farmer/products/edit/:productId" element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <EditProduct />
            </ProtectedRoute> 
          } /> 

        <Route path="/retailer/dashboard" element={
          <ProtectedRoute allowedRoles={['RETAILER']}>
            <RetailerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/retailer/browse" element={
          <ProtectedRoute allowedRoles={['RETAILER']}>
            <BrowseFarmers />
          </ProtectedRoute>
        } />
        <Route path="/retailer/farmer/:farmerId" element={
          <ProtectedRoute allowedRoles={['RETAILER']}>
            <FarmerProfileView />
          </ProtectedRoute>
        } />
        <Route path="/retailer/orders" element={
          <ProtectedRoute allowedRoles={['RETAILER']}>
            <MyOrders />
          </ProtectedRoute>
        } />

        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/approvals" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <PendingApprovals />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <UserManagement />
          </ProtectedRoute>
        } />
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