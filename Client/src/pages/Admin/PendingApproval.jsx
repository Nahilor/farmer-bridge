// src/pages/admin/PendingApprovals.jsx
import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const PendingApprovals = () => {
  const [loading, setLoading] = useState(true);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const response = await api.adminGetPendingUsers();
      setPendingUsers(response.data || response || []);
    } catch (err) {
      console.error('Error fetching pending users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => fetchPendingUsers(), 0);
    return () => clearTimeout(id);
  }, []);

  const handleApprove = async (userId) => {
    try {
      await api.adminApproveUser(userId);
      setPendingUsers(pendingUsers.filter(u => u._id !== userId));
      alert('User approved successfully!');
    } catch (err) {
      console.error('Error approving user:', err);
      alert('Failed to approve user');
    }
  };

  const handleReject = async () => {
    if (!selectedUser) return;
    
    try {
      await api.adminRejectUser(selectedUser._id, rejectionReason);
      setPendingUsers(pendingUsers.filter(u => u._id !== selectedUser._id));
      setShowRejectModal(false);
      setSelectedUser(null);
      setRejectionReason('');
      alert('User rejected successfully');
    } catch (err) {
      console.error('Error rejecting user:', err);
      alert('Failed to reject user');
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Pending Approvals</h1>

        {pendingUsers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Pending Approvals</h3>
            <p className="text-gray-600">All users have been reviewed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingUsers.map((user) => (
              <div key={user._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {user.name || user.firstName} {user.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">{user.role}</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <p><span className="font-medium">Phone:</span> {user.phone}</p>
                    <p><span className="font-medium">Email:</span> {user.email || 'Not provided'}</p>
                    <p><span className="font-medium">Location:</span> {user.location?.region || 'Not specified'}</p>
                    {String(user.role || '').toUpperCase() === 'FARMER' && (
                      <>
                        <p><span className="font-medium">FAN ID:</span> {user.verificationDocs?.idNumber || user.fanId || 'Not provided'}</p>
                        <p><span className="font-medium">Farm Size:</span> {user.farmDetails?.farmSize || 'Not specified'}</p>
                      </>
                    )}
                    {String(user.role || '').toUpperCase() === 'RETAILER' && (
                      <>
                        <p><span className="font-medium">Business Name:</span> {user.businessName || user.name}</p>
                        <p><span className="font-medium">License Number:</span> {user.verificationDocs?.licenseNumber || 'Not provided'}</p>
                      </>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => viewUserDetails(user)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      View Details
                    </button>
                    <button
                          onClick={() => handleApprove(user._id)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowRejectModal(true);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && !showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg mx-4 w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">User Details</h3>
              <button onClick={() => setSelectedUser(null)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            
            <div className="space-y-3">
              <div className="border-b pb-2">
                <p className="text-xs text-gray-500">Full Name</p>
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
              {selectedUser.role === 'FARMER' && (
                <>
                  <div className="border-b pb-2">
                    <p className="text-xs text-gray-500">FAN ID</p>
                    <p className="font-semibold">{selectedUser.verificationDocs?.idNumber || selectedUser.fanId || 'Not provided'}</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="text-xs text-gray-500">Farm Size</p>
                    <p className="font-semibold">{selectedUser.farmDetails?.farmSize || 'Not specified'}</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="text-xs text-gray-500">Products</p>
                    <p className="font-semibold">{selectedUser.farmDetails?.products?.join(', ') || selectedUser.products?.join(', ') || 'Not specified'}</p>
                  </div>
                </>
              )}
              {selectedUser.role === 'RETAILER' && (
                <>
                  <div className="border-b pb-2">
                    <p className="text-xs text-gray-500">Business Name</p>
                    <p className="font-semibold">{selectedUser.businessName || selectedUser.name}</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="text-xs text-gray-500">License Number</p>
                    <p className="font-semibold">{selectedUser.verificationDocs?.licenseNumber || 'Not provided'}</p>
                  </div>
                </>
              )}
              <div className="border-b pb-2">
                <p className="text-xs text-gray-500">Registered On</p>
                <p className="font-semibold">{new Date(selectedUser.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t">
              <button onClick={() => setSelectedUser(null)} className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                Close
              </button>
              <button onClick={() => handleApprove(selectedUser._id)} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Approve
              </button>
              <button onClick={() => setShowRejectModal(true)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-bold mb-3">Reject User</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to reject <strong>{selectedUser.name || selectedUser.firstName} {selectedUser.lastName}</strong>?
            </p>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Reason for rejection</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows="3"
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Explain why this user is being rejected..."
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowRejectModal(false)} className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                Cancel
              </button>
              <button onClick={handleReject} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;