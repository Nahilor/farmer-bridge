// src/pages/Help.jsx
import { Link } from 'react-router-dom';

const Help = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Help Center</h1>
          
          {/* FAQ Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div className="border-b pb-3">
                <h3 className="font-semibold text-gray-800">How do I register as a farmer?</h3>
                <p className="text-gray-600 text-sm mt-1">Click "Join as Farmer" on the homepage, fill in your details, and submit. Admin will verify within 24 hours.</p>
              </div>
              
              <div className="border-b pb-3">
                <h3 className="font-semibold text-gray-800">How long does verification take?</h3>
                <p className="text-gray-600 text-sm mt-1">Admin reviews and verifies accounts within 24 hours. You'll receive an SMS notification when approved.</p>
              </div>
              
              <div className="border-b pb-3">
                <h3 className="font-semibold text-gray-800">How do I list my products?</h3>
                <p className="text-gray-600 text-sm mt-1">After logging in to your Farmer Dashboard, click "Add New Product" and fill in the product details.</p>
              </div>
              
              <div className="border-b pb-3">
                <h3 className="font-semibold text-gray-800">How do I contact a farmer?</h3>
                <p className="text-gray-600 text-sm mt-1">Retailers can browse farmers, view their profile, and express interest. Contact info is shared after matching.</p>
              </div>
              
              <div className="border-b pb-3">
                <h3 className="font-semibold text-gray-800">Is there a fee to use the platform?</h3>
                <p className="text-gray-600 text-sm mt-1">No, Farmer Bridge is completely free for both farmers and retailers. No commission fees.</p>
              </div>
            </div>
          </div>
          
          {/* Contact Support Section */}
          <div className="bg-green-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Still Need Help?</h2>
            <div className="space-y-3">
              <p className="flex items-center gap-2"><span className="text-xl">📞</span> Call us: <strong>+251 993 459 234</strong></p>
              <p className="flex items-center gap-2"><span className="text-xl">✉️</span> Email: <strong>info@farmerbridge.com</strong></p>
              <p className="flex items-center gap-2"><span className="text-xl">💬</span> WhatsApp: <strong>+251 993 459 234</strong></p>
              <p className="flex items-center gap-2"><span className="text-xl">📍</span> Office: <strong>Addis Ababa, Ethiopia</strong></p>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Response time: Within 24 hours on business days
            </p>
          </div>
          
          <div className="mt-6 text-center">
            <Link to="/" className="text-green-600 hover:underline">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;