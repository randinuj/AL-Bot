import { db, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from './firebase.js';

let defaultTasks = [];

// Fetch default tasks from Firebase
async function fetchDefaultTasks() {
  const docRef = doc(db, "users", "randinu");
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    const data = snapshot.data();
    defaultTasks = data.defaultTasks || [];
    renderDefaultTasks();
  }
}

// Render default tasks
function renderDefaultTasks() {
  const list = document.getElementById("defaultTasksList");
  list.innerHTML = "";
  defaultTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = `${task.name} (${task.days.join(', ')})`;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "X";
    removeBtn.onclick = () => removeDefaultTask(index);
    li.appendChild(removeBtn);
    list.appendChild(li);
  });
}

// Remove default task
async function removeDefaultTask(index) {
  const task = defaultTasks[index];
  defaultTasks.splice(index, 1);
  const docRef = doc(db, "users", "randinu");
  await updateDoc(docRef, {
    defaultTasks: defaultTasks
  });
  renderDefaultTasks();
}

// Add new default task
document.getElementById("addDefaultTaskForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const daysSelect = document.getElementById("taskDays");
  const selectedDays = Array.from(daysSelect.selectedOptions).map(option => option.value);
  const taskName = document.getElementById("taskName").value;

  const newTask = { name: taskName, days: selectedDays };
  defaultTasks.push(newTask);

  const docRef = doc(db, "users", "randinu");
  await updateDoc(docRef, {
    defaultTasks: defaultTasks
  });

  document.getElementById("addDefaultTaskForm").reset();
  renderDefaultTasks();
});

window.onload = fetchDefaultTasks;
