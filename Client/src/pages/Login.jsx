// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // Initialize phone from localStorage to avoid setState in effect
  const initialPhone = typeof window !== 'undefined' ? (localStorage.getItem('rememberedPhone') || '') : '';
  const [formData, setFormData] = useState({
    phone: initialPhone,
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

    // Basic validation
    if (!formData.phone || !formData.password) {
      setError('Please enter both phone number and password');
      setLoading(false);
      return;
    }

    try {
      // Make sure phone number is clean (remove any spaces)
      const cleanPhone = formData.phone.trim();
      
      const response = await api.login({
        phone: cleanPhone,
        password: formData.password
      });
      
      console.log('Login Response:', response);
      
      // Handle remember me
      if (formData.rememberMe) {
        localStorage.setItem('rememberedPhone', cleanPhone);
      } else {
        localStorage.removeItem('rememberedPhone');
      }
      
      // Extract user from response (adjust based on your actual response structure)
      const { user, token } = response;
      
      // Store token and user data
      if (token) {
        localStorage.setItem('token', token);
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      // Check account status
      if (user.status === 'pending') {
        setError('Your account is pending admin approval. You will be notified via SMS once approved.');
        setLoading(false);
        return;
      }
      
      if (user.status === 'rejected') {
        setError('Your registration was rejected. Please contact support for assistance.');
        setLoading(false);
        return;
      }
      
      if (user.status === 'suspended') {
        setError('Your account has been suspended. Please contact admin for more information.');
        setLoading(false);
        return;
      }
      
      // Redirect based on role
      switch(user.role) {
        case 'FARMER':
          navigate('/farmer/dashboard');
          break;
        case 'RETAILER':
          navigate('/retailer/dashboard');
          break;
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
      
    } catch (err) {
      console.error('Login Error:', err);
      
      // Handle specific error messages
      if (err.message === 'Invalid credentials') {
        setError('Invalid phone number or password. Please try again.');
      } else if (err.message === 'User not found') {
        setError('No account found with this phone number. Please register first.');
      } else if (err.message.includes('Network')) {
        setError('Network error. Please check your connection.');
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
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
              <Link to="/" className="text-green-600 hover:underline font-semibold">
                Register here
              </Link>
            </p>
            <p className="text-xs text-gray-500 mt-4">
              By logging in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </form>

        {/* Demo credentials for testing */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600 font-semibold mb-2">Demo Credentials (Testing only):</p>
          <div className="space-y-1 text-xs text-gray-500">
            <p>👨‍🌾 <span className="font-medium">Farmer:</span> 0912345678 / password123</p>
            <p>🏪 <span className="font-medium">Retailer:</span> 0987654321 / password123</p>
            <p>👨‍💼 <span className="font-medium">Admin:</span> 0911111111 / admin123</p>
          </div>
          <p className="text-xs text-yellow-600 mt-2">
            ⚠️ Use these for testing. In production, these will be removed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;