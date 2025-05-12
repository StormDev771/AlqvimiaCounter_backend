/**
 * Middleware to check if user has required role
 * @param {Array} allowedRoles Array of roles allowed to access the route
 * @returns {Function} Express middleware function
 */
const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if user object exists (set by auth middleware)
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      // Get user role from request (should be set by auth middleware)
      const userRole = req.user.role || 'user';
      
      // Check if user's role is in allowed roles
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }
      
      // User has required role, proceed to next middleware
      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      next(error);
    }
  };
};

module.exports = roleMiddleware; 