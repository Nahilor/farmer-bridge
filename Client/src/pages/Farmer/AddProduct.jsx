// src/pages/farmer/AddProduct.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: 'kg',
    pricePerUnit: '',
    harvestDate: '',
    isUrgent: false,
    description: ''
  });

  const categories = [
    'Vegetables', 'Fruits', 'Grains', 'Dairy', 
    'Meat', 'Eggs', 'Coffee', 'Spices', 'Other'
  ];

  const units = ['kg', 'quintal', 'bundle', 'piece', 'dozen'];

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
    setSuccess('');
    setLoading(true);

    if (!formData.name || !formData.category || !formData.quantity || !formData.pricePerUnit) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (parseFloat(formData.quantity) <= 0) {
      setError('Quantity must be greater than 0');
      setLoading(false);
      return;
    }

    if (parseFloat(formData.pricePerUnit) <= 0) {
      setError('Price must be greater than 0');
      setLoading(false);
      return;
    }

    const submitData = {
      name: formData.name,
      category: formData.category,
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      pricePerUnit: parseFloat(formData.pricePerUnit),
      harvestDate: formData.harvestDate || new Date().toISOString().split('T')[0],
      isUrgent: formData.isUrgent,
      description: formData.description,
      status: 'active'
    };

    try {
      await api.addProduct(submitData);
      setSuccess('Product added successfully! Redirecting...');
      setTimeout(() => {
        navigate('/farmer/products');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
            <button onClick={() => navigate('/farmer/products')} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
          </div>

          {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Product Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" placeholder="e.g., Red Onion, Fresh Tomato" />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
                <option value="">Select category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Quantity *</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required step="0.01" className="w-full px-4 py-2 border rounded-lg" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Unit *</label>
                <select name="unit" value={formData.unit} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                  {units.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Price per Unit (ETB) *</label>
              <input type="number" name="pricePerUnit" value={formData.pricePerUnit} onChange={handleChange} required step="0.01" className="w-full px-4 py-2 border rounded-lg" placeholder="0.00" />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Harvest Date</label>
              <input type="date" name="harvestDate" value={formData.harvestDate} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
            </div>

            <div className="flex items-center space-x-3">
              <input type="checkbox" name="isUrgent" checked={formData.isUrgent} onChange={handleChange} className="w-5 h-5 text-red-600 rounded" />
              <label className="text-gray-700 font-semibold">Mark as Urgent (Sell quickly)</label>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Description (Optional)</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-4 py-2 border rounded-lg" placeholder="Describe your product quality, freshness, etc." />
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={() => navigate('/farmer/products')} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">Cancel</button>
              <button type="submit" disabled={loading} className="flex-1 bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50">{loading ? 'Adding...' : 'Add Product'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;