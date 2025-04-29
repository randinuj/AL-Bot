let defaultTasks = ["ICT Daily Quiz"];
let additionalTasks = [];
let submittedTasks = [];

function renderTasks() {
  const defaultList = document.getElementById("defaultTasksList");
  defaultList.innerHTML = "";
  defaultTasks.forEach((task) => {
    const li = document.createElement("li");
    li.textContent = task;
    li.addEventListener("click", () => toggleComplete(li));
    li.classList.toggle("completed", submittedTasks.includes(task));
    defaultList.appendChild(li);
  });

  const additionalList = document.getElementById("additionalTasksList");
  additionalList.innerHTML = "";
  additionalTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${task}</span> <button onclick="removeAdditionalTask(${index})">X</button>`;
    li.querySelector("span").addEventListener("click", () => toggleComplete(li));
    li.classList.toggle("completed", submittedTasks.includes(task));
    additionalList.appendChild(li);
  });
}

function toggleComplete(li) {
  li.classList.toggle("completed");
}

function addAdditionalTaskPrompt() {
  const task = prompt("Enter additional task");
  if (task) {
    additionalTasks.push(task);
    renderTasks();
  }
}

function removeAdditionalTask(index) {
  additionalTasks.splice(index, 1);
  renderTasks();
}

function submitTasks() {
  submittedTasks = [...defaultTasks, ...additionalTasks];
  alert("Tasks confirmed for today!");
  renderTasks();
}

function submitStudyHours() {
  const ict = document.getElementById("ictTime").value;
  const acc = document.getElementById("accTime").value;
  const eco = document.getElementById("ecoTime").value;

  const totalHours = [ict, acc, eco].reduce((total, timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    return total + (h + m / 60);
  }, 0);

  alert(`Logged a total of ${totalHours.toFixed(2)} hours today.`);
  renderChart(totalHours);
}

function renderChart(hours) {
  const ctx = document.getElementById("timeChart").getContext("2d");
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Studied", "Remaining"],
      datasets: [{
        data: [hours, 24 - hours],
        backgroundColor: ["#42a5f5", "#757575"],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: { display: true, text: 'Study Time Today' }
      }
    }
  });
}

window.onload = renderTasks;
