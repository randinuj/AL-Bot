// Import and configure Firebase
// Make sure to include Firebase SDK in your HTML before this script
// <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore-compat.js"></script>
// <script src="/js/firebase.js"></script>

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ----------------------------
// Helper Functions (Exports)
// ----------------------------

// Save a task to a specific day
function saveTask(userId, date, taskData) {
  return db.collection('users').doc(userId)
    .collection('tasks').doc(date).set(taskData, { merge: true });
}

// Get tasks for a specific day
function getTasks(userId, date) {
  return db.collection('users').doc(userId)
    .collection('tasks').doc(date).get();
}

// Save study hours
function logStudyHours(userId, date, hours) {
  return db.collection('users').doc(userId)
    .collection('studyTime').doc(date).set({ hours }, { merge: true });
}

// Get study time summary
function getStudySummary(userId) {
  return db.collection('users').doc(userId)
    .collection('studyTime').get();
}

// Save performance data (like MCQ marks, essay scores, etc.)
function logPerformance(userId, subject, data) {
  return db.collection('users').doc(userId)
    .collection('performance').doc(subject).set(data, { merge: true });
}

// Get performance data
function getPerformance(userId, subject) {
  return db.collection('users').doc(userId)
    .collection('performance').doc(subject).get();
}

// Export
window.firebaseUtils = {
  db,
  saveTask,
  getTasks,
  logStudyHours,
  getStudySummary,
  logPerformance,
  getPerformance
};
