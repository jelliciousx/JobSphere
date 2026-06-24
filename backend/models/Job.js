import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'], default: 'Full-time' },
    salary: { type: String },
    experience: { type: String },
    skills: [{ type: String }],
    description: { type: String, required: true },
    requirements: [{ type: String }],
    isInternational: { type: Boolean, default: false },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['active', 'closed'], default: 'active' },
  },
  { timestamps: true }
);

export default mongoose.model('Job', jobSchema);