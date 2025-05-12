const admin = require("firebase-admin");
const serviceAccount = require("../../alqvimia-counter-u7c4j-2acdedebfa38.json");

// Initialize Firebase Admin with full admin privileges
const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
  storageBucket: `${serviceAccount.project_id}.firebasestorage.app`,
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
});

// Get Firestore instance
const db = admin.firestore();

// Configure Firestore settings
db.settings({
  timestampsInSnapshots: true,
});

module.exports = { admin, db, firebaseApp };
