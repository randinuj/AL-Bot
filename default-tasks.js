import { db, collection, doc, getDocs, addDoc, deleteDoc } from './firebase.js';

let defaultTasks = [];

// Fetch default tasks from Firebase subcollection
async function fetchDefaultTasks() {
  const colRef = collection(db, "users", "randinu", "defaultTasks");
  const snapshot = await getDocs(colRef);
  defaultTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderDefaultTasks();
}

// Render default tasks
function renderDefaultTasks() {
  const list = document.getElementById("defaultTasksList");
  list.innerHTML = "";
  defaultTasks.forEach((task) => {
    const li = document.createElement("li");
    li.textContent = `${task.name} (${task.days.join(', ')})`;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "X";
    removeBtn.onclick = () => removeDefaultTask(task.id);
    li.appendChild(removeBtn);
    list.appendChild(li);
  });
}

// Remove default task by ID
async function removeDefaultTask(taskId) {
  const taskDoc = doc(db, "users", "randinu", "defaultTasks", taskId);
  await deleteDoc(taskDoc);
  fetchDefaultTasks();
}

// Add new default task
document.getElementById("addDefaultTaskForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const daysSelect = document.getElementById("taskDays");
  const selectedDays = Array.from(daysSelect.selectedOptions).map(option => option.value);
  const taskName = document.getElementById("taskName").value;

  const newTask = { name: taskName, days: selectedDays };
  await addDoc(collection(db, "users", "randinu", "defaultTasks"), newTask);

  document.getElementById("addDefaultTaskForm").reset();
  fetchDefaultTasks();
});

window.onload = fetchDefaultTasks;
