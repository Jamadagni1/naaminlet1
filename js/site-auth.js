import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

function guestMarkup() {
    return `
        <a href="login.html" class="btn btn-secondary">Log in</a>
        <a href="signup.html" class="btn btn-primary">Get Started</a>
    `;
}

function signedInMarkup() {
    return `
        <a href="wishlist.html" class="btn btn-secondary">My Shortlist</a>
        <button type="button" class="btn btn-primary" id="nav-sign-out-btn">Log out</button>
    `;
}

function renderNavState(navActions, isSignedIn) {
    const existingButtons = [...navActions.querySelectorAll("a.btn, button.btn")];
    existingButtons.forEach((element) => element.remove());
    navActions.querySelector(".nav-auth-slot")?.remove();

    if (!isSignedIn) {
        navActions.insertAdjacentHTML("beforeend", guestMarkup());
        return;
    }

    const slot = document.createElement("div");
    slot.className = "nav-auth-slot";
    slot.innerHTML = signedInMarkup();
    navActions.appendChild(slot);

    const signOutBtn = document.getElementById("nav-sign-out-btn");
    if (signOutBtn) {
        signOutBtn.addEventListener("click", async () => {
            await signOut(auth);
            renderNavState(navActions, false);
            window.location.href = "index.html";
        });
    }
}

export function hydrateSiteAuthNav() {
    const navActions = document.querySelector(".nav-actions");
    if (!navActions) return;

    onAuthStateChanged(auth, (user) => {
        renderNavState(navActions, Boolean(user));
    });
}
