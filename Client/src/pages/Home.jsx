import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Problem First, Then Solution */}
      <section className="bg-gradient-to-br from-green-700 to-green-900 text-white">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-block bg-green-500/20 backdrop-blur-sm rounded-full px-4 py-1 mb-6">
              <span className="text-sm font-medium">Ethiopia's First Direct Farm-to-Market Platform</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Farmers Earn More. 
              <span className="text-green-300"> Retailers Pay Less.</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-4 text-gray-200">
              Eliminate 2-4 layers of middlemen taking 15-30% margins
            </p>
            
            <p className="text-lg mb-10 text-gray-300 max-w-3xl mx-auto">
              Directly connect farmers with retailers in Addis Ababa and Adama. Fair prices, transparent transactions, no predatory intermediaries.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register/farmer" 
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-8 py-4 rounded-lg transition duration-300 transform hover:scale-105 text-lg"
              >
                Join as Farmer → 
              </Link>
              <Link 
                to="/register/retailer" 
                className="bg-transparent border-2 border-white hover:bg-white hover:text-green-700 text-white font-semibold px-8 py-4 rounded-lg transition duration-300 text-lg"
              >
                Join as Retailer →
              </Link>
            </div>
            
            <p className="text-sm text-gray-400 mt-6">
              ✓ Admin-verified users only ✓ Free to join ✓ No commission fees
            </p>
          </div>
        </div>
      </section>

      {/* Problem Statement Section - The Current Reality */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              The Reality for Ethiopian Farmers Today
            </h2>
            <p className="text-lg text-gray-600">
              Middlemen are taking advantage of both farmers and retailers
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-red-50 rounded-xl p-8 border-l-4 border-red-500">
              <div className="text-4xl mb-3">🌾</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">For Farmers</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>Earn 40-60% less than market rate</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>No market visibility or bargaining power</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>Forced to sell at whatever price offered</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>2-4 layers of middlemen taking cuts</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-orange-50 rounded-xl p-8 border-l-4 border-orange-500">
              <div className="text-4xl mb-3">🏪</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">For Retailers</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">✗</span>
                  <span>Pay 30-50% above direct farm prices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">✗</span>
                  <span>Inconsistent quality and supply</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">✗</span>
                  <span>No direct discovery of farmers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">✗</span>
                  <span>Fragmented supply chain</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section - What We Built */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              The Farmer-Market Bridge Solution
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Direct connection. Zero middlemen. Fair prices for everyone.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">👨‍🌾</span>
              </div>
              <h3 className="text-xl font-bold mb-3">For Farmers</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ List products with your price</li>
                <li>✓ Get direct retailer interest</li>
                <li>✓ Transparent market visibility</li>
                <li>✓ Admin-verified legitimacy</li>
                <li>✓ Free onboarding assistance</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded-full text-xs">
                Direct Match
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Direct Bridge</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ No middlemen layers</li>
                <li>✓ 15-30% margin eliminated</li>
                <li>✓ Admin quality verification</li>
                <li>✓ Fair price discovery</li>
                <li>✓ Trusted communication</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🏪</span>
              </div>
              <h3 className="text-xl font-bold mb-3">For Retailers</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Browse verified farmers</li>
                <li>✓ Filter by product/location</li>
                <li>✓ Direct farmer contact</li>
                <li>✓ Consistent quality supply</li>
                <li>✓ Lower purchase prices</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            How the Bridge Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Register & Verify</h3>
              <p className="text-gray-600">Farmer or retailer signs up. Admin verifies ID and business license within 24 hours</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">List & Discover</h3>
              <p className="text-gray-600">Farmers list products with prices. Retailers browse and filter by crop/location</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Connect & Deal</h3>
              <p className="text-gray-600">Retailers express interest. Farmers accept. Deal made directly outside platform</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-500 text-sm max-w-2xl mx-auto">
              <strong>Note:</strong> V1 focuses on connection and discovery. Payment and logistics will be added in future versions.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section - Detailed */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            Platform Features
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Everything you need to connect, trade, and grow
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <div className="text-green-600 text-2xl mb-2">✓</div>
              <h3 className="font-semibold mb-1">Admin Verification</h3>
              <p className="text-sm text-gray-600">Every user verified for trust and legitimacy</p>
            </div>
            
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <div className="text-green-600 text-2xl mb-2">✓</div>
              <h3 className="font-semibold mb-1">Product Listings</h3>
              <p className="text-sm text-gray-600">Farmers list products with photos, quantity, price</p>
            </div>
            
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <div className="text-green-600 text-2xl mb-2">✓</div>
              <h3 className="font-semibold mb-1">Retailer Discovery</h3>
              <p className="text-sm text-gray-600">Browse farmers and filter by product/location</p>
            </div>
            
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <div className="text-green-600 text-2xl mb-2">✓</div>
              <h3 className="font-semibold mb-1">Direct Communication</h3>
              <p className="text-sm text-gray-600">In-app matching and phone number sharing</p>
            </div>
            
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <div className="text-green-600 text-2xl mb-2">✓</div>
              <h3 className="font-semibold mb-1">Location-Based Filtering</h3>
              <p className="text-sm text-gray-600">Find farmers in Addis Ababa and Adama</p>
            </div>
            
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <div className="text-green-600 text-2xl mb-2">✓</div>
              <h3 className="font-semibold mb-1">Admin Dashboard</h3>
              <p className="text-sm text-gray-600">Monitor platform, resolve disputes, generate reports</p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Regions Section */}
      <section className="py-16 bg-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Launching in Addis Ababa & Adama</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connecting farmers from surrounding areas with urban retailers
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="bg-green-600/50 rounded-lg px-6 py-3">
              <span className="font-semibold">📍 Addis Ababa</span>
            </div>
            <div className="bg-green-600/50 rounded-lg px-6 py-3">
              <span className="font-semibold">📍 Adama</span>
            </div>
          </div>
          <p className="text-sm text-green-200 mt-6">
            More regions coming in future versions
          </p>
        </div>
      </section>

      {/* Impact Preview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              The Impact We're Making
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              By eliminating middlemen, everyone benefits
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-green-50 rounded-xl p-6">
                <div className="text-3xl font-bold text-green-700 mb-2">+40-60%</div>
                <p className="text-gray-700">More income for farmers</p>
                <div className="text-sm text-gray-500 mt-2">By selling directly to retailers</div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6">
                <div className="text-3xl font-bold text-green-700 mb-2">-30-50%</div>
                <p className="text-gray-700">Lower costs for retailers</p>
                <div className="text-sm text-gray-500 mt-2">By cutting out middlemen</div>
              </div>
            </div>
            
            <div className="mt-8 text-sm text-gray-500">
              *Based on eliminating 2-4 layers of intermediaries taking 15-30% margins each
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Join the Bridge?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Whether you're a farmer looking for fair prices or a retailer seeking direct supply
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register/farmer" 
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-8 py-4 rounded-lg transition duration-300 text-lg"
            >
              Register as Farmer →
            </Link>
            <Link 
              to="/register/retailer" 
              className="bg-transparent border-2 border-white hover:bg-white hover:text-green-700 text-white font-semibold px-8 py-4 rounded-lg transition duration-300 text-lg"
            >
              Register as Retailer →
            </Link>
          </div>
          <p className="text-sm text-green-200 mt-6">
            Free to join. Admin verification within 24 hours. No commission fees.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;