// src/services/api.js - Add these farmer-specific methods

const API_URL = 'http://localhost:3000/api';

export const api = {
  // Auth endpoints (existing)
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    return data;
  },
  
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  getUserRole: () => {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user).role;
    }
    return null;
  },
  
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Farmer Product Endpoints
  getFarmerProducts: async () => {
    const token = api.getToken();
    const response = await fetch(`${API_URL}/farmer/products`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch products');
    }
    return data;
  },
  
  addProduct: async (productData) => {
    const token = api.getToken();
    const response = await fetch(`${API_URL}/farmer/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add product');
    }
    return data;
  },

  getProductById: async (productId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/api/farmer/products/${productId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch product');
    }
    return data;
  },

  updateProduct: async (productId, productData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/api/farmer/products/${productId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update product');
    }
    return data;
  },
  
  deleteProduct: async (productId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/farmer/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete product');
    }
    return data;
  },
  
  // Farmer Order Endpoints
  getFarmerOrders: async () => {
    const token = api.getToken();
    const response = await fetch(`${API_URL}/farmer/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch orders');
    }
    return data;
  },
  
  getFarmerOrderById: async (orderId) => {
    const token = api.getToken();
    const response = await fetch(`${API_URL}/farmer/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch order');
    }
    return data;
  },
  
  updateOrderStatus: async (orderId, status) => {
    const token = api.getToken();
    const response = await fetch(`${API_URL}/farmer/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update order status');
    }
    return data;
  },
  
  // Retailer Endpoints (to be added later)
  getFarmers: async () => {
    const token = api.getToken();
    const response = await fetch(`${API_URL}/retailer/farmers`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch farmers');
    }
    return data;
  },
  
  getFarmerById: async (farmerId) => {
    const token = api.getToken();
    const response = await fetch(`${API_URL}/retailer/farmers/${farmerId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch farmer');
    }
    return data;
  },

  // src/services/api.js - Add these methods

  // Get current user profile
  getProfile: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }
    return data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }
    
    // Update localStorage with new user data
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(passwordData),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to change password');
    }
    return data;
  },

  // Upload profile picture
  uploadProfilePicture: async (formData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/auth/upload-photo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData, // Don't set Content-Type, let browser set it with boundary
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload photo');
    }
    
    // Update localStorage with new photo URL
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  // Get retailer's orders
  getRetailerOrders: async () => {
    const token = api.getToken();
    const response = await fetch(`${API_URL}/retailer/orders`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || JSON.stringify(data) || 'Failed to fetch orders');
    return data;
  },

  // Create order (retailer placing a request to a farmer)
  createOrder: async (orderPayload) => {
    const token = api.getToken();
    const response = await fetch(`${API_URL}/retailer/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderPayload),
    });
    const data = await response.json();
    if (!response.ok) {
      // surface server message when available
      throw new Error(data.message || JSON.stringify(data) || 'Failed to create order');
    }
    return data;
  },

  adminGetUsers: async () => {
  const token = api.getToken();
  const response = await fetch(`${API_URL}/admin/users`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch users');
  return data;
},

  // Get pending users
  adminGetPendingUsers: async () => {
    const token = api.getToken();
    // server stores status as PENDING_VERIFICATION
    const response = await fetch(`${API_URL}/admin/users?status=PENDING_VERIFICATION`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch pending users');
    return data;
  },

  // Approve user
  adminApproveUser: async (userId) => {
    const token = api.getToken();
    const response = await fetch(`${API_URL}/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      // server expects uppercase enum
      body: JSON.stringify({ status: 'ACTIVE' }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to approve user');
    return data;
  },

  // Reject user
  adminRejectUser: async (userId, reason) => {
    const token = api.getToken();
    const response = await fetch(`${API_URL}/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status: 'REJECTED', rejectionReason: reason }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to reject user');
    return data;
  },

  // Update user status (suspend/activate)
  adminUpdateUserStatus: async (userId, status) => {
    const token = api.getToken();
    const response = await fetch(`${API_URL}/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      // ensure server enum casing
      body: JSON.stringify({ status: String(status).toUpperCase() }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update user status');
    return data;
  },

  // Get all products (for moderation)
  adminGetProducts: async () => {
    const token = api.getToken();
    const response = await fetch(`${API_URL}/admin/products`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch products');
    return data;
  },

    // Get all orders
    adminGetOrders: async () => {
      const token = api.getToken();
      const response = await fetch(`${API_URL}/admin/orders`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch orders');
      return data;
    },

  // end of api object
};

