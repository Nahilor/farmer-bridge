// src/pages/Contact.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('http://localhost:3000/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setSuccess('Thank you for your message! We will get back to you within 24 hours.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        setError(data.message || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Contact form error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-700 to-green-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-2xl mx-auto">We'd love to hear from you. Reach out with any questions or feedback.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition">
              <div className="text-4xl mb-3">📍</div>
              <h3 className="font-bold text-lg mb-2">Visit Us</h3>
              <p className="text-gray-600">Addis Ababa, Ethiopia</p>
              <p className="text-gray-600">Bole Road, Dream Tower 3rd Floor</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition">
              <div className="text-4xl mb-3">📞</div>
              <h3 className="font-bold text-lg mb-2">Call Us</h3>
              <p className="text-gray-600">+251 993 459 234</p>
              <p className="text-gray-600">+251 911 121 314</p>
              <p className="text-sm text-gray-500 mt-2">Mon-Fri 9:00 AM - 5:00 PM</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition">
              <div className="text-4xl mb-3">✉️</div>
              <h3 className="font-bold text-lg mb-2">Email Us</h3>
              <a href="mailto:kidusyosef1001@gmail.com" className="text-green-600 hover:underline block">
                kidusyosef1001@gmail.com
              </a>
              <a href="mailto:kidusyosef1001@gmail.com" className="text-green-600 hover:underline block mt-1">
                NebilSufiyan001@gmail.com
              </a>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="font-bold text-lg mb-2">WhatsApp</h3>
              <a href="https://wa.me/251911234567" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                +251 911 234 567
              </a>
              <p className="text-sm text-gray-500 mt-2">Response within 1 hour</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
              
              {success && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  {success}
                </div>
              )}
              
              {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="09XXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Farmer Registration">Farmer Registration Help</option>
                      <option value="Retailer Registration">Retailer Registration Help</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Partnership">Partnership Opportunity</option>
                      <option value="Feedback">Feedback / Suggestion</option>
                      <option value="Report Issue">Report an Issue</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Please describe your question or concern in detail..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </div>
                  ) : (
                    'Send Message'
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By submitting this form, you agree to our privacy policy. We'll respond within 24 hours.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">How long does verification take?</h3>
                <p className="text-gray-600 text-sm">Admin reviews and verifies accounts within 24 hours. You'll receive an SMS notification when approved.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Is there a fee to use the platform?</h3>
                <p className="text-gray-600 text-sm">No, Farmer Bridge is completely free for both farmers and retailers. No commission fees.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">How do I reset my password?</h3>
                <p className="text-gray-600 text-sm">Click "Forgot Password" on the login page and follow the instructions sent to your phone.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">What areas do you serve?</h3>
                <p className="text-gray-600 text-sm">Currently serving Addis Ababa and Adama. More regions coming soon!</p>
              </div>
            </div>
            <div className="text-center mt-6 pt-4 border-t">
              <Link to="/faq" className="text-green-600 hover:underline">View all FAQs →</Link>
            </div>
          </div>
        </div>

        {/* Map Section with Google Maps Embed */}
        <div className="mt-12">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-800">Find Us</h2>
                <p className="text-gray-500 text-sm mt-1">HiLCoE School, Bole Road, Addis Ababa, Ethiopia</p>
                </div>
                <div className="h-96 w-full">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d676.471289952338!2d38.76160289649859!3d9.030101884889385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b844b428bd1d9%3A0x2439574d6dcdd0e0!2sHiLCoE%20School%20of%20Computer%20Science%20and%20Technology!5e1!3m2!1sen!2set!4v1780701067424!5m2!1sen!2set"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Farmer Bridge Location"
                ></iframe>
                </div>
                <div className="p-4 bg-gray-50 text-center border-t">
                <a 
                    href="https://www.google.com/maps/place/HiLCoE+School+of+Computer+Science+and+Technology/@9.0299865,38.7620324,17z"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline text-sm inline-flex items-center gap-1"
                >
                    Get Directions
                    <span>→</span>
                </a>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;