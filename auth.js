import { isSupabaseConfigured, supabase } from "./supabase-config.js";

const ADMIN_EMAILS = [
  // "admin@example.com"
];

const ADMIN_REDIRECT = "admin.html";
const USER_REDIRECT = "index.html";

const form = document.querySelector("form");
const messageEl = document.getElementById("auth-message");
const mode = document.body?.dataset?.auth || "";
const isAuthScreen = mode === "login" || mode === "signup";

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

const getUrlParam = (key) => {
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has(key)) {
    return searchParams.get(key);
  }

  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;
  const hashParams = new URLSearchParams(hash);
  return hashParams.get(key);
};

const hasAuthCallbackParams = () => {
  return [
    "access_token",
    "refresh_token",
    "token_type",
    "expires_in",
    "expires_at",
    "provider_token",
    "provider_refresh_token",
    "code"
  ].some((key) => Boolean(getUrlParam(key)));
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

const isMissingSessionError = (err) => {
  const message = String(err?.message || "").toLowerCase();
  return (
    err?.name === "AuthSessionMissingError" ||
    message.includes("auth session missing")
  );
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
      const redirectTo = getAuthReturnUrl();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            prompt: "select_account"
          },
          skipBrowserRedirect: true
        }
      });
      if (error) throw error;

      if (!data?.url) {
        throw new Error("Google sign-in could not be started.");
      }

      window.location.assign(data.url);
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

  const hasCallbackParams = hasAuthCallbackParams();
  const authError = getUrlParam("error_description") || getUrlParam("error");
  if (authError) {
    showMessage(decodeURIComponent(authError), "error");
    clearAuthParamsFromUrl();
    return;
  }

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    if (isMissingSessionError(error)) {
      return;
    }
    showMessage(handleAuthError(error), "error");
    return;
  }

  const user = data.session?.user || null;
  const authGate = document.querySelector("[data-auth-gate]");

  if (authGate) {
    if (!user) {
      authGate.textContent = "Please log in to continue.";
    } else {
      const role = await getUserRole(user);
      authGate.textContent = `Signed in as ${user.email} (${role})`;
    }
  }

  if (user && isAuthScreen && hasCallbackParams) {
    const role = await getUserRole(user);
    clearAuthParamsFromUrl();
    safeRedirect(role);
    return;
  }

  if (user && isAuthScreen) {
    showMessage(`Already signed in as ${user.email}.`, "success");
  }
};

supabase.auth.onAuthStateChange(async (event, session) => {
  const authGate = document.querySelector("[data-auth-gate]");
  if (session?.user && isAuthScreen && hasAuthCallbackParams()) {
    const role = await getUserRole(session.user);
    clearAuthParamsFromUrl();
    safeRedirect(role);
    return;
  }

  if (!authGate) return;

  if (!session?.user) {
    authGate.textContent = "Please log in to continue.";
    return;
  }

  const role = await getUserRole(session.user);
  authGate.textContent = `Signed in as ${session.user.email} (${role})`;
});

syncAuthUi();
