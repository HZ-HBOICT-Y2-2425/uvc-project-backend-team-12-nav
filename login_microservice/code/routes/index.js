// routes/index.js
import express from 'express';
import { loginController } from '../controllers/loginController.js';
import { signupController } from '../controllers/signupController.js';
import { submitQuestionnaire } from '../controllers/submitQuestionnaire.js';
import { getCurrentUser } from '../controllers/getCurrentUser.js';

const router = express.Router();

// Public Routes
router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/submit-questionnaire', submitQuestionnaire);
router.get('/current-user', getCurrentUser);

export default router;