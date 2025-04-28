// Countdown to Exam Date
const countdownElement = document.getElementById('countdown');
const examDate = new Date('2025-11-10T00:00:00'); // 10th November 2025

function updateCountdown() {
  const now = new Date();
  const diff = examDate - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days > 0) {
    countdownElement.textContent = `${days} Days Left`;
  } else {
    countdownElement.textContent = "Exam Day!";
  }
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Dummy Progress Percentages (replace later with real data)
const accountingProgress = 50; // Example: 50% complete
const economicsProgress = 40;  // Example: 40% complete
const ictProgress = 65;        // Example: 65% complete

document.querySelector('.accounting-progress').style.width = accountingProgress + '%';
document.querySelector('.economics-progress').style.width = economicsProgress + '%';
document.querySelector('.ict-progress').style.width = ictProgress + '%';

// Button Navigation
function goToDashboard() {
  window.location.href = "dashboard.html";
}

function goToDailyTasks() {
  window.location.href = "daily.html";
}
