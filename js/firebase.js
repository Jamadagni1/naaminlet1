// Firebase modular SDK (CDN) - works in static HTML without bundlers
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhJPREWX_nASH9RihG17TsbJCsgoqchSc",
  authDomain: "naamin-bfc7a.firebaseapp.com",
  projectId: "naamin-bfc7a",
  storageBucket: "naamin-bfc7a.firebasestorage.app",
  messagingSenderId: "124693120714",
  appId: "1:124693120714:web:e5e994138c11c18577d633",
  measurementId: "G-XENRMFB633"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (e) {
  // Analytics is optional in non-HTTPS/local environments
}
const db = getFirestore(app);

export { app, db };
