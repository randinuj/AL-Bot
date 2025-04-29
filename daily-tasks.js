import { db, doc, getDoc, setDoc } from './firebase.js';
import Chart from 'chart.js/auto';

let defaultTasks = [];
let additionalTasks = [];
let studyChart = null;

// Fetch default tasks from Firebase
async function fetchDefaultTasks() {
  const docRef = doc(db, "users", "randinu");
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    const data = snapshot.data();
    defaultTasks = data.defaultTasks || [];
    renderTasks();
  }
}

// Render tasks
function renderTasks() {
  const defaultList = document.getElementById("defaultTasksList");
  defaultList.innerHTML = "";
  defaultTasks.forEach((task) => {
    const li = document.createElement("li");
    li.textContent = task;
    li.addEventListener("click", () => li.classList.toggle("completed"));
    defaultList.appendChild(li);
  });

  const additionalList = document.getElementById("additionalTasksList");
  additionalList.innerHTML = "";
  additionalTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = task;
    li.addEventListener("click", () => li.classList.toggle("completed"));
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "X";
    removeBtn.onclick = () => removeAdditionalTask(index);
    li.appendChild(removeBtn);
    additionalList.appendChild(li);
  });
}

// Add additional task
function addAdditionalTaskPrompt() {
  const task = prompt("Enter additional task");
  if (task) {
    additionalTasks.push(task);
    renderTasks();
  }
}

// Remove additional task
async function removeAdditionalTask(index) {
  additionalTasks.splice(index, 1);
  renderTasks();

  const today = new Date().toISOString().split('T')[0];
  const docRef = doc(db, "users", "randinu");
  await setDoc(docRef, {
    tasks: {
      [today]: {
        default: defaultTasks,
        additional: additionalTasks
      }
    }
  }, { merge: true });
}

// Submit tasks for today
async function submitTasks() {
  const today = new Date().toISOString().split('T')[0];
  const docRef = doc(db, "users", "randinu");
  await setDoc(docRef, {
    tasks: {
      [today]: {
        default: defaultTasks,
        additional: additionalTasks
      }
    }
  }, { merge: true });
}

// Render study chart
function renderStudyChart(totalHours) {
  const ctx = document.getElementById('studyChart').getContext('2d');
  const studied = parseFloat(totalHours);
  const remaining = Math.max(0, 24 - studied);

  if (studyChart) studyChart.destroy();

  studyChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Studied', 'Not Studied'],
      datasets: [{
        data: [studied, remaining],
        backgroundColor: ['#4CAF50', '#E0E0E0']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Time Studied Today (out of 24 hours)'
        }
      }
    }
  });
}

// Handle study hours submission
document.getElementById("studyHoursForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const ictTime = parseFloat(document.getElementById("ictHours").value) || 0;
  const accountingTime = parseFloat(document.getElementById("accountingHours").value) || 0;
  const economicsTime = parseFloat(document.getElementById("economicsHours").value) || 0;

  const studyData = {
    ICT: ictTime,
    Accounting: accountingTime,
    Economics: economicsTime
  };

  const total = ictTime + accountingTime + economicsTime;

  const today = new Date().toISOString().split('T')[0];
  const docRef = doc(db, "users", "randinu");
  await setDoc(docRef, {
    studyHours: {
      [today]: studyData
    }
  }, { merge: true });

  renderStudyChart(total);
  alert("Study hours submitted!");
});

// Connect add task button if you have one
document.getElementById("addAdditionalTaskBtn").addEventListener("click", addAdditionalTaskPrompt);

// Load initial tasks
window.onload = fetchDefaultTasks;
