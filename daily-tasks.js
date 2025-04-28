// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC99x-h0rsxYd_uqu3_axIyI9p8Qdz_MXY",
  authDomain: "randinu-al-helper.firebaseapp.com",
  projectId: "randinu-al-helper",
  storageBucket: "randinu-al-helper.firebasestorage.app",
  messagingSenderId: "890408425238",
  appId: "1:890408425238:web:81dd575aa1e0b2c341e237"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const taskList = document.getElementById('task-list');
const addTaskForm = document.getElementById('add-task-form');
const taskType = document.getElementById('task-type');
const taskDetails = document.getElementById('task-details');
const studyTimeForm = document.getElementById('study-time-form');

// Load Today's Tasks
async function loadTasks() {
  taskList.innerHTML = '';
  const querySnapshot = await getDocs(collection(db, "dailyTasks"));
  querySnapshot.forEach((docSnap) => {
    const li = document.createElement('li');
    li.textContent = docSnap.data().task;
    if (docSnap.data().completed) li.classList.add('completed');

    li.addEventListener('click', async () => {
      const taskRef = doc(db, "dailyTasks", docSnap.id);
      await updateDoc(taskRef, { completed: !docSnap.data().completed });
      loadTasks();
    });

    taskList.appendChild(li);
  });
}

// Handle Add Task
addTaskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  let taskText = '';

  const type = taskType.value;

  if (type === 'Paper') {
    const mcqMarks = document.getElementById('mcq-marks').value;
    const essayMarks = document.getElementById('essay-marks').value;
    taskText = `Paper - MCQ Marks: ${mcqMarks}/50, Essay Marks: ${essayMarks}/50`;
  } else if (type === 'Questions') {
    const questionType = document.getElementById('question-type').value;
    if (questionType === 'MCQ') {
      const quantity = document.getElementById('mcq-quantity').value;
      const marks = document.getElementById('mcq-total-marks').value;
      taskText = `Questions - MCQ: ${quantity} questions, ${marks}/${quantity} marks`;
    } else if (questionType === 'Essay') {
      const lessonNumber = document.getElementById('lesson-number').value;
      const marks = document.getElementById('essay-marks-questions').value;
      taskText = `Questions - Essay: Lesson ${lessonNumber}, ${marks}/50 marks`;
    }
  }

  if (taskText) {
    await addDoc(collection(db, "dailyTasks"), {
      task: taskText,
      completed: false
    });
    addTaskForm.reset();
    taskDetails.innerHTML = '';
    loadTasks();
  }
});

// Handle dynamic form details
taskType.addEventListener('change', () => {
  const type = taskType.value;
  taskDetails.innerHTML = '';

  if (type === 'Paper') {
    taskDetails.innerHTML = `
      <input type="number" id="mcq-marks" placeholder="MCQ Marks (out of 50)" required>
      <input type="number" id="essay-marks" placeholder="Essay Marks (out of 50)" required>
    `;
  } else if (type === 'Questions') {
    taskDetails.innerHTML = `
      <select id="question-type" required>
        <option value="">Select Question Type</option>
        <option value="MCQ">MCQ</option>
        <option value="Essay">Essay</option>
      </select>
      <div id="question-details"></div>
    `;

    document.getElementById('question-type').addEventListener('change', () => {
      const questionType = document.getElementById('question-type').value;
      const detailsDiv = document.getElementById('question-details');
      detailsDiv.innerHTML = '';

      if (questionType === 'MCQ') {
        detailsDiv.innerHTML = `
          <input type="number" id="mcq-quantity" placeholder="MCQ Quantity" required>
          <input type="number" id="mcq-total-marks" placeholder="MCQ Marks" required>
        `;
      } else if (questionType === 'Essay') {
        detailsDiv.innerHTML = `
          <input type="number" id="lesson-number" placeholder="Lesson Number" required>
          <input type="number" id="essay-marks-questions" placeholder="Essay Marks (out of 50)" required>
        `;
      }
    });
  }
});

// Handle Study Time Form
studyTimeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const accountingHours = parseInt(document.getElementById('accounting-hours').value);
  const economicsHours = parseInt(document.getElementById('economics-hours').value);
  const ictHours = parseInt(document.getElementById('ict-hours').value);

  await addDoc(collection(db, "studyHours"), {
    date: new Date().toISOString().split('T')[0],
    accounting: accountingHours,
    economics: economicsHours,
    ict: ictHours
  });

  studyTimeForm.reset();
  alert('Study time updated!');
});

// Initial Load
loadTasks();
