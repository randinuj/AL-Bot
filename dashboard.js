import { db, doc, getDoc, collection, getDocs } from './firebase.js';

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

// Subject Progress from Firebase
async function loadProgress() {
  const docRef = doc(db, "users", "randinu");
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    const progress = snapshot.data().progress;
    document.querySelectorAll('.progress-bar').forEach(bar => {
      const subject = bar.getAttribute('data-subject');
      if (progress[subject]) {
        bar.querySelector('.fill').style.width = `${progress[subject]}%`;
      }
    });
  }
}
loadProgress();

// Load Study Time Pie Chart
async function loadStudyTime() {
  const snapshot = await getDoc(doc(db, "users", "randinu"));
  const data = snapshot.data().studyTime;
  const ctx = document.getElementById('timeChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Study Time', 'Free Time'],
      datasets: [{
        label: 'Time Spent',
        data: [data.weekly || 35, 168 - (data.weekly || 35)],
        backgroundColor: ['#42a5f5', '#757575'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}
loadStudyTime();

// FullCalendar with Firebase Events
import { Calendar } from "https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/main.min.js";
document.addEventListener('DOMContentLoaded', async function () {
  const calendarEl = document.getElementById('calendar');
  const events = [];

  const querySnapshot = await getDocs(collection(db, "users/randinu/tasks"));
  querySnapshot.forEach(doc => {
    const task = doc.data();
    events.push({
      title: task.title,
      start: task.date
    });
  });

  const calendar = new Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: events,
    dateClick(info) {
      alert(`Tasks for ${info.dateStr} will be editable soon.`);
    }
  });

  calendar.render();
});
