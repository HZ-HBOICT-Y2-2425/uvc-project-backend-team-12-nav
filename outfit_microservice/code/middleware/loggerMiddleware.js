// middleware/loggerMiddleware.js
const loggerMiddleware = (req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.url}`);
  
  const originalSend = res.send;
  res.send = function(body) {
    console.log(`✨ Response: ${req.method} ${req.url} (${res.statusCode})`);
    res.send = originalSend;
    return originalSend.call(this, body);
  };

  next();
};

export default loggerMiddleware;