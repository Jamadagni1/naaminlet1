import { createFooter, createNavbar, productCardTemplate } from "./storefront-components.js";
import { mockSiteContent } from "./storefront-data.js";
import { clearWishlist, getWishlist, removeWishlistItem } from "./storefront-store.js";

const root = document.getElementById("wishlist-app");

renderShell();
renderWishlist();
wireWishlistPage();

function renderShell() {
    root.innerHTML = `
        ${createNavbar("wishlist.html")}
        <main class="wishlist-page">
            <section class="wishlist-hero reveal-up is-visible">
                <span class="eyebrow">Saved shortlist</span>
                <h1>Your favorite names, services, and keepsakes in one place.</h1>
                <p>Review saved picks, remove them instantly, and continue your naming journey without losing context.</p>
                <div class="wishlist-actions">
                    <a href="index.html" class="btn btn-secondary">Back to Names</a>
                    <button id="clear-wishlist" class="btn btn-primary">Clear Shortlist</button>
                </div>
            </section>

            <section class="wishlist-content">
                <div id="wishlist-empty-state" class="empty-state" hidden>
                    <i class="fa-regular fa-heart"></i>
                    <h3>Your shortlist is empty</h3>
                    <p>Start saving names and services from the homepage and they’ll show up here instantly.</p>
                </div>
                <div id="wishlist-grid" class="catalog-grid"></div>
            </section>
        </main>
        ${createFooter(mockSiteContent.footer)}
        <div id="toast-root" class="toast-root" aria-live="polite" aria-atomic="true"></div>
    `;
}

function wireWishlistPage() {
    document.addEventListener("click", (event) => {
        const navToggle = event.target.closest("#nav-toggle");
        if (navToggle) {
            const panel = document.getElementById("nav-panel");
            const button = document.getElementById("nav-toggle");
            const nextExpanded = !panel.classList.contains("is-open");
            panel.classList.toggle("is-open", nextExpanded);
            button.setAttribute("aria-expanded", String(nextExpanded));
            return;
        }

        if (event.target.closest("#clear-wishlist")) {
            clearWishlist();
            renderWishlist();
            showToast("Shortlist cleared");
            return;
        }

        const wishlistButton = event.target.closest("[data-action='wishlist']");
        if (wishlistButton) {
            removeWishlistItem(wishlistButton.dataset.id);
            renderWishlist();
            showToast("Removed from shortlist");
        }
    });

    document.addEventListener("wishlist:changed", () => {
        const badge = document.getElementById("wishlist-count-badge");
        if (badge) badge.textContent = getWishlist().length;
    });
}

function renderWishlist() {
    const items = getWishlist();
    const grid = document.getElementById("wishlist-grid");
    const empty = document.getElementById("wishlist-empty-state");
    const badge = document.getElementById("wishlist-count-badge");

    if (badge) badge.textContent = items.length;

    empty.hidden = items.length !== 0;
    grid.innerHTML = items.map((item) => productCardTemplate(item, true)).join("");
}

function showToast(message) {
    const toastRoot = document.getElementById("toast-root");
    const toast = document.createElement("div");
    toast.className = "toast is-visible";
    toast.textContent = message;
    toastRoot.appendChild(toast);
    window.setTimeout(() => {
        toast.classList.remove("is-visible");
        window.setTimeout(() => toast.remove(), 240);
    }, 1800);
}
