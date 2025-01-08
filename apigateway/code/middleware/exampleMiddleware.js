// middleware/exampleMiddleware.js
export const loggerMiddleware = (req, res, next) => {
    const now = new Date().toISOString();
    console.log(`[${now}] ${req.method} ${req.url}`);
    next();
};

export const checkName = (req, res, next) => {
    console.log('I do not know you');
    next();
};

// If you need a default export
export default { loggerMiddleware, checkName };