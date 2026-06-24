import express from 'express';
import { upload } from '../middleware/upload.js';
import { applyJob, getApplicants, updateStatus, getStats, getYearlyData, getMyApplications, getAnalytics, checkApplicationStatus } from '../controllers/applicationController.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = express.Router();

// File upload middleware for single file 'resume'
router.post('/', protect, upload.single('resume'), applyJob);
router.get('/', protect, adminOnly, getApplicants);
router.get('/my', protect, getMyApplications);
router.get('/stats', protect, adminOnly, getStats);
router.get('/yearly', protect, adminOnly, getYearlyData);
router.get('/analytics', protect, adminOnly, getAnalytics);
router.get('/check-status/:jobId', protect, checkApplicationStatus);
router.put('/:id/status', protect, adminOnly, updateStatus);

export default router;