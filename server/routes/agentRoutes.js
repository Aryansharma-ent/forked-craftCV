import express from 'express';
import { 
  executeAgentCommand, 
  generateInterviewQuestions, 
  evaluateInterviewAnswer 
} from '../controllers/agentController.js';

const router = express.Router();

router.post('/command', executeAgentCommand);
router.post('/interview', generateInterviewQuestions);
router.post('/evaluate-answer', evaluateInterviewAnswer);

export default router;
