/**
 * Auth Middleware
 * 
 * Re-exports the authentication middleware
 */
const authMiddleware = require('./auth.middleware');

// Export auth middleware as 'auth' for backwards compatibility
module.exports = {
  auth: authMiddleware
}; 