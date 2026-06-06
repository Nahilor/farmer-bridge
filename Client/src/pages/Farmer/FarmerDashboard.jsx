// src/pages/farmer/FarmerDashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

const FarmerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);  // ✅ ADDED
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalEarnings: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [user, setUser] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      // Get user info from localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      // Fetch products - with error handling
      let products = [];
      try {
        const productsResponse = await api.getFarmerProducts();
        products = productsResponse.data || productsResponse || [];
        console.log('Products loaded:', products.length);
      } catch (err) {
        console.error('Error fetching products:', err);
        // Don't show error to user for missing products, just show empty state
      }
      
      // Fetch orders - with error handling
      let orders = [];
      try {
        const ordersResponse = await api.getFarmerOrders();
        orders = ordersResponse.data || ordersResponse || [];
        console.log('Orders loaded:', orders.length);
      } catch (err) {
        console.error('Error fetching orders:', err);
        // Don't show error to user for missing orders, just show empty state
      }

      // Calculate stats
      const activeProducts = products.filter(p => p.status === 'active' || !p.status).length;
      const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
      const completedOrders = orders.filter(o => o.status === 'DELIVERED').length;
      const getOrderTotal = (o) => {
        if (o.totalPrice) return Number(o.totalPrice) || 0;
        if (Array.isArray(o.items) && o.items.length) {
          return o.items.reduce((s, it) => s + (Number(it.totalPrice) || (Number(it.quantity) * (Number(it.pricePerUnit) || 0)) || 0), 0);
        }
        return 0;
      };

      const totalEarnings = orders
        .filter(o => o.status === 'DELIVERED')
        .reduce((sum, o) => sum + getOrderTotal(o), 0);

      setStats({
        totalProducts: products.length,
        activeProducts: activeProducts,
        totalOrders: orders.length,
        pendingOrders: pendingOrders,
        completedOrders: completedOrders,
        totalEarnings: totalEarnings
      });

      // Set recent items (last 5)
      setRecentOrders(orders.slice(0, 5));
      setRecentProducts(products.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ ADDED: Handle delete product
  const handleDeleteProduct = async (productId) => {
    try {
      await api.deleteProduct(productId);
      // Refresh the data after deletion
      fetchDashboardData();
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product');
    }
  };

  useEffect(() => {
    const id = setTimeout(() => {
      fetchDashboardData();
    }, 0);
    return () => clearTimeout(id);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
            <button 
              onClick={fetchDashboardData}
              className="ml-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.firstName || user?.name || 'Farmer'}! 👨‍🌾
          </h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your farm today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Products</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalProducts}</p>
              </div>
              <div className="text-3xl">🌾</div>
            </div>
            <div className="mt-2">
              <span className="text-green-600 text-sm">{stats.activeProducts} active</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
              </div>
              <div className="text-3xl">📦</div>
            </div>
            <div className="mt-2">
              <span className="text-yellow-600 text-sm">{stats.pendingOrders} pending</span>
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
            <div className="mt-2">
              <Link to="/farmer/orders?status=PENDING" className="text-blue-600 text-sm hover:underline">
                View all →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Earnings</p>
                <p className="text-3xl font-bold text-green-600">ETB {stats.totalEarnings.toLocaleString()}</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-sm p-6 text-white">
            <h3 className="text-xl font-bold mb-2">Quick Actions</h3>
            <div className="flex flex-wrap gap-4 mt-4">
              <Link 
                to="/farmer/AddProduct"
                className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                + Add New Product
              </Link>
              <Link 
                to="/farmer/MyProducts"
                className="bg-transparent border border-white px-4 py-2 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition"
              >
                View All Products
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Need Help?</h3>
            <p className="text-gray-600 text-sm mb-4">
              Having trouble with your listings or orders?
            </p>
            <Link 
              to="/help"
              className="text-green-600 hover:underline text-sm font-semibold"
            >
              Visit Help Center →
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
              <Link to="/farmer/orders" className="text-green-600 hover:underline text-sm">
                View All →
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No orders yet. When retailers place orders, they'll appear here.
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">#{order._id?.slice(-6)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order.productName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order.quantity} kg</td>
                      <td className="px-6 py-4 text-sm text-gray-900">ETB {(Number(order.totalPrice) || (order.items && order.items.length ? order.items.reduce((s,it)=> s + (Number(it.totalPrice) || (Number(it.quantity)*(Number(it.pricePerUnit)||0))||0),0) : 0)).toLocaleString()}</td>
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
                        <Link 
                          to={`/farmer/orders/${order._id}`}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
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

        {/* Recent Products */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Your Products</h2>
              <Link to="/farmer/AddProduct" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition">
                + Add Product
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {recentProducts.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                You haven't added any products yet. Click "Add Product" to get started.
              </div>
            ) : (
              recentProducts.map((product) => (
                <div key={product._id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.status || 'active'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Quantity: {product.quantity} {product.unit || 'kg'}</p>
                  <div className="mt-3 flex gap-3">
                    <Link 
                      to={`/farmer/products/edit/${product._id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </Link>
                    {/* ✅ FIXED: Delete button */}
                    <button 
                      onClick={() => setShowDeleteConfirm(product._id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ✅ ADDED: Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-bold mb-3">Confirm Delete</h3>
            <p className="text-gray-600 mb-5">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;