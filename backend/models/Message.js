import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    // ─── Type ───
    type: {
      type: String,
      enum: ['broadcast', 'contact', 'applicant'],
      default: 'broadcast',
    },

    // ─── For Contact Forms (public, no user account) ───
    name: { type: String, default: '' },      // contact form name
    email: { type: String, default: '' },     // contact form email
    phone: { type: String, default: '' },     // contact form phone

    // ─── For Broadcasts / Admin messages ───
    subject: { type: String, default: '' },
    body: { type: String, required: true },

    // ─── Sender ───
    // Can be a User ObjectId OR null for public contact forms
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // ─── Recipients (for broadcast messages) ───
    recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // ─── Read status ───
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;