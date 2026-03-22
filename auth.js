import { supabase } from "./js/supabase-client.js";

const form = document.querySelector("form");
const messageEl = document.getElementById("auth-message");
const mode = document.body?.dataset?.auth || "";

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

function pageUrl(fileName) {
    return new URL(fileName, window.location.href).toString();
}

async function isAdminUser(userId) {
    const { data, error } = await supabase.from("admin_users").select("user_id").eq("user_id", userId).maybeSingle();
    if (error) {
        console.error(error);
        return false;
    }
    return Boolean(data);
}

async function redirectForUser(user) {
    const isAdmin = await isAdminUser(user.id);
    window.location.href = isAdmin ? "admin.html" : "index.html";
}

async function bootSession() {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (user) {
        await redirectForUser(user);
    }
}

function authErrorMessage(error) {
    const code = error?.code || "";
    switch (code) {
        case "email_exists":
        case "user_already_exists":
            return "This email already exists. Please log in instead.";
        case "invalid_credentials":
            return "Invalid email or password.";
        case "weak_password":
            return "Password must be at least 8 characters.";
        default:
            return error?.message || "Something went wrong. Please try again.";
    }
}

if (form) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        showMessage("", "info");

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

                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: name },
                        emailRedirectTo: pageUrl("login.html")
                    }
                });

                if (error) throw error;

                if (data.session?.user) {
                    showMessage("Account created. Redirecting...", "success");
                    await redirectForUser(data.session.user);
                    return;
                }

                showMessage("Account created. Please verify your email before logging in.", "success");
            }

            if (mode === "login") {
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

                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;

                showMessage("Logged in. Redirecting...", "success");
                await redirectForUser(data.user);
            }
        } catch (error) {
            showMessage(authErrorMessage(error), "error");
        }
    });
}

const googleBtn = document.getElementById("google-auth-btn");
if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
        showMessage("Redirecting to Google...", "info");
        const redirectTarget = mode === "signup" ? "signup.html" : "login.html";

        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: pageUrl(redirectTarget)
            }
        });

        if (error) {
            showMessage(authErrorMessage(error), "error");
        }
    });
}

bootSession();
