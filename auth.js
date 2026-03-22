import { auth, db } from "./js/firebase.js";
import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    getRedirectResult,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithRedirect,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.querySelector("form");
const messageEl = document.getElementById("auth-message");
const googleBtn = document.getElementById("google-auth-btn");
const mode = document.body?.dataset?.auth || "";
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

const showMessage = (text, type = "info") => {
    if (!messageEl) return;
    messageEl.textContent = text;
    messageEl.dataset.type = type;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email) {
    return emailRegex.test(email);
}

function validatePassword(password) {
    return String(password).length >= 8;
}

function normalizeLocalAuthOrigin() {
    const { hostname, pathname, search, hash, protocol, port } = window.location;
    if (hostname !== "127.0.0.1" || port !== "8000") return false;

    const nextUrl = `${protocol}//localhost:8000${pathname}${search}${hash}`;
    window.location.replace(nextUrl);
    return true;
}

function setBusy(isBusy, label = "") {
    const submitBtn = form?.querySelector("button[type='submit']");
    if (submitBtn) {
        submitBtn.disabled = isBusy;
        if (label) submitBtn.dataset.originalLabel ??= submitBtn.textContent;
        submitBtn.textContent = isBusy ? label : (submitBtn.dataset.originalLabel || submitBtn.textContent);
    }

    if (googleBtn) {
        googleBtn.disabled = isBusy;
    }
}

function readAuthHints() {
    const url = new URL(window.location.href);
    return {
        signupStatus: url.searchParams.get("signup"),
        email: url.searchParams.get("email") || ""
    };
}

function clearAuthHintsFromUrl() {
    const url = new URL(window.location.href);
    ["signup", "email"].forEach((key) => url.searchParams.delete(key));
    window.history.replaceState({}, document.title, url.toString());
}

async function saveUserProfile(user, fullName = "") {
    try {
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: fullName || user.displayName || "",
            email: user.email || "",
            role: "user",
            provider: user.providerData?.[0]?.providerId || "password",
            updatedAt: serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.warn("Non-fatal profile save error", error);
    }
}

function authErrorMessage(error) {
    const code = error?.code || "";

    switch (code) {
        case "auth/email-already-in-use":
            return "This email already exists. Please log in instead.";
        case "auth/invalid-email":
            return "Please enter a valid email address.";
        case "auth/weak-password":
            return "Password must be at least 8 characters.";
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
            return "Invalid email or password.";
        case "auth/popup-closed-by-user":
            return "Google sign-in was closed before completion.";
        case "auth/popup-blocked":
            return "Your browser blocked the Google popup. Please allow popups and try again.";
        case "auth/cancelled-popup-request":
            return "Another Google sign-in attempt was already in progress.";
        case "auth/operation-not-allowed":
            return "This sign-in method is not enabled in Firebase yet.";
        case "auth/unauthorized-domain":
            return "This domain is not authorized in Firebase Auth yet. Add your local site domain in Firebase Authentication settings.";
        case "auth/operation-not-supported-in-this-environment":
            return "Popup sign-in is not supported here, so we are switching to redirect sign-in.";
        default:
            return error?.message || "Something went wrong. Please try again.";
    }
}

async function redirectForUser() {
    window.location.href = "index.html";
}

async function handleRedirectResult() {
    try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
            await saveUserProfile(result.user);
            showMessage("Signed in successfully. Redirecting...", "success");
            await redirectForUser();
            return true;
        }
    } catch (error) {
        showMessage(authErrorMessage(error), "error");
    }
    return false;
}

async function bootSession() {
    if (normalizeLocalAuthOrigin()) return;

    const hints = readAuthHints();
    if (mode === "login" && hints.email) {
        const emailInput = document.getElementById("login-email");
        if (emailInput) emailInput.value = hints.email;
    }

    if (mode === "login" && hints.signupStatus === "created") {
        showMessage("Account created successfully. Please log in with your email and password.", "success");
        clearAuthHintsFromUrl();
    }

    const handledRedirect = await handleRedirectResult();
    if (handledRedirect) return;

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            await redirectForUser();
        }
    });
}

if (form) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        showMessage("", "info");

        try {
            if (mode === "signup") {
                setBusy(true, "Creating account...");
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

                const { user } = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(user, { displayName: name });
                await saveUserProfile(user, name);
                showMessage("Account created. Redirecting...", "success");
                await redirectForUser();
                return;
            }

            if (mode === "login") {
                setBusy(true, "Logging in...");
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

                const { user } = await signInWithEmailAndPassword(auth, email, password);
                await saveUserProfile(user);
                showMessage("Logged in. Redirecting...", "success");
                await redirectForUser();
            }
        } catch (error) {
            showMessage(authErrorMessage(error), "error");
        } finally {
            setBusy(false);
        }
    });
}

if (googleBtn) {
    const googleHelp = document.getElementById("google-auth-help");
    if (googleHelp) {
        googleHelp.textContent = "You'll be redirected to Google so you can choose the account you want to use.";
    }

    googleBtn.addEventListener("click", async () => {
        try {
            setBusy(true);
            showMessage("Redirecting to Google...", "info");
            await signInWithRedirect(auth, googleProvider);
        } catch (error) {
            showMessage(authErrorMessage(error), "error");
            setBusy(false);
        } finally {
            if (!document.hidden) {
                setBusy(false);
            }
        }
    });
}

bootSession();
