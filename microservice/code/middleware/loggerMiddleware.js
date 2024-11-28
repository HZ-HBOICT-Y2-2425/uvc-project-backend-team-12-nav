const loggerMiddleware = (req, res, next) => {
  // Log the incoming request with method, URL, and timestamp
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  // Store the original `send` method
  const originalSend = res.send;

  // Intercept the response to log its status code
  res.send = function (body) {
    console.log(`Response for ${req.method} ${req.url}: Status ${res.statusCode}`);
    res.send = originalSend; // Restore the original `send` method
    return originalSend.call(this, body); // Continue with the original `send`
  };

  next(); // Proceed to the next middleware or route handler
};

export default loggerMiddleware;
