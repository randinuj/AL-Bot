import { db, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from './firebase.js';

let defaultTasks = [];
let additionalTasks = [];

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
  const docRef = doc(db, "users", "randinu");
  await setDoc(docRef, {
  studyHours: {
    [today]: studyData
  }
}, { merge: true });
  alert("Study hours submitted!");
});

window.onload = fetchDefaultTasks;
