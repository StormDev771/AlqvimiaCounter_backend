const admin = require('firebase-admin');
const bcrypt = require('bcrypt');

/**
 * Controller for handling user operations
 */
class UserController {
  /**
   * Get all users
   * @returns {Promise<Array>} List of users
   */
  async getAllUsers() {
    try {
      const usersSnapshot = await admin.firestore().collection('users').get();
      const users = [];
      
      usersSnapshot.forEach(doc => {
        users.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return users;
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param {string} userId User ID
   * @returns {Promise<Object>} User data
   */
  async getUserById(userId) {
    try {
      const userDoc = await admin.firestore().collection('users').doc(userId).get();
      
      if (!userDoc.exists) {
        return null;
      }
      
      return {
        id: userDoc.id,
        ...userDoc.data()
      };
    } catch (error) {
      console.error(`Error getting user with ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new user
   * @param {Object} userData User data
   * @returns {Promise<Object>} Created user
   */
  async createUser(userData) {
    try {
      // Only store necessary fields based on schema

      const usersRef = admin.firestore().collection('users');
      const querySnapshot = await usersRef.where('email', '==', userData.email).get();
      
      if (!querySnapshot.empty) {
        return {
          error: 'User already exists'
        }
      }

      const hash = await bcrypt.hash(userData.password, 10)
      const userDataToStore = {
        email: userData.email,
        display_name: userData.display_name || '',
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        password: hash || '',
      };
      
      const newUserRef = await admin.firestore().collection('users').add(userDataToStore);
      const newUserDoc = await newUserRef.get();
      
      return {
        id: newUserDoc.id,
        ...newUserDoc.data()
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update a user
   * @param {string} userId User ID
   * @param {Object} userData Updated user data
   * @returns {Promise<Object>} Updated user
   */
  async updateUser(userId, userData) {
    try {
      const userRef = admin.firestore().collection('users').doc(userId);
      const userDoc = await userRef.get();
      
      if (!userDoc.exists) {
        return null;
      }
      
      // Only allow updating fields that are in the schema
      const userDataToUpdate = {};
      
      if (userData.email) {
        userDataToUpdate.email = userData.email;
      }
      
      if (userData.display_name) {
        userDataToUpdate.display_name = userData.display_name;
      }
      
      await userRef.update(userDataToUpdate);
      const updatedUserDoc = await userRef.get();
      
      return {
        id: updatedUserDoc.id,
        ...updatedUserDoc.data()
      };
    } catch (error) {
      console.error(`Error updating user with ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a user
   * @param {string} userId User ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteUser(userId) {
    try {
      const userRef = admin.firestore().collection('users').doc(userId);
      const userDoc = await userRef.get();
      
      if (!userDoc.exists) {
        return false;
      }
      
      await userRef.delete();
      return true;
    } catch (error) {
      console.error(`Error deleting user with ID ${userId}:`, error);
      throw error;
    }
  }
  
  /**
   * Update user profile
   * @param {string} userId User ID
   * @param {Object} profileData Updated profile data
   * @returns {Promise<Object>} Updated user
   */
  async updateProfile(userId, profileData) {
    try {
      const userRef = admin.firestore().collection('users').doc(userId);
      const userDoc = await userRef.get();
      
      if (!userDoc.exists) {
        return null;
      }
      
      const currentProfile = userDoc.data().profile || {};
      
      await userRef.update({
        profile: {
          ...currentProfile,
          ...profileData
        },
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      const updatedUserDoc = await userRef.get();
      
      return {
        id: updatedUserDoc.id,
        ...updatedUserDoc.data()
      };
    } catch (error) {
      console.error(`Error updating profile for user with ID ${userId}:`, error);
      throw error;
    }
  }
  
  /**
   * Change user role
   * @param {string} userId User ID
   * @param {string} role New role
   * @returns {Promise<Object>} Updated user
   */
  async changeRole(userId, role) {
    try {
      const userRef = admin.firestore().collection('users').doc(userId);
      const userDoc = await userRef.get();
      
      if (!userDoc.exists) {
        return null;
      }
      
      await userRef.update({
        role,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      const updatedUserDoc = await userRef.get();
      
      return {
        id: updatedUserDoc.id,
        ...updatedUserDoc.data()
      };
    } catch (error) {
      console.error(`Error changing role for user with ID ${userId}:`, error);
      throw error;
    }
  }
  
  /**
   * Set user active status
   * @param {string} userId User ID
   * @param {boolean} isActive Active status
   * @returns {Promise<Object>} Updated user
   */
  async setActiveStatus(userId, isActive) {
    try {
      const userRef = admin.firestore().collection('users').doc(userId);
      const userDoc = await userRef.get();
      
      if (!userDoc.exists) {
        return null;
      }
      
      await userRef.update({
        isActive,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      const updatedUserDoc = await userRef.get();
      
      return {
        id: updatedUserDoc.id,
        ...updatedUserDoc.data()
      };
    } catch (error) {
      console.error(`Error setting active status for user with ID ${userId}:`, error);
      throw error;
    }
  }
  
  /**
   * Update user last login
   * @param {string} userId User ID
   * @returns {Promise<void>}
   */
  async updateLastLogin(userId) {
    try {
      const userRef = admin.firestore().collection('users').doc(userId);
      const userDoc = await userRef.get();
      
      if (!userDoc.exists) {
        return null;
      }
      
      await userRef.update({
        lastLogin: admin.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      console.error(`Error updating last login for user with ID ${userId}:`, error);
      throw error;
    }
  }
}

module.exports = new UserController(); 