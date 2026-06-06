// src/pages/RegisterFarmer.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

const RegisterFarmer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'FARMER',
    address: {
      street: '',
      city: '',
      region: '',
      zipCode: ''
    },
    farmDetails: {
      farmSize: '',
      products: [],
      fanId: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested fields (address.street, farmDetails.farmSize, etc.)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleProductChange = (e) => {
    const { value, checked } = e.target;
    let updatedProducts = [...formData.farmDetails.products];
    
    if (checked) {
      updatedProducts.push(value);
    } else {
      updatedProducts = updatedProducts.filter(p => p !== value);
    }
    
    setFormData({
      ...formData,
      farmDetails: {
        ...formData.farmDetails,
        products: updatedProducts
      }
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');
  setLoading(true);

  // ... validation code ...
  const addressString = [
    formData.address.street,
    formData.address.city,
    formData.address.region,
    formData.address.zipCode
  ].filter(Boolean).join(', ');

  // Prepare data - address MUST be a string
  const submitData = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    password: formData.password,
    role: formData.role,
    address: addressString, // ← THIS MUST BE A STRING, NOT AN OBJECT!
    farmDetails: formData.farmDetails
  };

  console.log('Submitting farmer registration:', submitData);

  try {
    const response = await api.register(submitData);
    console.log('Registration Response:', response);
    
    setSuccess('Registration successful! Admin will verify your account within 24 hours.');
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'FARMER',
      address: {
        street: '',
        city: '',
        region: '',
        zipCode: ''
      },
      farmDetails: {
        farmSize: '',
        products: [],
        fanId: ''
      }
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
    'Barley', 'Bean', 'Pepper', 'Garlic',
    'Coffee', 'Avocado', 'Mango', 'Orange'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 to-green-900 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">👨‍🌾</div>
          <h1 className="text-3xl font-bold text-gray-800">Farmer Registration</h1>
          <p className="text-gray-600 mt-2">Join our platform to sell your produce directly to retailers</p>
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
          {/* Personal Information Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Personal Information</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="you@example.com"
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
          </div>

          {/* Address Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Address Information</h2>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Street Address *</label>
            <input
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Street name and number"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">City *</label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Region *</label>
              <input
                type="text"
                name="address.region"
                value={formData.address.region}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Region/State"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Zip/Postal Code</label>
            <input
              type="text"
              name="address.zipCode"
              value={formData.address.zipCode}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Zip code (optional)"
            />
          </div>

          {/* Farm Details Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Farm Details</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">FAN ID Number *</label>
              <input
                type="text"
                name="farmDetails.fanId"
                value={formData.farmDetails.fanId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Farmer ID number"
              />
              <p className="text-gray-500 text-sm mt-1">Your official Farmer ID number</p>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Farm Size (hectares)</label>
              <input
                type="number"
                name="farmDetails.farmSize"
                value={formData.farmDetails.farmSize}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="e.g., 5 hectares"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Products You Grow *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 border rounded-lg max-h-48 overflow-y-auto">
              {productsList.map(product => (
                <label key={product} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={product}
                    checked={formData.farmDetails.products.includes(product)}
                    onChange={handleProductChange}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <span className="text-sm text-gray-700">{product}</span>
                </label>
              ))}
            </div>
            <p className="text-gray-500 text-sm mt-1">Select all products you currently grow</p>
          </div>

          {/* Password Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Security</h2>
          </div>

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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Confirm your password"
              />
            </div>
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
                Registering...
              </div>
            ) : (
              'Register as Farmer'
            )}
          </button>

          <p className="text-center text-gray-600 text-sm">
            Already have an account? <Link to="/login" className="text-green-600 hover:underline">Login here</Link>
          </p>
        </form>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            📝 <strong>Note:</strong> 
          </p>
          <ul className="text-sm text-yellow-700 mt-2 space-y-1 list-disc list-inside">
            <li>Your account will be reviewed by admin within 24 hours</li>
            <li>You'll receive an SMS notification once verified</li>
            <li>FAN ID is required for farmer verification</li>
            <li>All fields marked with * are required</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegisterFarmer;