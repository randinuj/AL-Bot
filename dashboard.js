// Countdown Timer
const countdownEl = document.getElementById('countdown');
const examDate = new Date('2025-11-10');

function updateCountdown() {
  const now = new Date();
  const diff = examDate - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  countdownEl.textContent = `${days} days until A/L Exam`;
}
updateCountdown();
setInterval(updateCountdown, 86400000); // Update daily

// Dummy Progress Data
const progress = {
  ICT: 75,
  Accounting: 50,
  Economics: 40,
};

document.querySelectorAll('.progress-bar').forEach(bar => {
  const subject = bar.getAttribute('data-subject');
  bar.querySelector('.fill').style.width = `${progress[subject]}%`;
});

// FullCalendar Init
document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    selectable: true,
    dateClick(info) {
      alert(`You clicked on ${info.dateStr}. Tasks coming soon.`);
    },
  });
  calendar.render();
});
