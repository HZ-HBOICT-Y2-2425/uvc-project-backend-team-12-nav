// routes/index.js
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Create router
export const router = express.Router();

// Define your services
const SERVICES = {
  auth: {
    url: 'http://localhost:3012',
    routes: ['/', '/signup', '/login', '/submit-questionnaire', '/current-user']
  },
  bank: {
    url: 'http://localhost:3020',
    routes: ['/bank']
  },
  outfits: {
    url: 'http://localhost:3013',
    routes: ['/outfits']
  },
  waterlog: {
    url: 'http://localhost:3011',
    routes: ['/waterlog']
  }
};

// Attach services to router for logging purposes
router.services = SERVICES;

// Setup proxy middleware for each service
Object.entries(SERVICES).forEach(([service, config]) => {
  config.routes.forEach(route => {
    router.use(route, createProxyMiddleware({
      target: config.url,
      changeOrigin: true,
      pathRewrite: (path) => {
        const prefix = route === '/' ? '' : route;
        return path.replace(prefix, '');
      },
      onProxyReq: (proxyReq, req) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} -> ${service}`);
      },
      onProxyRes: (proxyRes, req) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} <- ${service} (${proxyRes.statusCode})`);
      },
      onError: (err, req, res) => {
        console.error(`[${new Date().toISOString()}] Error in ${service}:`, err);
        res.status(500).json({
          error: `Error connecting to ${service} service`,
          message: err.message
        });
      }
    }));
  });
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    services: Object.fromEntries(
      Object.entries(SERVICES).map(([name, config]) => [name, config.url])
    )
  });
});