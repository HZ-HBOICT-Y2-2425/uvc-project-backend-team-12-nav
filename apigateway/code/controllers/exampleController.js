export const healthCheck = (req, res) => {
  // Simple endpoint that returns the status of all services
  res.json({
    status: 'healthy',
    services: {
      auth: 'http://localhost:3012',
      bank: 'http://localhost:3020',
      outfits: 'http://localhost:3013',
      waterlog: 'http://localhost:3011'
    }
  });
};