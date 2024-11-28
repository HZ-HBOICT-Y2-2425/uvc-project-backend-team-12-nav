// routes/userRoutes.js
import express from 'express';
import { signupController } from '../controllers/signupController.js';
import { loginController } from '../controllers/loginController.js';
import { submitQuestionnaire } from '../controllers/submitQuestionnaire.js';

const router = express.Router();

const app = express();
app.use(express.json());

// Public Routes
router.post('/signup', signupController);
router.post('/login', loginController);

router.post('/submit-questionnaire', submitQuestionnaire);
export default router;

