import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const router = express.Router();

// Proxy to the Water Usage Microservice (port 3011)
const waterUsageProxy = createProxyMiddleware('/api', {
  target: 'http://localhost:3011',
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error(`Error proxying to water usage microservice: ${err.message}`);
    res.status(500).json({ message: 'Error connecting to the water usage microservice.' });
  },
});

// Apply the water usage proxy
router.use('/waterlog', waterUsageProxy);

// Export the router
export default router;
