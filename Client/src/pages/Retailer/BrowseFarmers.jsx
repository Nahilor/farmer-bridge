// src/pages/retailer/BrowseFarmers.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

const BrowseFarmers = () => {
  const [loading, setLoading] = useState(true);
  const [farmers, setFarmers] = useState([]);
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

  const products = ['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Meat', 'Eggs', 'Coffee'];
  const regions = ['All', 'Addis Ababa', 'Oromia', 'Amhara', 'Tigray', 'Sidama'];

  const fetchFarmers = async () => {
    setLoading(true);
    try {
      const response = await api.getFarmers();
      const farmersList = response.data || response || [];
      setFarmers(farmersList);
      setFilteredFarmers(farmersList);
    } catch (err) {
      console.error('Error fetching farmers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => fetchFarmers(), 0);
    return () => clearTimeout(id);
  }, []);

  // Helper to normalize product names from different shapes
  const getProductNames = (farmer) => {
    if (!farmer) return [];
    if (Array.isArray(farmer.products) && farmer.products.length > 0) {
      return farmer.products
        .map(p => (typeof p === 'string' ? p : (p.name || p.productName || '')))
        .filter(Boolean);
    }
    if (Array.isArray(farmer.farmDetails?.products) && farmer.farmDetails.products.length > 0) {
      return farmer.farmDetails.products.map(p => (typeof p === 'string' ? p : (p.name || p.productName || ''))).filter(Boolean);
    }
    return [];
  };

  useEffect(() => {
    const id = setTimeout(() => {
      let filtered = [...farmers];

      if (searchTerm) {
        filtered = filtered.filter(farmer =>
          (farmer.name || farmer.firstName)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (farmer.location?.region || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (selectedProduct && selectedProduct !== 'All') {
        filtered = filtered.filter(farmer =>
          farmer.products?.includes(selectedProduct) ||
          farmer.farmDetails?.products?.includes(selectedProduct)
        );
      }

      if (selectedRegion && selectedRegion !== 'All') {
        filtered = filtered.filter(farmer =>
          farmer.location?.region === selectedRegion
        );
      }

      setFilteredFarmers(filtered);
    }, 0);

    return () => clearTimeout(id);
  }, [searchTerm, selectedProduct, selectedRegion, farmers]);

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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Find Local Farmers</h1>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {products.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-600 mb-4">Found {filteredFarmers.length} farmers</p>

        {/* Farmers Grid */}
        {filteredFarmers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">👨‍🌾</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Farmers Found</h3>
            <p className="text-gray-600">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFarmers.map((farmer) => (
              <div key={farmer._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-5xl">👨‍🌾</div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {farmer.name || farmer.firstName} {farmer.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">{farmer.location?.region || 'Location not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    {(() => {
                      const productNames = getProductNames(farmer);
                      return (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Products:</span> {productNames.length ? productNames.slice(0, 3).join(', ') : 'Not specified'}
                          {productNames.length > 3 && '...'}
                        </p>
                      );
                    })()}
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Farm Size:</span> {farmer.farmDetails?.farmSize || farmer.farmSize || 'Not specified'}
                    </p>
                  </div>

                  <Link
                    to={`/retailer/farmer/${farmer._id}`}
                    className="block text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseFarmers;