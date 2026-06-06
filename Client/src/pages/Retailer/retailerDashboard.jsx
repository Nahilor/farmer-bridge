// src/pages/retailer/RetailerDashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

const RetailerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalSpent: 0,
    savedFarmers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentFarmers, setRecentFarmers] = useState([]);
  const [user, setUser] = useState(null);
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Get user info
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      // Fetch orders
      let orders = [];
      try {
        const ordersResponse = await api.getRetailerOrders();
        orders = ordersResponse.data || ordersResponse || [];
      } catch (err) {
        console.error('Error fetching orders:', err);
      }

      // Fetch farmers
      let farmers = [];
      try {
        const farmersResponse = await api.getFarmers();
        farmers = farmersResponse.data || farmersResponse || [];
      } catch (err) {
        console.error('Error fetching farmers:', err);
      }

      // Calculate stats
      const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
      const deliveredOrders = orders.filter(o => o.status === 'DELIVERED').length;
      const totalSpent = orders
        .filter(o => o.status === 'DELIVERED')
        .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

      setStats({
        totalOrders: orders.length,
        pendingOrders: pendingOrders,
        deliveredOrders: deliveredOrders,
        totalSpent: totalSpent,
        savedFarmers: 0 // Will implement saved farmers feature
      });

      setRecentOrders(orders.slice(0, 5));
      setRecentFarmers(farmers.slice(0, 4));

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => fetchDashboardData(), 0);
    return () => clearTimeout(id);
  }, []);

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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.firstName || user?.businessName || 'Retailer'}! 🏪
          </h1>
          <p className="text-gray-600 mt-1">Find fresh produce directly from local farmers.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
              </div>
              <div className="text-3xl">📦</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Orders</p>
                <p className="text-3xl font-bold text-gray-800">{stats.pendingOrders}</p>
              </div>
              <div className="text-3xl">⏳</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Delivered</p>
                <p className="text-3xl font-bold text-gray-800">{stats.deliveredOrders}</p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Spent</p>
                <p className="text-3xl font-bold text-purple-600">ETB {stats.totalSpent.toLocaleString()}</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-sm p-6 text-white">
            <h3 className="text-xl font-bold mb-2">Find Farmers</h3>
            <p className="text-sm mb-4">Browse and discover local farmers near you</p>
            <Link 
              to="/retailer/browse"
              className="inline-block bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Browse Farmers →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Quick Tips</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>✓ Browse farmers by product or location</li>
              <li>✓ Contact farmers directly for orders</li>
              <li>✓ Track all your orders in one place</li>
            </ul>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
              <Link to="/retailer/orders" className="text-blue-600 hover:underline text-sm">
                View All →
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No orders yet. Start browsing farmers to place orders!
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Farmer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">#{order._id?.slice(-6)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order.farmerName || 'Farmer'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order.productName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">ETB {order.totalPrice?.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status || 'PENDING'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link to={`/retailer/orders/${order._id}`} className="text-blue-600 hover:text-blue-800 text-sm">
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Featured Farmers */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Farmers Near You</h2>
              <Link to="/retailer/browse" className="text-blue-600 hover:underline text-sm">
                View All →
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
            {recentFarmers.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                Loading farmers...
              </div>
            ) : (
              recentFarmers.map((farmer) => (
                <div key={farmer._id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="text-center">
                    <div className="text-4xl mb-2">👨‍🌾</div>
                    <h3 className="font-semibold text-gray-800">{farmer.name || farmer.firstName} {farmer.lastName}</h3>
                    <p className="text-sm text-gray-500">{farmer.location?.region || 'Ethiopia'}</p>
                    <p className="text-xs text-gray-400 mt-1">{farmer.products?.length || 0} products</p>
                    <Link 
                      to={`/retailer/farmer/${farmer._id}`}
                      className="inline-block mt-3 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View Profile →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetailerDashboard;