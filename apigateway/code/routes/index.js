import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const router = express.Router();

// Existing microservice proxy
const microserviceProxy = createProxyMiddleware({
  target: 'http://microservice:3011',
  changeOrigin: true,
});

// Add the signup proxy route
const signupServiceProxy = createProxyMiddleware({
  target: 'http://signup_microservice:3012',
  changeOrigin: true,
  pathRewrite: {
    '^/signup': '/', // Rewrite `/signup` to `/` when forwarding to the signup microservice
  },
  onError: (err, req, res) => {
    console.error(`Error proxying /signup: ${err.message}`);
    res.status(500).json({ message: 'Error in proxying signup request.' });
  },
});

// Apply the signup proxy to `/signup` route
router.use('/signup', signupServiceProxy);

// Apply existing proxy for all other microservice routes
router.use('/microservice', microserviceProxy);

export default router;
