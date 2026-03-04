// Firebase configuration - YOUR ACTUAL CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAeIUeY1xRQAwOqXaXHews1pSv4lD21Vck",
  authDomain: "luggage-storage-sydney.firebaseapp.com",
  projectId: "luggage-storage-sydney",
  storageBucket: "luggage-storage-sydney.firebasestorage.app",
  messagingSenderId: "877138946318",
  appId: "1:877138946318:web:be33ba79f433be7df1cf5f",
  measurementId: "G-4GVGY4V5Y1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Optional: Enable analytics if you want
// const analytics = firebase.analytics();