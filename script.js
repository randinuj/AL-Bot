// Countdown timer
const countdownTimer = document.getElementById('countdown-timer');
const examDate = new Date("2025-11-10T00:00:00").getTime();
setInterval(function() {
    const now = new Date().getTime();
    const distance = examDate - now;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    countdownTimer.textContent = days + " days left until A/L exams";
}, 1000);

// Task Manager
const taskList = document.getElementById('task-list');
const taskInput = document.getElementById('task-input');
const addTaskButton = document.getElementById('add-task');

addTaskButton.addEventListener('click', function() {
    const task = taskInput.value;
    if (task) {
        const li = document.createElement('li');
        li.textContent = task;
        taskList.appendChild(li);
        taskInput.value = ''; // Clear the input field
    }
});

// Progress Bar (dummy data for now)
const subjects = {
    accounting: 50,
    economics: 75,
    ict: 30
};

const accountingBar = document.querySelector('#accounting .progress-bar');
const economicsBar = document.querySelector('#economics .progress-bar');
const ictBar = document.querySelector('#ict .progress-bar');

accountingBar.style.width = subjects.accounting + '%';
economicsBar.style.width = subjects.economics + '%';
ictBar.style.width = subjects.ict + '%';
