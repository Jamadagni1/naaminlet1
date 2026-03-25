import { firebaseConfig, auth, db } from "./firebase-config.js";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const ADMIN_EMAILS = [
  // "admin@example.com"
];

const ADMIN_REDIRECT = "admin.html";
const USER_REDIRECT = "index.html";

const form = document.querySelector("form");
const messageEl = document.getElementById("auth-message");
const mode = document.body?.dataset?.auth || "";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const showMessage = (text, type = "info") => {
  if (!messageEl) return;
  messageEl.textContent = text;
  messageEl.dataset.type = type;
};

const isConfigPlaceholder = () => {
  if (!firebaseConfig || !firebaseConfig.apiKey) return true;
  return String(firebaseConfig.apiKey).includes("YOUR_");
};

const normalizeRole = (email) => {
  if (!email) return "user";
  return ADMIN_EMAILS.includes(email.toLowerCase()) ? "admin" : "user";
};

const validateEmail = (email) => emailRegex.test(email);

const validatePassword = (password) => String(password).length >= 8;

const getUserRole = async (uid) => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return "user";
  return snap.data()?.role || "user";
};

const safeRedirect = (role) => {
  const target = role === "admin" ? ADMIN_REDIRECT : USER_REDIRECT;
  if (role === "admin") {
    fetch(target, { method: "HEAD" }).then((res) => {
      window.location.href = res.ok ? target : USER_REDIRECT;
    }).catch(() => {
      window.location.href = USER_REDIRECT;
    });
  } else {
    window.location.href = USER_REDIRECT;
  }
};

const handleAuthError = (err) => {
  const code = err?.code || "";
  switch (code) {
    case "auth/email-already-in-use":
      return "Email already exists. Please log in instead.";
    case "auth/invalid-email":
      return "Invalid email format.";
    case "auth/user-not-found":
      return "User not found. Please sign up first.";
    case "auth/wrong-password":
      return "Wrong password. Please try again.";
    case "auth/invalid-credential":
      return "Invalid credentials. Please try again.";
    case "auth/weak-password":
      return "Password should be at least 8 characters.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was closed before completing.";
    default:
      return err?.message || "Something went wrong. Please try again.";
  }
};

if (isConfigPlaceholder()) {
  showMessage("Firebase config is missing. Update firebase-config.js with your project keys.", "error");
}

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showMessage("", "info");

    if (isConfigPlaceholder()) {
      showMessage("Please set Firebase keys in firebase-config.js before continuing.", "error");
      return;
    }

    try {
      if (mode === "signup") {
        const name = document.getElementById("signup-name")?.value?.trim() || "";
        const email = document.getElementById("signup-email")?.value?.trim() || "";
        const password = document.getElementById("signup-password")?.value || "";
        const confirm = document.getElementById("signup-confirm")?.value || "";

        if (!name || !email || !password || !confirm) {
          showMessage("Please fill in all fields.", "error");
          return;
        }
        if (!validateEmail(email)) {
          showMessage("Please enter a valid email address.", "error");
          return;
        }
        if (!validatePassword(password)) {
          showMessage("Password must be at least 8 characters.", "error");
          return;
        }
        if (password !== confirm) {
          showMessage("Passwords do not match.", "error");
          return;
        }

        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });

        const role = normalizeRole(email);
        await setDoc(doc(db, "users", cred.user.uid), {
          name,
          email,
          role,
          provider: "password",
          createdAt: serverTimestamp()
        });

        showMessage("Account created successfully. Redirecting...", "success");
        safeRedirect(role);
      } else if (mode === "login") {
        const email = document.getElementById("login-email")?.value?.trim() || "";
        const password = document.getElementById("login-password")?.value || "";

        if (!email || !password) {
          showMessage("Please enter your email and password.", "error");
          return;
        }
        if (!validateEmail(email)) {
          showMessage("Please enter a valid email address.", "error");
          return;
        }

        const cred = await signInWithEmailAndPassword(auth, email, password);
        const role = await getUserRole(cred.user.uid);
        showMessage("Logged in. Redirecting...", "success");
        safeRedirect(role);
      }
    } catch (err) {
      showMessage(handleAuthError(err), "error");
    }
  });
}

const googleBtn = document.getElementById("google-auth-btn");
if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    showMessage("", "info");

    if (isConfigPlaceholder()) {
      showMessage("Please set Firebase keys in firebase-config.js before continuing.", "error");
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const user = cred.user;
      const role = normalizeRole(user.email);

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          name: user.displayName || "",
          email: user.email || "",
          role,
          provider: "google",
          createdAt: serverTimestamp()
        });
      }

      showMessage("Signed in with Google. Redirecting...", "success");
      safeRedirect(role);
    } catch (err) {
      showMessage(handleAuthError(err), "error");
    }
  });
}

const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = USER_REDIRECT;
  });
}

onAuthStateChanged(auth, async (user) => {
  const authGate = document.querySelector("[data-auth-gate]");
  if (!authGate) return;

  if (!user) {
    authGate.textContent = "Please log in to continue.";
    return;
  }

  const role = await getUserRole(user.uid);
  authGate.textContent = `Signed in as ${user.email} (${role})`;
});
