const jwt = require('jsonwebtoken');

// Middleware to authenticate and authorize the user
const authenticateAndAuthorize = (requiredRole) => {
  return (req, res, next) => {
    // Step 1: Get the token from Authorization header
    const token = req.headers['authorization']?.split(' ')[1];
    
    // Step 2: If no token is provided, return an error
    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }

    // Step 3: Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Step 4: Attach user info to the request object
      req.user = decoded;

      // Step 5: Check if the user has the required role
      if (decoded.role !== requiredRole) {
        return res.status(403).json({ message: `You do not have permission to perform this action` });
      }

      // Proceed to the next middleware/handler if everything is good
      next();
    });
  };
};

module.exports = authenticateAndAuthorize;
