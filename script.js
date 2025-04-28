// Countdown Timer to A/L Exam (10th November 2025)
const countdown = document.getElementById('countdown');
const examDate = new Date('2025-11-10T00:00:00').getTime();

setInterval(() => {
    const now = new Date().getTime();
    const distance = examDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    
    countdown.innerHTML = `<h2>Days Left for A/Ls: ${days} days</h2>`;
}, 1000);

// Task Manager
const taskList = document.getElementById('taskList');

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const li = document.createElement('li');
    li.textContent = taskText;
    li.onclick = () => {
        li.classList.toggle('completed');
    };
    taskList.appendChild(li);
    taskInput.value = '';

    saveTasks();
}

function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
        tasks.push({ text: li.textContent, completed: li.classList.contains('completed') });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.text;
        if (task.completed) li.classList.add('completed');
        li.onclick = () => {
            li.classList.toggle('completed');
            saveTasks();
        };
        taskList.appendChild(li);
    });
}
loadTasks();

// Study Time Logger
let totalHours = parseFloat(localStorage.getItem('studyHoursTotal')) || 0;
const totalHoursElement = document.getElementById('totalHours');
totalHoursElement.textContent = `Total Hours: ${totalHours}`;

function logStudyTime() {
    const studyHours = document.getElementById('studyHours').value;
    if (studyHours !== '') {
        totalHours += parseFloat(studyHours);
        totalHoursElement.textContent = `Total Hours: ${totalHours}`;
        localStorage.setItem('studyHoursTotal', totalHours);
        document.getElementById('studyHours').value = '';
    }
}

// Score Logger
function logScores() {
    const subject = document.getElementById('subjectSelect').value;
    const mcq = parseInt(document.getElementById('mcqScore').value) || 0;
    const essay = parseInt(document.getElementById('essayScore').value) || 0;
    const total = mcq + essay;

    let progress = Math.min((total / 100) * 100, 100);

    if (subject === 'accounting') {
        document.getElementById('acc-progress').style.width = `${progress}%`;
    } else if (subject === 'economics') {
        document.getElementById('eco-progress').style.width = `${progress}%`;
    } else if (subject === 'ict') {
        document.getElementById('ict-progress').style.width = `${progress}%`;
    }

    updateMessage(subject, total);
}

function updateMessage(subject, total) {
    const message = document.getElementById('message');
    if (total >= 80) {
        message.innerText = `Fantastic work in ${capitalize(subject)}! Keep destroying it!`;
    } else if (total >= 60) {
        message.innerText = `Good progress in ${capitalize(subject)} — you're getting there!`;
    } else if (total >= 40) {
        message.innerText = `Decent improvement in ${capitalize(subject)}. Stay consistent!`;
    } else {
        message.innerText = `Let's hustle harder for ${capitalize(subject)}, Randinu! One step at a time.`;
    }
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}
