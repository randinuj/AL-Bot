import { db, doc, getDoc, setDoc } from './firebase.js';

let defaultTasks = [];
let additionalTasks = [];

// Fetch default tasks and today's additional tasks
async function fetchDefaultTasks() {
  const today = new Date().toISOString().split('T')[0];
  const docRef = doc(db, "users", "randinu");
  const snapshot = await getDoc(docRef);

  if (snapshot.exists()) {
    const data = snapshot.data();
    defaultTasks = data.defaultTasks || [];
    additionalTasks = data.tasks?.[today]?.additional || [];
  }

  renderTasks();
}

// Render tasks
function renderTasks() {
  const defaultList = document.getElementById("defaultTasksList");
  const additionalList = document.getElementById("additionalTasksList");
  defaultList.innerHTML = "";
  additionalList.innerHTML = "";

  defaultTasks.forEach((task) => {
    const li = document.createElement("li");
    li.textContent = task;
    li.addEventListener("click", () => li.classList.toggle("completed"));
    defaultList.appendChild(li);
  });

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

// Add additional task and save immediately
async function addAdditionalTaskPrompt() {
  const task = prompt("Enter additional task");
  if (task) {
    additionalTasks.push(task);
    await saveTasks(); // save immediately after adding
    renderTasks();
  }
}

// Remove additional task and update Firebase
async function removeAdditionalTask(index) {
  additionalTasks.splice(index, 1);
  await saveTasks(); // save updated list
  renderTasks();
}

// Save both default & additional tasks for today
async function saveTasks() {
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

// Submit study hours
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
  const docRef = doc(db, "users", "randinu");

  await setDoc(docRef, {
    studyHours: {
      [today]: studyData
    }
  }, { merge: true });

  alert("Study hours submitted!");
});

window.onload = fetchDefaultTasks;
