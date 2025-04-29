let defaultTasks = ["ICT Daily Quiz"];
let additionalTasks = [];

function renderTasks() {
  const defaultList = document.getElementById("defaultTasksList");
  defaultList.innerHTML = "";
  defaultTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${task} <button onclick="removeDefaultTask(${index})">X</button>`;
    defaultList.appendChild(li);
  });

  const additionalList = document.getElementById("additionalTasksList");
  additionalList.innerHTML = "";
  additionalTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${task} <button onclick="removeAdditionalTask(${index})">X</button>`;
    additionalList.appendChild(li);
  });
}

function addDefaultTaskPrompt() {
  const task = prompt("Enter default task");
  if (task) {
    defaultTasks.push(task);
    renderTasks();
  }
}

function removeDefaultTask(index) {
  defaultTasks.splice(index, 1);
  renderTasks();
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

function saveStudyTime() {
  const hours = document.getElementById("studyHours").value;
  alert(`Saved ${hours} hours today!`);
  renderChart(hours);
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
