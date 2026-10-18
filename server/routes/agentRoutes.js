import express from 'express';
import { executeAgentCommand } from '../controllers/agentController.js';

const router = express.Router();

router.post('/command', executeAgentCommand);

export default router;
