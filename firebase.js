import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  addDoc,
  collection,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC99x-h0rsxYd_uqu3_axIyI9p8Qdz_MXY",
  authDomain: "randinu-al-helper.firebaseapp.com",
  databaseURL: "https://randinu-al-helper-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "randinu-al-helper",
  storageBucket: "randinu-al-helper.firebasestorage.app",
  messagingSenderId: "890408425238",
  appId: "1:890408425238:web:81dd575aa1e0b2c341e237"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove,addDoc,
  collection,
  deleteDoc };
