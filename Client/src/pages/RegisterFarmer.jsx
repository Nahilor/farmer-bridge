// src/pages/RegisterFarmer.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import { api } from '../services/api';

const RegisterFarmer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    region: '',
    zone: '',
    woreda: '',
    farmLocation: '',
    fanId: '',
    products: [],
    profilePhoto: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // Handle multi-select products
      if (checked) {
        setFormData({
          ...formData,
          products: [...formData.products, value]
        });
      } else {
        setFormData({
          ...formData,
          products: formData.products.filter(product => product !== value)
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profilePhoto: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Create FormData object for file upload
    const submitData = new FormData();
    submitData.append('fullName', formData.fullName);
    submitData.append('phone', formData.phone);
    submitData.append('password', formData.password);
    submitData.append('region', formData.region);
    submitData.append('zone', formData.zone);
    submitData.append('woreda', formData.woreda);
    submitData.append('farmLocation', formData.farmLocation);
    submitData.append('fanId', formData.fanId);
    submitData.append('products', JSON.stringify(formData.products));
    
    if (formData.profilePhoto) {
      submitData.append('profilePhoto', formData.profilePhoto);
    }

    try {
      const response = await api.registerFarmer(submitData);
      console.log('Registration Response:', response);
      
      // Expected JSON response:
      // {
      //   success: true,
      //   message: "Registration successful. Awaiting admin approval.",
      //   user: {
      //     _id: "60d5f9f8b8e5a8b6a8e5a8b6",
      //     fullName: "John Doe",
      //     phone: "0912345678",
      //     role: "farmer",
      //     status: "pending",
      //     location: { region: "...", zone: "...", woreda: "..." },
      //     createdAt: "2024-01-01T00:00:00.000Z"
      //   }
      // }
      
      setSuccess('Registration successful! Admin will verify your account within 24 hours. You will receive an SMS notification.');
      
      // Reset form
      setFormData({
        fullName: '',
        phone: '',
        password: '',
        confirmPassword: '',
        region: '',
        zone: '',
        woreda: '',
        farmLocation: '',
        fanId: '',
        products: [],
        profilePhoto: null,
      });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      console.error('Registration Error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const productsList = [
    'Onion', 'Tomato', 'Potato', 'Cabbage', 
    'Carrot', 'Teff', 'Maize', 'Wheat', 
    'Barley', 'Bean', 'Pepper', 'Garlic'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 to-green-900 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">👨‍🌾</div>
          <h1 className="text-3xl font-bold text-gray-800">Farmer Registration</h1>
          <p className="text-gray-600 mt-2">Join as a farmer to sell your produce directly</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Info */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="09XXXXXXXX"
            />
            <p className="text-gray-500 text-sm mt-1">Format: 09XXXXXXXX (10 digits)</p>
          </div>

          {/* Location */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Region *</label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Select Region</option>
                <option value="Addis Ababa">Addis Ababa</option>
                <option value="Oromia">Oromia</option>
                <option value="Amhara">Amhara</option>
                <option value="Tigray">Tigray</option>
                <option value="Sidama">Sidama</option>
                <option value="SNNPR">SNNPR</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Zone *</label>
              <input
                type="text"
                name="zone"
                value={formData.zone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter zone"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Woreda *</label>
              <input
                type="text"
                name="woreda"
                value={formData.woreda}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter woreda"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Farm Location *</label>
              <input
                type="text"
                name="farmLocation"
                value={formData.farmLocation}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Specific location / landmark"
              />
            </div>
          </div>

          {/* Verification */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">FAN ID Number *</label>
            <input
              type="text"
              name="fanId"
              value={formData.fanId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Your Farmer ID number"
            />
          </div>

          {/* Products */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Products You Grow *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 border rounded-lg max-h-48 overflow-y-auto">
              {productsList.map(product => (
                <label key={product} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={product}
                    checked={formData.products.includes(product)}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600"
                  />
                  <span className="text-sm">{product}</span>
                </label>
              ))}
            </div>
            <p className="text-gray-500 text-sm mt-1">Select all products you grow</p>
          </div>

          {/* Profile Photo */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Profile Photo *</label>
            <input
              type="file"
              name="profilePhoto"
              onChange={handleFileChange}
              accept="image/*"
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
            <p className="text-gray-500 text-sm mt-1">Upload a clear photo of yourself</p>
          </div>

          {/* Password */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Minimum 6 characters"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register as Farmer'}
          </button>

          <p className="text-center text-gray-600 text-sm">
            Already have an account? <Link to="/login" className="text-green-600 hover:underline">Login here</Link>
          </p>
        </form>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            📝 <strong>Note:</strong> Your account will be reviewed by admin within 24 hours. 
            You'll receive an SMS notification once verified.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterFarmer;