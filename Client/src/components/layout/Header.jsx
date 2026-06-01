// src/components/layout/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../services/api';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        setIsAuthenticated(true);
        const userData = JSON.parse(user);
        setUserRole(userData.role);
        setUserName(userData.fullName || userData.businessName || userData.ownerName || 'User');
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
        setUserName('');
      }
    };

    checkAuth();
    // Listen for storage changes (in case of logout in another tab)
    window.addEventListener('storage', checkAuth);
    
    return () => window.removeEventListener('storage', checkAuth);
  }, [location]);

  const handleLogout = () => {
    api.logout();
    setIsAuthenticated(false);
    setUserRole(null);
    setUserName('');
    navigate('/login');
  };

  // Get dashboard link based on role
  const getDashboardLink = () => {
    switch(userRole) {
      case 'farmer':
        return '/farmer/dashboard';
      case 'retailer':
        return '/retailer/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  // Get role display name
  const getRoleDisplay = () => {
    switch(userRole) {
      case 'farmer':
        return '👨‍🌾 Farmer';
      case 'retailer':
        return '🏪 Retailer';
      case 'admin':
        return '🖥️ Admin';
      default:
        return '';
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🌾</span>
            <span className="text-xl md:text-2xl font-bold text-green-700">
              Farmer Bridge
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-green-600 transition">
              Home
            </Link>
            
            {isAuthenticated && (
              <Link to={getDashboardLink()} className="text-gray-700 hover:text-green-600 transition">
                Dashboard
              </Link>
            )}
            
            <Link to="/about" className="text-gray-700 hover:text-green-600 transition">
              About
            </Link>
            
            <Link to="/contact" className="text-gray-700 hover:text-green-600 transition">
              Contact
            </Link>
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-lg hover:bg-green-100 transition">
                  <span className="text-green-700">{getRoleDisplay()}</span>
                  <span className="text-gray-700">{userName.split(' ')[0]}</span>
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl hidden group-hover:block">
                  <Link to={getDashboardLink()} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    My Profile
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Settings
                  </Link>
                  <hr className="my-1" />
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-green-700 border border-green-700 rounded-lg hover:bg-green-50 transition"
                >
                  Login
                </Link>
                <Link 
                  to="/" 
                  className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-green-600 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              {isAuthenticated && (
                <Link 
                  to={getDashboardLink()} 
                  className="text-gray-700 hover:text-green-600 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-green-600 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-green-600 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              <hr className="my-2" />
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/profile" 
                    className="text-gray-700 hover:text-green-600 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link 
                    to="/settings" 
                    className="text-gray-700 hover:text-green-600 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-red-600 py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-3 pt-2">
                  <Link 
                    to="/login" 
                    className="text-center px-4 py-2 text-green-700 border border-green-700 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/" 
                    className="text-center px-4 py-2 bg-green-700 text-white rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};