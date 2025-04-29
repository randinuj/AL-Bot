// Countdown Timer
setInterval(updateCountdown, 86400000); // Update daily
const countdownEl = document.getElementById('countdown');
const examDate = new Date('2025-11-10T00:00:00'); // 10th November 2025

function updateCountdown() {
  const now = new Date();
  const diff = examDate - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days > 0) {
    countdownEl.textContent = `${days} Days Left`;
  } else {
    countdownEl.textContent = "Exam Day!";
  }
}

setInterval(updateCountdown, 1000);
updateCountdown();
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

// Study Time Pie Chart
const ctx = document.getElementById('timeChart').getContext('2d');
new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Study Time', 'Free Time'],
    datasets: [{
      label: 'Time Spent',
      data: [35, 133], // Example: 35h studied out of 168h/week
      backgroundColor: ['#42a5f5', '#757575'],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      title: {
        display: false
      }
    }
  }
});
