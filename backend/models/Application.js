import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String },
    email: { type: String },
    phone: { type: String },
    passport: { type: String },
    linkedin: { type: String },
    coverLetter: { type: String },
    resume: { type: String },
    region: { type: String },
    status: {
      type: String,
      enum: ['Pending', 'In Review', 'Shortlisted', 'Approved', 'Rejected', 'Pending Docs'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Application', applicationSchema);