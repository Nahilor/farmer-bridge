// Server/src/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configure email transporter (add to .env)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/submit', async (req, res) => {
  console.log('📩 Contact form received!');
  
  const { name, email, phone, subject, message } = req.body;
  
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please fill in all required fields' 
    });
  }
  
  try {
    // Send email to you (the admin)
    await transporter.sendMail({
      from: `"Farmer Bridge Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECIPIENT || 'kidusyosef1001@gmail.com',
      subject: `New Contact: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });
    
    // Optional: Send auto-reply to the user
    await transporter.sendMail({
      from: `"Farmer Bridge" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank you for contacting Farmer Bridge',
      html: `
        <h3>Thank you for reaching out, ${name}!</h3>
        <p>We have received your message and will get back to you within 24 hours.</p>
        <p>Best regards,<br>Farmer Bridge Team</p>
      `
    });
    
    console.log(`✅ Email sent to ${process.env.EMAIL_RECIPIENT}`);
    
    res.json({ 
      success: true, 
      message: 'Message sent successfully! We will respond within 24 hours.' 
    });
    
  } catch (error) {
    console.error('Email error:', error);
    res.json({ 
      success: true,  // Still return success to user even if email fails
      message: 'Message received! We will respond within 24 hours.' 
    });
  }
});

module.exports = router;