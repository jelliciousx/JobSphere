import nodemailer from 'nodemailer';
import Message from '../models/Message.js';

// ═══════════════════════════════════════════════════════════
// 1.  PUBLIC  —  Submit Contact Form (from About page)
// ═══════════════════════════════════════════════════════════
export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, body } = req.body;

    if (!name || !email || !subject || !body) {
      return res.status(400).json({ message: 'Name, email, subject and body are required' });
    }

    // Save contact form submission to DB
    // sender = null because public users don't have a User account
    const msg = await Message.create({
      type: 'contact',
      name,
      email,
      phone: phone || '',
      subject,
      body,
      sender: null,           // ← FIX: null instead of {name, email} object
      read: false,
    });

    // Optional: email admin so they know someone contacted
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Jobshphere Contact" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `📩 New Contact: ${subject}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #eee;border-radius:12px;">
          <h2 style="color:#0085ff;margin-top:0;">New Contact Form Submission</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:8px 0;font-weight:bold;color:#333;width:100px;">Name:</td><td style="padding:8px 0;color:#555;">${name}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold;color:#333;">Email:</td><td style="padding:8px 0;color:#555;">${email}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold;color:#333;">Phone:</td><td style="padding:8px 0;color:#555;">${phone || 'N/A'}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold;color:#333;">Subject:</td><td style="padding:8px 0;color:#555;">${subject}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0;">
          <p style="font-weight:bold;color:#333;margin-bottom:8px;">Message:</p>
          <p style="color:#555;line-height:1.6;white-space:pre-wrap;">${body}</p>
          <p style="color:#999;font-size:12px;margin-top:24px;">— Sent via Jobshphere Contact Form</p>
        </div>
      `,
    });

    res.status(201).json({ message: 'Contact submitted successfully', data: msg });
  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ message: err.message || 'Failed to submit contact' });
  }
};

// ═══════════════════════════════════════════════════════════
// 2.  ADMIN  —  Send email directly to a user / applicant
// ═══════════════════════════════════════════════════════════
export const sendEmailToUser = async (req, res) => {
  try {
    const { to, toName, subject, body } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({ message: 'Recipient email (to), subject and body are required' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Jobshphere Admin" <${process.env.ADMIN_EMAIL}>`,
      to: to,
      subject: subject,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <div style="background:#0085ff;padding:20px;border-radius:12px 12px 0 0;">
            <h2 style="color:#fff;margin:0;font-size:18px;">Jobshphere</h2>
          </div>
          <div style="border:1px solid #eee;border-top:none;padding:24px;border-radius:0 0 12px 12px;">
            <p style="color:#333;font-size:16px;margin-top:0;">Hello ${toName || 'there'},</p>
            <div style="color:#555;line-height:1.7;font-size:14px;">${body.replace(/\n/g, '<br>')}</div>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
            <p style="color:#999;font-size:12px;margin:0;">— Jobshphere Recruitment Team</p>
            <p style="color:#bbb;font-size:11px;margin-top:4px;">This email was sent from the Jobshphere admin panel.</p>
          </div>
        </div>
      `,
    });

    console.log('Email sent:', info.messageId);
    res.json({ message: 'Email sent successfully', messageId: info.messageId });
  } catch (err) {
    console.error('Send email error:', err);
    res.status(500).json({ message: err.message || 'Failed to send email' });
  }
};

// ═══════════════════════════════════════════════════════════
// 3.  ADMIN  —  Create broadcast message
// ═══════════════════════════════════════════════════════════
export const createMessage = async (req, res) => {
  try {
    const { subject, body, recipients } = req.body;

    const msg = await Message.create({
      type: 'broadcast',
      subject,
      body,
      recipients: recipients || [],
      sender: req.user?._id || null,
      read: false,
    });

    res.status(201).json({ message: 'Message created', data: msg });
  } catch (err) {
    console.error('Create message error:', err);
    res.status(500).json({ message: err.message });
  }
};

// ═══════════════════════════════════════════════════════════
// 4.  ADMIN  —  Get all messages (contacts + broadcasts)
// ═══════════════════════════════════════════════════════════
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .populate('sender', 'name email avatar')
      .lean();

    // Normalize for frontend
    const formatted = messages.map((m) => ({
      _id: m._id,
      type: m.type || 'broadcast',
      name: m.name || m.sender?.name || 'Admin',
      email: m.email || m.sender?.email || '',
      phone: m.phone || '',
      subject: m.subject || '',
      body: m.body || '',
      sender: m.sender,
      read: m.read || false,
      createdAt: m.createdAt,
      recipients: m.recipients || [],
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ message: err.message });
  }
};

// ═══════════════════════════════════════════════════════════
// 5.  ADMIN  —  Mark message as read
// ═══════════════════════════════════════════════════════════
export const markRead = async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!msg) return res.status(404).json({ message: 'Message not found' });

    res.json({ message: 'Marked as read', data: msg });
  } catch (err) {
    console.error('Mark read error:', err);
    res.status(500).json({ message: err.message });
  }
};