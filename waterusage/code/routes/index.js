import express from 'express';
import { responseExample, updateExample, responseByIdExample } from '../controllers/exampleController.js';
import { checkName } from '../middleware/exampleMiddleware.js';
const router = express.Router();

// routes
router.get('/', (req, res, next) => {
  res.json('hi');
});
router.get('/example', checkName, responseExample);
router.post('/example', checkName, updateExample);
router.get('/example/:id', checkName, responseByIdExample);

export default router;
