const admin = require('firebase-admin');
const bcrypt = require('bcrypt');

/**
 * Controller for handling authentication operations
 */
class AuthController {
  /**
   * Register a new user
   * @param {Object} userData User registration data
   * @returns {Promise<Object>} Registration result
   */
  async register(userData) {
    try {
      const { email, password, display_name } = userData;

      // Generate password hash for storage in Firestore
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      // Create user in Firebase Auth
      const userRecord = await admin.auth().createUser({
        email,
        password, // Firebase will hash this separately
        displayName: display_name
      });

      // Create user document in Firestore
      await admin.firestore().collection('users').doc(userRecord.uid).set({
        email,
        password_hash, // Store our own hash for schema compatibility
        display_name: display_name || '',
        created_at: admin.firestore.FieldValue.serverTimestamp()
      });

      // Create custom token for immediate sign-in
      const token = await admin.auth().createCustomToken(userRecord.uid);

      return {
        user: {
          id: userRecord.uid,
          email: userRecord.email,
          display_name: userRecord.displayName
        },
        token
      };
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  /**
   * Authenticate a user
   * @param {string} email User email
   * @param {string} password User password
   * @returns {Promise<Object>} Login result
   */
  async login(email, password) {
    try {
      // In a real application, Firebase Auth client SDK would handle this
      // For backend purposes, we can create a custom token
      // Find user by email
      const userRecord = await admin.auth().getUserByEmail(email);

      // Create custom token
      const token = await admin.auth().createCustomToken(userRecord.uid);

      // Get user data from Firestore
      const userDoc = await admin.firestore().collection('users').doc(userRecord.uid).get();

      if (!userDoc.exists) {
        throw new Error('User document not found');
      }

      const userData = userDoc.data();

      return {
        user: {
          id: userRecord.uid,
          email: userRecord.email,
          display_name: userRecord.displayName || userData.display_name
        },
        token
      };
    } catch (error) {
      console.error('Error logging in:', error);
      throw new Error('Invalid email or password');
    }
  }

  /**
   * Authenticate a user with Google
   * @param {string} email User email
   * @returns {Promise<Object>} Login result
   */
  async google(email) {
    try {

      if (!admin.auth().getUserByEmail(email)) {
        try {
          const { email, display_name } = userData;
    
          const password_hash = "";
    
          // Create user in Firebase Auth
          const userRecord = await admin.auth().createUser({
            email,
            password, // Firebase will hash this separately
            displayName: display_name
          });
    
          // Create user document in Firestore
          await admin.firestore().collection('users').doc(userRecord.uid).set({
            email,
            password_hash, // Store our own hash for schema compatibility
            display_name: display_name || '',
            created_at: admin.firestore.FieldValue.serverTimestamp()
          });
    
          // Create custom token for immediate sign-in
          const token = await admin.auth().createCustomToken(userRecord.uid);
    
          return {
            user: {
              id: userRecord.uid,
              email: userRecord.email,
              display_name: userRecord.displayName
            },
            token
          };
        } catch (error) {
          console.error('Error registering user:', error);
          throw error;
        }

      } else {
        // Check if user exists
        const userRecord = await admin.auth().getUserByEmail(email);

        // Create custom token
        const token = await admin.auth().createCustomToken(userRecord.uid);

        return {
          user: {
            id: userRecord.uid,
            email: userRecord.email,
            display_name: userRecord.displayName
          },
          token
        };
      }

    } catch (error) {
      console.error('Error logging in with Google:', error);
      throw new Error('Invalid Google email');
    }
  }

  /**
   * Refresh access token
   * @param {string} refreshToken Refresh token
   * @returns {Promise<Object>} New tokens
   */

  async refreshToken(refreshToken) {
    try {
      // In a real application, we would verify the refresh token
      // and generate a new access token
      // For demo purposes, we'll decode the token to get the user ID
      const decodedToken = await admin.auth().verifyIdToken(refreshToken);
      const uid = decodedToken.uid;

      // Create a new custom token
      const newToken = await admin.auth().createCustomToken(uid);

      return {
        token: newToken
      };
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Logout a user
   * @param {string} refreshToken Refresh token
   * @returns {Promise<void>}
   */
  async logout(refreshToken) {
    try {
      // In a real application, we would invalidate the refresh token
      // For Firebase, we would need to implement a blacklist or revocation mechanism
      // This is a simplified implementation
      const decodedToken = await admin.auth().verifyIdToken(refreshToken);
      const uid = decodedToken.uid;

      // Revoke all tokens for the user
      await admin.auth().revokeRefreshTokens(uid);

      return;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  /**
   * Request password reset
   * @param {string} email User email
   * @returns {Promise<Object>} Result
   */
  async requestPasswordReset(email) {
    try {
      // In a real application, we would use Firebase Auth client SDK
      // For backend, we can generate a reset link or token
      // Check if user exists
      const userRecord = await admin.auth().getUserByEmail(email);

      // Generate password reset link
      // This is just a placeholder
      const resetLink = `https://yourdomain.com/reset-password?token=${userRecord.uid}`;

      // Send email with reset link
      // TODO: Implement email sending functionality
      console.log(`Password reset link for ${email}: ${resetLink}`);

      return { success: true, message: 'Password reset link sent' };
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw new Error('User not found');
    }
  }

  /**
   * Reset password
   * @param {string} token Reset token
   * @param {string} newPassword New password
   * @returns {Promise<Object>} Result
   */
  async resetPassword(token, newPassword) {
    try {
      // In a real application, we would use Firebase Auth client SDK
      // For backend, we can handle reset tokens
      // This is a simplified implementation

      // Decode token to get user ID
      const decodedToken = await admin.auth().verifyIdToken(token);
      const uid = decodedToken.uid;

      // Generate new password hash for Firestore
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(newPassword, saltRounds);

      // Update password in Firebase Auth
      await admin.auth().updateUser(uid, {
        password: newPassword
      });

      // Update password hash in Firestore
      await admin.firestore().collection('users').doc(uid).update({
        password_hash
      });

      // Revoke tokens to force logout
      await admin.auth().revokeRefreshTokens(uid);

      return { success: true, message: 'Password reset successfully' };
    } catch (error) {
      console.error('Error resetting password:', error);
      throw new Error('Invalid reset token');
    }
  }

  /**
   * Update user password
   * @param {string} uid User ID
   * @param {string} currentPassword Current password
   * @param {string} newPassword New password
   * @returns {Promise<Object>} Result
   */
  async updatePassword(uid, currentPassword, newPassword) {
    try {
      // In a real application, Firebase Auth client SDK would handle this
      // For backend purposes, we need to verify the current password first
      // This is a simplified implementation

      // Generate new password hash for Firestore
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(newPassword, saltRounds);

      // Update password in Firebase Auth
      await admin.auth().updateUser(uid, {
        password: newPassword
      });

      // Update password hash in Firestore
      await admin.firestore().collection('users').doc(uid).update({
        password_hash
      });

      // Revoke tokens to force re-login with new password
      await admin.auth().revokeRefreshTokens(uid);

      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      console.error('Error updating password:', error);
      throw new Error('Failed to update password');
    }
  }
}

module.exports = new AuthController(); 