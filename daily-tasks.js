import { db, doc, getDoc, setDoc } from './firebase.js'; // Import from firebase.js

let defaultTasks = [];
let additionalTasks = [];

// Fetch default tasks from Firebase
async function fetchDefaultTasks() {
  const docRef = doc(db, "users", "randinu");
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    const data = snapshot.data();
    defaultTasks = data.defaultTasks || [];
    additionalTasks = data.additionalTasks || []; // Retrieve any additional tasks for the day
    renderTasks();
  }
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
    sendTasksToFirebase(); // Update Firebase whenever a new task is added
  }
}

// Remove additional task
async function removeAdditionalTask(index) {
  additionalTasks.splice(index, 1);
  renderTasks();
  sendTasksToFirebase(); // Update Firebase whenever a task is deleted
}

// Submit tasks for today
async function submitTasks() {
  const today = new Date().toISOString().split('T')[0];
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

// Handle study hours submission
document.getElementById("studyHoursForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const ictTime = document.getElementById("ictHours").value;
  const accountingTime = document.getElementById("accountingHours").value;
  const economicsTime = document.getElementById("economicsHours").value;

  const studyData = {
    ICT: ictTime,
    Accounting: accountingTime,
    Economics: economicsTime
  };

  const today = new Date().toISOString().split('T')[0];
  await setDoc(doc(db, "users", "randinu"), {
    studyHours: {
      [today]: studyData
    }
  }, { merge: true });

  alert("Study hours submitted!");
});

// Fetch tasks when the page loads
window.onload = fetchDefaultTasks;

document.getElementById("addTaskBtn").addEventListener("click", addAdditionalTaskPrompt);
document.getElementById("submitTasksBtn").addEventListener("click", submitTasks);
