// src/pages/About.jsx
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-700 to-green-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Farmer Bridge</h1>
          <p className="text-xl max-w-2xl mx-auto">Connecting Ethiopian farmers directly with retailers, eliminating middlemen for fair prices and better livelihoods.</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <div className="w-20 h-1 bg-green-600 mx-auto"></div>
          </div>
          <p className="text-lg text-gray-700 text-center leading-relaxed">
            To empower Ethiopian farmers by providing direct access to markets, 
            ensuring fair prices for their produce, and creating a transparent, 
            efficient supply chain that benefits both farmers and retailers.
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">The Problem We're Solving</h2>
            <div className="w-20 h-1 bg-green-600 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-4xl mb-3">🌾</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">For Farmers</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Earn 40-60% less than market rate</li>
                <li>• No market visibility or bargaining power</li>
                <li>• Forced to accept whatever price offered</li>
                <li>• 2-4 layers of middlemen taking cuts</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-4xl mb-3">🏪</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">For Retailers</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Pay 30-50% above direct farm prices</li>
                <li>• Inconsistent quality and supply</li>
                <li>• No direct discovery of farmers</li>
                <li>• Fragmented supply chain</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Solution</h2>
            <div className="w-20 h-1 bg-green-600 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Direct Connection</h3>
              <p className="text-gray-600 text-sm">Farmers and retailers connect directly, eliminating middlemen</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Fair Pricing</h3>
              <p className="text-gray-600 text-sm">Transparent pricing ensures fair deals for both parties</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Trust & Safety</h3>
              <p className="text-gray-600 text-sm">Admin verification ensures only legitimate users on platform</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Meet the Team</h2>
            <div className="w-20 h-1 bg-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">We're dedicated to transforming Ethiopian agriculture</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-5xl mb-3">👨‍💻</div>
              <h3 className="font-bold text-lg">Kidus Yosef</h3>
              <p className="text-gray-500 text-sm">Product Manager</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-5xl mb-3">👨‍💻</div>
              <h3 className="font-bold text-lg">Nahom Ambachew</h3>
              <p className="text-gray-500 text-sm">Backend Developer</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-5xl mb-3">👨‍💻</div>
              <h3 className="font-bold text-lg">Nahom Biruk</h3>
              <p className="text-gray-500 text-sm">Frontend Developer</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-5xl mb-3">👨‍💻</div>
              <h3 className="font-bold text-lg">Nebil Sufiyan</h3>
              <p className="text-gray-500 text-sm">Full Stack Developer</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-5xl mb-3">👨‍💻</div>
              <h3 className="font-bold text-lg">Tesfamichael Ephrem</h3>
              <p className="text-gray-500 text-sm">Database Developer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Our Impact So Far</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <p>Farmers Registered</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">20+</div>
              <p>Retailers Onboarded</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">₿0</div>
              <p>Middlemen Eliminated</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Join Us?</h2>
          <p className="text-lg text-gray-600 mb-8">Whether you're a farmer or retailer, we're here to help you succeed.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register/farmer" className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
              Join as Farmer
            </Link>
            <Link to="/register/retailer" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Join as Retailer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;