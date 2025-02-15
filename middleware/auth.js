const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Auth middleware logic here
    next();
};

module.exports = authMiddleware;
