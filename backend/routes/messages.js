import express from 'express';
import {
  createMessage,
  getMessages,
  markRead,
  submitContact,
  sendEmailToUser,
} from '../controllers/messageController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// ═══════════════════════════════════════════════════════════
// PUBLIC  —  Contact form from About page (no auth required)
// ═══════════════════════════════════════════════════════════
router.post('/contact', submitContact);

// ═══════════════════════════════════════════════════════════
// ADMIN  —  Send email directly to a user / applicant
// ═══════════════════════════════════════════════════════════
router.post('/send', protect, adminOnly, sendEmailToUser);

// ═══════════════════════════════════════════════════════════
// ADMIN  —  Broadcast / internal message routes
// ═══════════════════════════════════════════════════════════
router.post('/', protect, adminOnly, createMessage);
router.get('/', protect, adminOnly, getMessages);
router.put('/:id/read', protect, adminOnly, markRead);

export default router;