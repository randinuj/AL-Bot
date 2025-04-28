// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Your personal Firebase Config (replace with yours)
const firebaseConfig = {
  apiKey: "AIzaSyC99x-h0rsxYd_uqu3_axIyI9p8Qdz_MXY",
  authDomain: "randinu-al-helper.firebaseapp.com",
  projectId: "randinu-al-helper",
  storageBucket: "randinu-al-helper.firebasestorage.app",
  messagingSenderId: "890408425238",
  appId: "1:890408425238:web:81dd575aa1e0b2c341e237"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Calendar Section (VERY BASIC FOR NOW) ---
const calendar = document.getElementById('calendar');
calendar.innerHTML = "Calendar Coming Soon!";

// --- Progress Section ---
function updateProgressBar(subject, value) {
  const progress = document.getElementById(`${subject}-progress`);
  progress.querySelector('::after'); // We will replace this later with dynamic update
}

// --- Time Tracking Section ---
const ctx = document.getElementById('timePieChart').getContext('2d');
const pieChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Time Studied', 'Free Time'],
    datasets: [{
      data: [30, 70], // Placeholder values
      backgroundColor: ['#61dafb', '#2e2e2e'],
      borderColor: ['#1e1e1e', '#1e1e1e'],
      borderWidth: 2,
    }]
  },
  options: {
    plugins: {
      legend: {
        labels: {
          color: 'white'
        }
      }
    }
  }
});

// --- Default Task Management ---
const defaultTaskForm = document.getElementById('default-task-form');
const defaultTasksList = document.getElementById('default-tasks-list');

defaultTaskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const taskName = document.getElementById('task-name').value;
  const dayOfWeek = document.getElementById('day-of-week').value;

  if (taskName && dayOfWeek) {
    await addDoc(collection(db, "defaultTasks"), {
      taskName,
      dayOfWeek
    });
    loadTasks();
    defaultTaskForm.reset();
  }
});

async function loadTasks() {
  defaultTasksList.innerHTML = '';
  const querySnapshot = await getDocs(collection(db, "defaultTasks"));
  querySnapshot.forEach((docSnap) => {
    const li = document.createElement('li');
    li.textContent = `${docSnap.data().dayOfWeek}: ${docSnap.data().taskName}`;
    li.addEventListener('click', async () => {
      if (confirm('Delete this task?')) {
        await deleteDoc(doc(db, "defaultTasks", docSnap.id));
        loadTasks();
      }
    });
    defaultTasksList.appendChild(li);
  });
}

// Load tasks initially
loadTasks();
