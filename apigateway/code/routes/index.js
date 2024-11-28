// apigateway/code/routes/index.js

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const router = express.Router();

// Proxy to the Water Usage Microservice (port 3011)
const waterUsageProxy = createProxyMiddleware('/api', {
  target: 'http://waterusage:3011',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // Remove '/api' prefix when forwarding
  },
  onError: (err, req, res) => {
    console.error(`Error proxying to waterusage microservice: ${err.message}`);
    res.status(500).json({ message: 'Error connecting to the waterusage microservice.' });
  },
});

// Apply the water usage proxy
router.use('/api', waterUsageProxy);

// Export the router
export default router;
