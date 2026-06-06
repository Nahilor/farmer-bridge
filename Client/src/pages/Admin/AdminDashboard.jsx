// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalFarmers: 0,
    totalRetailers: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingFarmers: 0,
    pendingRetailers: 0,
    pendingProducts: 0,
    totalRevenue: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all users
      const usersResponse = await api.adminGetUsers();
      const users = usersResponse.data || usersResponse || [];
      
      const farmers = users.filter(u => String(u.role || '').toUpperCase() === 'FARMER');
      const retailers = users.filter(u => String(u.role || '').toUpperCase() === 'RETAILER');
      const pendingFarmers = users.filter(u => String(u.role || '').toUpperCase() === 'FARMER' && String(u.status || '').toUpperCase() === 'PENDING_VERIFICATION');
      const pendingRetailers = users.filter(u => String(u.role || '').toUpperCase() === 'RETAILER' && String(u.status || '').toUpperCase() === 'PENDING_VERIFICATION');

      // Fetch products
      let products = [];
      try {
        const productsResponse = await api.adminGetProducts();
        products = productsResponse.data || productsResponse || [];
      } catch (err) {
        console.error('Error fetching products:', err);
      }

      // Fetch orders
      let orders = [];
      try {
        const ordersResponse = await api.adminGetOrders();
        orders = ordersResponse.data || ordersResponse || [];
      } catch (err) {
        console.error('Error fetching orders:', err);
      }

      const totalRevenue = orders
        .filter(o => String(o.status || '').toUpperCase() === 'DELIVERED')
        .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

      setStats({
        totalFarmers: farmers.length,
        totalRetailers: retailers.length,
        totalProducts: products.length,
        totalOrders: orders.length,
        pendingFarmers: pendingFarmers.length,
        pendingRetailers: pendingRetailers.length,
        pendingProducts: products.filter(p => String(p.status || '').toUpperCase() === 'PENDING').length,
        totalRevenue: totalRevenue
      });

      setRecentUsers(users.slice(0, 5));
      setRecentOrders(orders.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage farmers, retailers, and platform activity.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Farmers</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalFarmers}</p>
              </div>
              <div className="text-3xl">👨‍🌾</div>
            </div>
            <div className="mt-2">
              <Link to="/admin/users?role=FARMER" className="text-blue-600 text-sm hover:underline">
                View all →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Retailers</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalRetailers}</p>
              </div>
              <div className="text-3xl">🏪</div>
            </div>
            <div className="mt-2">
              <Link to="/admin/users?role=RETAILER" className="text-purple-600 text-sm hover:underline">
                View all →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Approvals</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingFarmers + stats.pendingRetailers}</p>
              </div>
              <div className="text-3xl">⏳</div>
            </div>
            <div className="mt-2">
              <Link to="/admin/approvals" className="text-yellow-600 text-sm hover:underline">
                Review now →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">ETB {stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>
        </div>

        {/* Second Row Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Products</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalProducts}</p>
              </div>
              <div className="text-2xl">🌾</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
              </div>
              <div className="text-2xl">📦</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Products</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingProducts}</p>
              </div>
              <div className="text-2xl">⚠️</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/admin/approvals" className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-sm p-6 text-white hover:shadow-md transition">
            <h3 className="text-xl font-bold mb-2">Pending Approvals</h3>
            <p className="text-sm opacity-90">Review and verify new farmers & retailers</p>
            <p className="text-2xl font-bold mt-2">{stats.pendingFarmers + stats.pendingRetailers} pending</p>
          </Link>

          <Link to="/admin/users" className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white hover:shadow-md transition">
            <h3 className="text-xl font-bold mb-2">User Management</h3>
            <p className="text-sm opacity-90">Manage all platform users</p>
            <p className="text-2xl font-bold mt-2">{stats.totalFarmers + stats.totalRetailers} total</p>
          </Link>

          <Link to="/admin/reports" className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white hover:shadow-md transition">
            <h3 className="text-xl font-bold mb-2">Reports & Analytics</h3>
            <p className="text-sm opacity-90">View platform insights and export data</p>
            <p className="text-2xl font-bold mt-2">ETB {stats.totalRevenue.toLocaleString()}</p>
          </Link>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Recent Registrations</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{user.name || user.firstName} {user.lastName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'FARMER' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' :
                        user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Farmer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Retailer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">#{order._id?.slice(-6)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{order.farmerName || 'Farmer'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{order.retailerName || 'Retailer'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">ETB {order.totalPrice?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;