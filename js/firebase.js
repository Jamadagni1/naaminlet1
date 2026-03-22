// Firebase modular SDK (CDN) - works in static HTML without bundlers
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const isDedicatedLocalAuthOrigin =
  typeof window !== "undefined" &&
  window.location.hostname === "localhost" &&
  window.location.port === "8000";

const firebaseConfig = {
  apiKey: "AIzaSyBhJPREWX_nASH9RihG17TsbJCsgoqchSc",
  authDomain: isDedicatedLocalAuthOrigin ? window.location.host : "naamin-bfc7a.firebaseapp.com",
  projectId: "naamin-bfc7a",
  storageBucket: "naamin-bfc7a.firebasestorage.app",
  messagingSenderId: "124693120714",
  appId: "1:124693120714:web:e5e994138c11c18577d633",
  measurementId: "G-XENRMFB633"
};

const app = initializeApp(firebaseConfig);
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (e) {
  // Analytics is optional in non-HTTPS/local environments
}
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
