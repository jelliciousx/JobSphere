import express from 'express';
import { createJob, getJobs, getAllJobsAdmin, updateJob, deleteJob } from '../controllers/jobController.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = express.Router();

router.get('/', getJobs);
router.post('/', protect, adminOnly, createJob);
router.get('/admin/all', protect, adminOnly, getAllJobsAdmin);
router.put('/:id', protect, adminOnly, updateJob);
router.delete('/:id', protect, adminOnly, deleteJob);

export default router;
