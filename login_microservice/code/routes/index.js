// routes/userRoutes.js
import express from 'express';
import { signupController } from '../controllers/signupController.js';
import { loginController } from '../controllers/loginController.js';

const router = express.Router();

const app = express();
app.use(express.json());

// Route to handle user signup
router.post('/signup', signupController);
router.post('/login', loginController);

export default router;

