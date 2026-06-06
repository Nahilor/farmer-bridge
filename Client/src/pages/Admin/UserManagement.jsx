// src/pages/admin/UserManagement.jsx
import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const UserManagement = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.adminGetUsers();
      setUsers(response.data || response || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => fetchUsers(), 0);
    return () => clearTimeout(id);
  }, []);

  const handleSuspendUser = async (userId) => {
    if (!confirm('Are you sure you want to suspend this user?')) return;
    try {
      await api.adminUpdateUserStatus(userId, 'suspended');
      fetchUsers();
      alert('User suspended successfully');
    } catch (err) {
      console.error('Error suspending user:', err);
      alert('Failed to suspend user');
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      await api.adminUpdateUserStatus(userId, 'active');
      fetchUsers();
      alert('User activated successfully');
    } catch (err) {
      console.error('Error activating user:', err);
      alert('Failed to activate user');
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter !== 'ALL' && user.role !== filter) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (user.name || user.firstName)?.toLowerCase().includes(searchLower) ||
             user.phone?.includes(searchLower) ||
             user.email?.toLowerCase().includes(searchLower);
    }
    return true;
  });

  const getStatusBadge = (status) => {
    const s = String(status || '').toUpperCase();
    const colors = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'PENDING_VERIFICATION': 'bg-yellow-100 text-yellow-800',
      'SUSPENDED': 'bg-red-100 text-red-800',
      'REJECTED': 'bg-gray-100 text-gray-800'
    };
    return colors[s] || 'bg-gray-100 text-gray-800';
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">User Management</h1>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, phone, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              {['ALL', 'FARMER', 'RETAILER', 'ADMIN'].map(role => (
                <button
                  key={role}
                  onClick={() => setFilter(role)}
                  className={`px-4 py-2 rounded-lg transition ${
                    filter === role ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {role === 'ALL' ? 'All' : role}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{user.name || user.firstName} {user.lastName}</div>
                      {user.businessName && <div className="text-xs text-gray-500">{user.businessName}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'FARMER' ? 'bg-green-100 text-green-800' : 
                        user.role === 'RETAILER' ? 'bg-blue-100 text-blue-800' : 
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.email || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.location?.region || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => setSelectedUser(user)} className="text-blue-600 hover:text-blue-800 text-sm">
                          View
                        </button>
                        {String(user.status || '').toUpperCase() === 'ACTIVE' ? (
                          <button onClick={() => handleSuspendUser(user._id)} className="text-red-600 hover:text-red-800 text-sm">
                            Suspend
                          </button>
                        ) : String(user.status || '').toUpperCase() === 'SUSPENDED' ? (
                          <button onClick={() => handleActivateUser(user._id)} className="text-green-600 hover:text-green-800 text-sm">
                            Activate
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg mx-4 w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">User Details</h3>
              <button onClick={() => setSelectedUser(null)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            
            <div className="space-y-3">
              <div className="border-b pb-2">
                <p className="text-xs text-gray-500">Name</p>
                <p className="font-semibold">{selectedUser.name || selectedUser.firstName} {selectedUser.lastName}</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-xs text-gray-500">Role</p>
                <p className="font-semibold">{selectedUser.role}</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-xs text-gray-500">Phone</p>
                <p className="font-semibold">{selectedUser.phone}</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-semibold">{selectedUser.email || 'Not provided'}</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-xs text-gray-500">Address</p>
                <p className="font-semibold">{selectedUser.address || 'Not provided'}</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-xs text-gray-500">Status</p>
                <p className="font-semibold capitalize">{selectedUser.status}</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-xs text-gray-500">Registered On</p>
                <p className="font-semibold">{new Date(selectedUser.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t">
              <button onClick={() => setSelectedUser(null)} className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                Close
              </button>
              {selectedUser.status === 'active' ? (
                <button onClick={() => handleSuspendUser(selectedUser._id)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Suspend User
                </button>
              ) : selectedUser.status === 'suspended' ? (
                <button onClick={() => handleActivateUser(selectedUser._id)} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Activate User
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;