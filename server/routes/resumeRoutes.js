import express from 'express';
import multer from 'multer';
import { auditResumeFile } from '../controllers/resumeAuditController.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

router.post('/audit', upload.single('resume'), auditResumeFile);

export default router;
