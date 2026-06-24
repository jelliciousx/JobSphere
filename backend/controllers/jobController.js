import Job from '../models/Job.js';

export const createJob = async (req, res) => {
  const job = await Job.create({ ...req.body, postedBy: req.user._id });
  res.status(201).json(job);
};

export const getJobs = async (req, res) => {
  const jobs = await Job.find({ status: 'active' })
    .populate('postedBy', 'name')
    .sort({ createdAt: -1 });
  res.json(jobs);
};

export const getAllJobsAdmin = async (req, res) => {
  const jobs = await Job.find().populate('postedBy', 'name').sort({ createdAt: -1 });
  res.json(jobs);
};

export const updateJob = async (req, res) => {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(job);
};

export const deleteJob = async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ message: 'Job deleted' });
};