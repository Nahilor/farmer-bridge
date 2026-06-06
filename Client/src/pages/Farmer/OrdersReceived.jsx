// src/pages/farmer/OrdersReceived.jsx
import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { api } from '../../services/api';

const OrdersReceived = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.getFarmerOrders();
      setOrders(response.data || response || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => fetchOrders(), 0);
    return () => clearTimeout(id);
  }, []);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await api.updateOrderStatus(orderId, status);
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, status: status } : order
      ));
      setSelectedOrder(null);
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Failed to update order status');
    }
  };

  const filteredOrders = filter === 'ALL' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const getStatusBadge = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'ACCEPTED': 'bg-blue-100 text-blue-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'DELIVERED': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders Received</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['ALL', 'PENDING', 'ACCEPTED', 'DELIVERED', 'REJECTED'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg transition ${
                filter === status
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status === 'ALL' ? 'All Orders' : status}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Yet</h3>
            <p className="text-gray-600">When retailers place orders, they'll appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-wrap justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order #{order._id?.slice(-8)}</p>
                    <p className="text-sm text-gray-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="border-t border-b py-4 my-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Product</p>
                      <p className="font-semibold">{order.productName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Quantity</p>
                      <p className="font-semibold">{order.quantity} {order.unit || 'kg'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Price/Unit</p>
                      <p className="font-semibold">ETB {order.pricePerUnit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="font-semibold text-green-600">ETB {(Number(order.totalPrice) || (order.items && order.items.length ? order.items.reduce((s,it)=> s + (Number(it.totalPrice) || (Number(it.quantity)*(Number(it.pricePerUnit)||0))||0),0) : 0)).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Buyer: {order.retailerName || 'Retailer'}</p>
                    <p className="text-sm text-gray-500">Phone: {order.retailerPhone || 'Not provided'}</p>
                  </div>
                  {order.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'REJECTED')}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Accept Order
                      </button>
                    </div>
                  )}
                  {order.status === 'ACCEPTED' && (
                    <button
                      onClick={() => handleUpdateStatus(order._id, 'DELIVERED')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Mark as Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Accept Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-bold mb-3">Accept Order</h3>
            <p className="text-gray-600 mb-2">
              Accept order from {selectedOrder.retailerName || 'Retailer'}?
            </p>
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <p><strong>Product:</strong> {selectedOrder.productName || (selectedOrder.items && selectedOrder.items[0]?.productName)}</p>
              <p><strong>Quantity:</strong> {selectedOrder.quantity || (selectedOrder.items && selectedOrder.items[0]?.quantity)} {selectedOrder.unit || (selectedOrder.items && selectedOrder.items[0]?.unit) || ''}</p>
              <p><strong>Total Amount:</strong> ETB {(Number(selectedOrder.totalPrice) || (selectedOrder.items && selectedOrder.items[0] && Number(selectedOrder.items[0].totalPrice)) || 0).toLocaleString()}</p>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              The retailer will be notified once you accept.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedOrder._id, 'ACCEPTED')}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Accept Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersReceived;