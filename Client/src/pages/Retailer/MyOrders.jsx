// src/pages/retailer/MyOrders.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

const MyOrders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.getRetailerOrders();
      setOrders(response.data || response || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => fetchOrders(), 0);
    return () => clearTimeout(id);
  }, []);

  const getStatusBadge = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'ACCEPTED': 'bg-blue-100 text-blue-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'DELIVERED': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredOrders = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['ALL', 'PENDING', 'ACCEPTED', 'DELIVERED', 'REJECTED'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg transition ${
                filter === status ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status === 'ALL' ? 'All Orders' : status}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Found</h3>
            <p className="text-gray-600">Browse farmers and place your first order!</p>
            <Link to="/retailer/browse" className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Browse Farmers →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-wrap justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order #{order._id?.slice(-8)}</p>
                    <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="border-t border-b py-4 my-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Farmer</p>
                      <p className="font-semibold">{order.farmerName || 'Farmer'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Product</p>
                      <p className="font-semibold">{order.productName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Quantity</p>
                      <p className="font-semibold">{order.quantity} {order.unit || 'kg'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="font-semibold text-green-600">ETB {(Number(order.totalPrice) || (order.items && order.items[0] && Number(order.items[0].totalPrice)) || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {order.status === 'PENDING' && (
                  <p className="text-sm text-yellow-600">Waiting for farmer to respond to your request...</p>
                )}
                {order.status === 'ACCEPTED' && (
                  <p className="text-sm text-blue-600">Your order has been accepted! The farmer will prepare your produce.</p>
                )}
                {order.status === 'DELIVERED' && (
                  <p className="text-sm text-green-600">Order completed! Thank you for buying from local farmers.</p>
                )}
                {order.status === 'REJECTED' && (
                  <p className="text-sm text-red-600">This order was declined by the farmer.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;