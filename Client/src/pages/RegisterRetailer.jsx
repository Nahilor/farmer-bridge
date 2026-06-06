// src/pages/RegisterRetailer.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

const RegisterRetailer = () => {
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
    role: 'RETAILER',
    address: {
      street: '',
      city: '',
      region: '',
      zipCode: ''
    },
    businessDetails: {
      businessName: '',
      licenseNumber: '',
      businessType: ''
    },
    interestedProducts: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested fields (address.street, businessDetails.businessName, etc.)
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
    if (checked) {
      setFormData({
        ...formData,
        interestedProducts: [...formData.interestedProducts, value]
      });
    } else {
      setFormData({
        ...formData,
        interestedProducts: formData.interestedProducts.filter(p => p !== value)
      });
    }
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

    if (!formData.email) {
      setError('Email address is required');
      setLoading(false);
      return;
    }

    // Convert address object to a single string (matching backend expectation)
    const addressString = [
      formData.address.street,
      formData.address.city,
      formData.address.region,
      formData.address.zipCode
    ].filter(Boolean).join(', ');

    // Prepare data matching backend expectations
    const submitData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role,
      address: addressString, // Send as string, not object
      businessDetails: {
        businessName: formData.businessDetails.businessName,
        licenseNumber: formData.businessDetails.licenseNumber,
        businessType: formData.businessDetails.businessType
      },
      interestedProducts: formData.interestedProducts
    };

    console.log('Submitting retailer registration:', submitData);

    try {
      const response = await api.register(submitData);
      console.log('Registration Response:', response);
      
      setSuccess('Registration successful! Admin will verify your business license within 24 hours.');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'RETAILER',
        address: {
          street: '',
          city: '',
          region: '',
          zipCode: ''
        },
        businessDetails: {
          businessName: '',
          licenseNumber: '',
          businessType: ''
        },
        interestedProducts: []
      });
      
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

  const businessTypes = [
    'Grocery Store',
    'Supermarket',
    'Restaurant',
    'Hotel',
    'Cafeteria',
    'Food Processing',
    'Wholesale Distributor',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 to-green-900 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏪</div>
          <h1 className="text-3xl font-bold text-gray-800">Retailer Registration</h1>
          <p className="text-gray-600 mt-2">Join as a retailer to buy directly from farmers</p>
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
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="09XXXXXXXX"
              />
              <p className="text-gray-500 text-sm mt-1">Format: 09XXXXXXXX (10 digits)</p>
            </div>
          </div>

          {/* Business Information Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Business Information</h2>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Business Name *</label>
            <input
              type="text"
              name="businessDetails.businessName"
              value={formData.businessDetails.businessName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Enter your business/shop name"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Business License Number *</label>
              <input
                type="text"
                name="businessDetails.licenseNumber"
                value={formData.businessDetails.licenseNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Your business license number"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Business Type *</label>
              <select
                name="businessDetails.businessType"
                value={formData.businessDetails.businessType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Select business type</option>
                {businessTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
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
              className="w-full px-4 py-2 border rounded-lg"
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
                className="w-full px-4 py-2 border rounded-lg"
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
                className="w-full px-4 py-2 border rounded-lg"
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
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Zip code (optional)"
            />
          </div>

          {/* Address Preview */}
          {(formData.address.street || formData.address.city || formData.address.region) && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <span className="font-semibold">📍 Address will be saved as:</span><br />
                {[formData.address.street, formData.address.city, formData.address.region, formData.address.zipCode]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            </div>
          )}

          {/* Products Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Products Interested In</h2>
            <p className="text-sm text-gray-600 mb-3">Select all products you want to buy from farmers</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 border rounded-lg max-h-48 overflow-y-auto">
              {productsList.map(product => (
                <label key={product} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={product}
                    checked={formData.interestedProducts.includes(product)}
                    onChange={handleProductChange}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <span className="text-sm text-gray-700">{product}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Security Section */}
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
                placeholder="Confirm password"
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
              'Register as Retailer'
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
            <li>Your business license will be verified by admin within 24 hours</li>
            <li>You'll receive an SMS notification once approved</li>
            <li>All fields marked with * are required</li>
            <li>Only registered businesses with valid licenses can join</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegisterRetailer;