const { admin } = require('../config/firebase');

/**
 * Middleware to authenticate requests using Firebase Auth
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express next function
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const token = authHeader.split('Bearer ')[1];
    
    try {
      // Verify the token
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      // Get additional user data from Firestore
      const userDoc = await admin.firestore().collection('users').doc(decodedToken.uid).get();
      
      if (!userDoc.exists) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const userData = userDoc.data();
      
      // Set user data in request object
      req.user = {
        id: decodedToken.uid,
        email: decodedToken.email,
        display_name: userData.display_name || decodedToken.name
      };
      
      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware; 