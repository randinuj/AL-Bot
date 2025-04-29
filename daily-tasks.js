import { db, doc, getDoc, setDoc } from './firebase.js';

let defaultTasks = [];
let additionalTasks = [];
let studyChart;

// Fetch default tasks from Firebase
async function fetchDefaultTasks() {
  const docRef = doc(db, "users", "randinu");
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    const data = snapshot.data();
    defaultTasks = (data.defaultTasks || []).filter(task =>
      task.days.includes(getTodayName())
    ).map(task => task.name);

    const today = getTodayDate();
    if (data.tasks && data.tasks[today]) {
      additionalTasks = data.tasks[today].additional || [];
    }

    renderTasks();
  }
}

// Get today's date as string
function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

// Get today's day name (e.g., Monday)
function getTodayName() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' });
}

// Render tasks on the page
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
    sendTasksToFirebase();
  }
}

// Remove additional task
async function removeAdditionalTask(index) {
  additionalTasks.splice(index, 1);
  renderTasks();
  sendTasksToFirebase();
}

// Submit tasks for today
async function submitTasks() {
  const today = getTodayDate();
  await setDoc(doc(db, "users", "randinu"), {
    tasks: {
      [today]: {
        default: defaultTasks,
        additional: additionalTasks
      }
    }
  }, { merge: true });

  alert("Tasks submitted for today!");
}

// Send tasks (both default and additional) to Firebase
async function sendTasksToFirebase() {
  const today = getTodayDate();
  await setDoc(doc(db, "users", "randinu"), {
    tasks: {
      [today]: {
        default: defaultTasks,
        additional: additionalTasks
      }
    }
  }, { merge: true });
}

// Render or update study hours chart
function renderChart(data = { ICT: 0, Accounting: 0, Economics: 0 }) {
  const ctx = document.getElementById('studyChart').getContext('2d');
  const totalStudy = parseFloat(data.ICT) + parseFloat(data.Accounting) + parseFloat(data.Economics);
  const remaining = Math.max(24 - totalStudy, 0); // Ensure it doesn't go negative

  const chartData = {
    labels: ['Study Time', 'Other Time'],
    datasets: [{
      data: [totalStudy, remaining],
      backgroundColor: ['#36a2eb', '#e0e0e0']
    }]
  };

  if (studyChart) {
    studyChart.data = chartData;
    studyChart.update();
  } else {
    studyChart = new Chart(ctx, {
      type: 'doughnut',
      data: chartData,
      options: {
        plugins: {
          title: {
            display: true,
            text: `Study vs Other Time (Total: ${totalStudy.toFixed(2)} hrs)`
          }
        }
      }
    });
  }
    }

// Fetch previous study hours and render chart
async function loadPreviousStudyHours() {
  const today = getTodayDate();
  const docRef = doc(db, "users", "randinu");
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    const data = snapshot.data();
    const studyData = (data.studyHours && data.studyHours[today]) || { ICT: 0, Accounting: 0, Economics: 0 };
    renderChart(studyData);
  } else {
    renderChart(); // fallback
  }
}

// Submit study hours
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

  const today = getTodayDate();
  await setDoc(doc(db, "users", "randinu"), {
    studyHours: {
      [today]: studyData
    }
  }, { merge: true });

  renderChart(studyData);

  alert("Study hours submitted!");
});

// On page load
window.onload = async () => {
  await fetchDefaultTasks();
  await loadPreviousStudyHours();
};

document.getElementById("addTaskBtn").addEventListener("click", addAdditionalTaskPrompt);
document.getElementById("submitTasksBtn").addEventListener("click", submitTasks);
