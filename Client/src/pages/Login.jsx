// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.phone || !formData.password) {
      setError('Please enter both phone number and password');
      setLoading(false);
      return;
    }

    try {
      const response = await api.login({
        phone: formData.phone,
        password: formData.password
      });
      
      console.log('Login Response:', response);
      
      // Expected JSON response:
      // {
      //   success: true,
      //   message: "Login successful",
      //   token: "eyJhbGciOiJIUzI1NiIs...",
      //   user: {
      //     _id: "60d5f9f8b8e5a8b6a8e5a8b6",
      //     name: "John Doe",
      //     phone: "0912345678",
      //     role: "farmer", // or "retailer" or "admin"
      //     status: "active", // or "pending" or "suspended"
      //     location: {...},
      //     ...
      //   }
      // }
      
      // Store token (already done in api.login)
      if (response.rememberMe || formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      // Redirect based on user role and status
      const { user } = response;
      
      // Check if user is approved
      if (user.status === 'pending') {
        setError('Your account is pending admin approval. You will receive an SMS when approved.');
        setLoading(false);
        return;
      }
      
      if (user.status === 'suspended') {
        setError('Your account has been suspended. Please contact admin for more information.');
        setLoading(false);
        return;
      }
      
      if (user.status === 'rejected') {
        setError('Your registration was rejected. Please contact support for assistance.');
        setLoading(false);
        return;
      }
      
      // Redirect based on role
      switch(user.role) {
        case 'farmer':
          navigate('/farmer/dashboard');
          break;
        case 'retailer':
          navigate('/retailer/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
      
    } catch (err) {
      console.error('Login Error:', err);
      if (err.message === 'Invalid credentials') {
        setError('Invalid phone number or password');
      } else if (err.message === 'User not found') {
        setError('No account found with this phone number');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 to-green-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔐</div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Login to your Farmer Bridge account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="09XXXXXXXX"
              autoComplete="username"
            />
            <p className="text-gray-500 text-sm mt-1">Enter the phone number you registered with</p>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 text-green-600 rounded"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            
            <Link to="/forgot-password" className="text-sm text-green-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Logging in...
              </div>
            ) : (
              'Login'
            )}
          </button>

          <div className="text-center space-y-2">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/" className="text-green-600 hover:underline">
                Choose your role
              </Link>
            </p>
            <p className="text-xs text-gray-500 mt-4">
              By logging in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;