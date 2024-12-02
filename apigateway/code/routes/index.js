import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const router = express.Router();

// Proxy for microservice
router.use(
  '/microservice',
  createProxyMiddleware({
    target: 'http://localhost:3011',
    changeOrigin: true,
  })
);

// Proxy for signup service
router.use(
  '/signup',
  createProxyMiddleware({
    target: 'http://localhost:3012',
    changeOrigin: true,
    pathRewrite: {
      '^/signup': '/',
    },
    onError: (err, req, res) => {
      console.error(`Error proxying /signup: ${err.message}`);
      res.status(500).json({ message: 'Error in proxying signup request.' });
    },
  })
);

// Proxy for submit-questionnaire
router.use(
  '/submit-questionnaire',
  createProxyMiddleware({
    target: 'http://localhost:3012',
    changeOrigin: true,
    pathRewrite: {
      '^/submit-questionnaire': '/submit-questionnaire',
    },
    onError: (err, req, res) => {
      console.error(`Error proxying /submit-questionnaire: ${err.message}`);
      res.status(500).json({ message: 'Error in proxying questionnaire submission.' });
    },
  })
);

// Proxy for waterusage microservice
router.use(
  '/api',
  createProxyMiddleware({
    target: 'http://localhost:3013',
    changeOrigin: true,
    pathRewrite: {
      '^/api': '',
    },
    onError: (err, req, res) => {
      console.error(`Error proxying to waterusage microservice: ${err.message}`);
      res.status(500).json({ message: 'Error connecting to the waterusage microservice.' });
    },
  })
);

export default router;
