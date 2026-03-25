import { isSupabaseConfigured, supabase } from "./supabase-config.js";

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

const isConfigPlaceholder = () => !isSupabaseConfigured();

const normalizeRole = (email) => {
  if (!email) return "user";
  return ADMIN_EMAILS.includes(email.toLowerCase()) ? "admin" : "user";
};

const validateEmail = (email) => emailRegex.test(email);

const validatePassword = (password) => String(password).length >= 8;

const getUserRole = async (user) => normalizeRole(user?.email);

const getAuthReturnUrl = () => {
  return new URL(window.location.pathname, window.location.origin).toString();
};

const clearAuthParamsFromUrl = () => {
  if (!window.location.search && !window.location.hash) return;
  window.history.replaceState({}, document.title, window.location.pathname);
};

const safeRedirect = (role) => {
  const target = role === "admin" ? ADMIN_REDIRECT : USER_REDIRECT;
  if (role === "admin") {
    fetch(target, { method: "HEAD" })
      .then((res) => {
        window.location.href = res.ok ? target : USER_REDIRECT;
      })
      .catch(() => {
        window.location.href = USER_REDIRECT;
      });
  } else {
    window.location.href = USER_REDIRECT;
  }
};

const handleAuthError = (err) => {
  const code = err?.code || "";
  const message = String(err?.message || "").toLowerCase();

  switch (code) {
    case "user_already_exists":
      return "Email already exists. Please log in instead.";
    case "validation_failed":
      return "Invalid email format.";
    case "invalid_credentials":
      return "Invalid credentials. Please try again.";
    default:
      if (message.includes("user already registered")) {
        return "Email already exists. Please log in instead.";
      }
      if (message.includes("invalid login credentials")) {
        return "Invalid email or password. Please try again.";
      }
      if (message.includes("email not confirmed")) {
        return "Please confirm your email first, then log in.";
      }
      if (message.includes("password should be at least")) {
        return "Password should be at least 8 characters.";
      }
      if (message.includes("provider is not enabled")) {
        return "Google sign-in is not enabled for this Supabase project.";
      }
      if (message.includes("failed to fetch")) {
        return "Network error. Please check your connection and try again.";
      }
      return err?.message || "Something went wrong. Please try again.";
  }
};

if (isConfigPlaceholder()) {
  showMessage(
    "Supabase config is missing. Update supabase-config.js with your project keys.",
    "error"
  );
}

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showMessage("", "info");

    if (isConfigPlaceholder()) {
      showMessage(
        "Please set Supabase keys in supabase-config.js before continuing.",
        "error"
      );
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

        const role = normalizeRole(email);
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              role
            },
            emailRedirectTo: getAuthReturnUrl()
          }
        });
        if (error) throw error;

        if (data.session?.user) {
          showMessage("Account created successfully. Redirecting...", "success");
          safeRedirect(role);
          return;
        }

        showMessage(
          "Account created. Please check your email to confirm your account.",
          "success"
        );
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

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;

        const role = await getUserRole(data.user);
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
      showMessage(
        "Please set Supabase keys in supabase-config.js before continuing.",
        "error"
      );
      return;
    }

    try {
      showMessage("Redirecting to Google...", "success");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getAuthReturnUrl()
        }
      });
      if (error) throw error;
    } catch (err) {
      showMessage(handleAuthError(err), "error");
    }
  });
}

const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await supabase.auth.signOut({ scope: "local" });
    window.location.href = USER_REDIRECT;
  });
}

const syncAuthUi = async () => {
  if (isConfigPlaceholder()) return;

  const params = new URLSearchParams(window.location.search);
  const authError = params.get("error_description") || params.get("error");
  if (authError) {
    showMessage(decodeURIComponent(authError), "error");
    clearAuthParamsFromUrl();
  }

  const { data, error } = await supabase.auth.getUser();
  if (error) {
    showMessage(handleAuthError(error), "error");
    return;
  }

  const user = data.user || null;
  const authGate = document.querySelector("[data-auth-gate]");

  if (authGate) {
    if (!user) {
      authGate.textContent = "Please log in to continue.";
    } else {
      const role = await getUserRole(user);
      authGate.textContent = `Signed in as ${user.email} (${role})`;
    }
  }

  if (user && (mode === "login" || mode === "signup")) {
    const role = await getUserRole(user);
    clearAuthParamsFromUrl();
    safeRedirect(role);
  }
};

supabase.auth.onAuthStateChange(async (_event, session) => {
  const authGate = document.querySelector("[data-auth-gate]");
  if (!authGate) return;

  if (!session?.user) {
    authGate.textContent = "Please log in to continue.";
    return;
  }

  const role = await getUserRole(session.user);
  authGate.textContent = `Signed in as ${session.user.email} (${role})`;
});

syncAuthUi();
