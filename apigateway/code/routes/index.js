import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const router = express.Router();

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

// Proxy configuration for submitting questionnaire
const submitQuestionnaireProxy = createProxyMiddleware({
  target: 'http://login_microservice:3012',
  changeOrigin: true,
  pathRewrite: {
    '^/submit-questionnaire': '/submit-questionnaire',
  },
  onError: (err, req, res) => {
    console.error(`Error proxying /submit-questionnaire: ${err.message}`);
    res.status(500).json({ message: 'Error in proxying questionnaire submission.' });
  },
});

const outfit_microserviceProxy = createProxyMiddleware({
  target: 'http://outfit_microservice:3013',
  changeOrigin: true,
  pathRewrite: {
    '^/outfit': '/outfit',
  },
  onError: (err, req, res) => {
    console.error(`Error proxying /outfit: ${err.message}`);
    res.status(500).json({ message: 'Error in proxying outfit request.' });
  },
});


// Apply the signup proxy to `/signup` route
router.use('/signup', signupServiceProxy);


// Apply questionnaire submission proxy
router.use('/submit-questionnaire', submitQuestionnaireProxy);

// Apply outfit microservice proxy
router.use('/outfit', outfit_microserviceProxy);

export default router;
