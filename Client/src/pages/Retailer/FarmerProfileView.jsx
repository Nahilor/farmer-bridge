// src/pages/retailer/FarmerProfileView.jsx
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';

const FarmerProfileView = () => {
  const { farmerId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState('');
  const [orderMessage, setOrderMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchFarmerData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.getFarmerById(farmerId);
      const farmerData = response.data || response;
      setFarmer(farmerData);
      setProducts(farmerData.products || farmerData.farmDetails?.products || []);
    } catch (err) {
      console.error('Error fetching farmer:', err);
    } finally {
      setLoading(false);
    }
  }, [farmerId]);

  useEffect(() => {
    const id = setTimeout(() => fetchFarmerData(), 0);
    return () => clearTimeout(id);
  }, [fetchFarmerData]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const q = Number(orderQuantity);
    if (!isFinite(q) || q <= 0) {
      alert('Please enter a valid quantity (number > 0)');
      return;
    }

    setSubmitting(true);
    try {
      // server expects { farmerId, items: [ { productName, quantity, ... } ] }
      await api.createOrder({
        farmerId: farmerId,
        items: [
          {
            productId: selectedProduct._id,
            productName: selectedProduct.name,
            quantity: q,
            unit: selectedProduct.unit,
            pricePerUnit: selectedProduct.pricePerUnit,
            totalPrice: q * (selectedProduct.pricePerUnit || 0),
            message: orderMessage,
          }
        ]
      });
      
      alert('Order placed successfully! The farmer will review your request.');
      setShowOrderModal(false);
      setSelectedProduct(null);
      setOrderQuantity('');
      setOrderMessage('');
    } catch (err) {
      console.error('Error placing order:', err);
      // err.message should include server-provided message where available
      alert(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Farmer not found</h1>
          <Link to="/retailer/browse" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back
        </button>

        {/* Farmer Profile Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="text-6xl text-center md:text-left">👨‍🌾</div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">{farmer.name || farmer.firstName} {farmer.lastName}</h1>
              <p className="text-gray-600 mt-1">{farmer.location?.region}, {farmer.location?.zone}</p>
              <p className="text-gray-500 text-sm mt-2">{farmer.farmDetails?.farmSize || 'Farm size not specified'}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Verified Farmer</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Member since {new Date(farmer.createdAt).getFullYear()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Available Products</h2>
          
          {products.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No products listed yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product) => (
                <div key={product._id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.isUrgent ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {product.isUrgent ? 'Urgent' : 'Available'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Quantity: {product.quantity} {product.unit}</p>
                  {product.description && <p className="text-xs text-gray-500 mt-2">{product.description}</p>}
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowOrderModal(true);
                    }}
                    className="mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Request Order
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Modal */}
      {showOrderModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4 w-full">
            <h3 className="text-lg font-bold mb-3">Request Order</h3>
            <p className="text-gray-600 mb-4">Ordering: <strong>{selectedProduct.name}</strong> from {farmer.name || farmer.firstName}</p>
            
            <form onSubmit={handlePlaceOrder}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Quantity ({selectedProduct.unit}) *</label>
                <input
                  type="number"
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(e.target.value)}
                  required
                  step="1"
                  min="1"
                  max={selectedProduct.quantity}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder={`Max ${selectedProduct.quantity} ${selectedProduct.unit}`}
                />
                <p className="text-xs text-gray-500 mt-1">Max available: {selectedProduct.quantity} {selectedProduct.unit}</p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Total Price</label>
                <p className="text-lg font-bold text-green-600">
                  ETB {(parseFloat(orderQuantity) * selectedProduct.pricePerUnit || 0).toLocaleString()}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Message (Optional)</label>
                <textarea
                  value={orderMessage}
                  onChange={(e) => setOrderMessage(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Add any special instructions or delivery preferences..."
                />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setShowOrderModal(false)} className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerProfileView;