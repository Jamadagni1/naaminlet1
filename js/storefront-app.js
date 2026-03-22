import { loadStorefrontData } from "./storefront-api.js";
import { createFooter, createNavbar, detailModalTemplate, productCardTemplate } from "./storefront-components.js";
import { mockSiteContent } from "./storefront-data.js";
import { hydrateSiteAuthNav } from "./site-auth.js";
import { getWishlist, isWishlisted, toggleWishlist } from "./storefront-store.js";

const app = document.getElementById("app");

const state = {
    allItems: [],
    filteredItems: [],
    category: "All",
    search: "",
    dataSource: "mock"
};

renderShell(mockSiteContent);
wireGlobalUi();
loadPage();

async function loadPage() {
    setLoading(true);
    try {
        const data = await loadStorefrontData();
        state.allItems = data.catalog;
        state.filteredItems = data.catalog;
        state.dataSource = data.source;
        applyManagedContent(data.sections);
        renderHighlights(data.highlights);
        renderTestimonials(data.testimonials);
        populateFilterOptions(data.catalog);
        renderCatalog();
        updateWishlistBadge();
        await hydrateSiteAuthNav();
        revealSections();
    } catch (error) {
        console.error(error);
        renderEmptyState("We couldn't load the catalog right now. Please refresh and try again.");
    } finally {
        setLoading(false);
    }
}

function renderShell(content) {
    const hero = content.hero;
    const highlights = content.highlights;
    const testimonials = content.testimonials;

    app.innerHTML = `
        ${createNavbar("index.html")}
        <main>
            <section class="hero" id="top">
                <div class="hero-grid">
                    <div class="hero-background-media">
                        <video class="hero-background-video" autoplay muted loop playsinline preload="metadata" poster="IMG3.jpeg">
                            <source src="assets/hero.mp4" type="video/mp4">
                        </video>
                        <div class="hero-background-overlay"></div>
                    </div>
                    <div class="hero-copy reveal-up">
                        <span class="eyebrow" id="hero-eyebrow">${hero.eyebrow}</span>
                        <h1 id="hero-title">${hero.title}</h1>
                        <p id="hero-description">${hero.description}</p>
                        <div class="hero-actions">
                            <a href="${hero.payload.primaryCta.href}" class="btn btn-primary" id="hero-primary-cta">${hero.payload.primaryCta.label}</a>
                            <a href="${hero.payload.secondaryCta.href}" class="btn btn-secondary" id="hero-secondary-cta">${hero.payload.secondaryCta.label}</a>
                        </div>
                        <div class="hero-metrics" id="hero-metrics"></div>
                    </div>
                    <div class="hero-visual reveal-up delay-1">
                        <div class="hero-floating-note">
                            <span id="hero-note-eyebrow">${hero.payload.note.eyebrow}</span>
                            <strong id="hero-note-title">${hero.payload.note.title}</strong>
                            <p id="hero-note-copy">${hero.payload.note.copy}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="proof-section reveal-up" id="experience">
                <div class="section-heading">
                    <span class="eyebrow" id="highlights-eyebrow">${highlights.eyebrow}</span>
                    <h2 id="highlights-title">${highlights.title}</h2>
                </div>
                <div class="proof-grid" id="highlights-grid"></div>
            </section>

            <section class="catalog-section reveal-up" id="catalog">
                <div class="section-heading section-heading-row">
                    <div>
                        <span class="eyebrow">Dynamic naming catalog</span>
                        <h2>Name packs, consultations, and keepsakes rendered dynamically.</h2>
                    </div>
                    <p class="section-note">Source: <strong id="data-source-indicator">Loading...</strong></p>
                </div>

                <div class="filter-bar">
                    <label class="search-field">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <input id="search-input" type="search" placeholder="Search names, services, or keepsakes">
                    </label>

                    <label class="filter-field">
                        <span>Category</span>
                        <select id="category-filter">
                            <option value="All">All</option>
                        </select>
                    </label>
                </div>

                <div id="catalog-loader" class="loader-state">
                    <div class="loader-spinner"></div>
                    <p>Loading curated naming collections...</p>
                </div>

                <div id="catalog-empty" class="empty-state" hidden>
                    <div class="empty-state-icon">
                        <i class="fa-regular fa-folder-open"></i>
                    </div>
                    <h3>No close matches yet</h3>
                    <p id="catalog-empty-copy">Try adjusting your search or switching to another category.</p>
                    <div class="empty-state-actions" id="catalog-empty-actions"></div>
                    <div class="empty-state-recommendations" id="catalog-empty-recommendations"></div>
                </div>

                <div id="catalog-grid" class="catalog-grid"></div>
            </section>

            <section class="testimonial-section reveal-up">
                <div class="section-heading">
                    <span class="eyebrow" id="testimonials-eyebrow">${testimonials.eyebrow}</span>
                    <h2 id="testimonials-title">${testimonials.title}</h2>
                </div>
                <div class="testimonial-grid" id="testimonial-grid"></div>
            </section>
        </main>
        <div id="footer-slot">${createFooter(content.footer)}</div>
        <div id="modal-root"></div>
        <div id="toast-root" class="toast-root" aria-live="polite" aria-atomic="true"></div>
    `;

    renderHeroMetrics(hero.payload.metrics);
}

function renderHeroMetrics(metrics = []) {
    const metricsRoot = document.getElementById("hero-metrics");
    if (!metricsRoot) return;

    metricsRoot.innerHTML = metrics.map((metric) => `
        <div>
            <strong>${metric.value}</strong>
            <span>${metric.label}</span>
        </div>
    `).join("");
}

function applyManagedContent(sections) {
    const hero = sections.hero || mockSiteContent.hero;
    const highlights = sections.highlights || mockSiteContent.highlights;
    const testimonials = sections.testimonials || mockSiteContent.testimonials;
    const footer = sections.footer || mockSiteContent.footer;

    document.getElementById("hero-eyebrow").textContent = hero.eyebrow || "";
    document.getElementById("hero-title").textContent = hero.title || "";
    document.getElementById("hero-description").textContent = hero.description || "";

    const primaryCta = hero.payload?.primaryCta || mockSiteContent.hero.payload.primaryCta;
    const secondaryCta = hero.payload?.secondaryCta || mockSiteContent.hero.payload.secondaryCta;
    const note = hero.payload?.note || mockSiteContent.hero.payload.note;

    const primaryLink = document.getElementById("hero-primary-cta");
    primaryLink.textContent = primaryCta.label;
    primaryLink.setAttribute("href", primaryCta.href);

    const secondaryLink = document.getElementById("hero-secondary-cta");
    secondaryLink.textContent = secondaryCta.label;
    secondaryLink.setAttribute("href", secondaryCta.href);

    document.getElementById("hero-note-eyebrow").textContent = note.eyebrow || "";
    document.getElementById("hero-note-title").textContent = note.title || "";
    document.getElementById("hero-note-copy").textContent = note.copy || "";

    renderHeroMetrics(hero.payload?.metrics || mockSiteContent.hero.payload.metrics);

    document.getElementById("highlights-eyebrow").textContent = highlights.eyebrow || "";
    document.getElementById("highlights-title").textContent = highlights.title || "";
    document.getElementById("testimonials-eyebrow").textContent = testimonials.eyebrow || "";
    document.getElementById("testimonials-title").textContent = testimonials.title || "";
    document.getElementById("footer-slot").innerHTML = createFooter(footer);
}

function wireGlobalUi() {
    document.addEventListener("click", (event) => {
        const navToggle = event.target.closest("#nav-toggle");
        if (navToggle) {
            toggleNav();
            return;
        }

        const detailButton = event.target.closest("[data-action='details']");
        if (detailButton) {
            const item = state.allItems.find((entry) => entry.id === detailButton.dataset.id);
            if (item) openModal(item);
            return;
        }

        const wishlistButton = event.target.closest("[data-action='wishlist']");
        if (wishlistButton) {
            const item = state.allItems.find((entry) => entry.id === wishlistButton.dataset.id);
            if (item) handleWishlistToggle(item);
            return;
        }

        const resetButton = event.target.closest("[data-action='reset-filters']");
        if (resetButton) {
            resetFilters();
            return;
        }

        const suggestionButton = event.target.closest("[data-action='quick-filter']");
        if (suggestionButton) {
            applyQuickFilter(suggestionButton.dataset.value, suggestionButton.dataset.filterType);
            return;
        }

        const recommendedButton = event.target.closest("[data-action='open-recommendation']");
        if (recommendedButton) {
            const item = state.allItems.find((entry) => entry.id === recommendedButton.dataset.id);
            if (item) openModal(item);
            return;
        }

        if (event.target.closest("[data-close-modal]")) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeModal();
    });

    document.addEventListener("wishlist:changed", () => {
        updateWishlistBadge();
        renderCatalog();
        syncModalWishlistState();
    });
}

function populateFilterOptions(items) {
    const select = document.getElementById("category-filter");
    const categories = [...new Set(items.map((item) => item.category))];
    select.innerHTML = `<option value="All">All</option>${categories.map((category) => `<option value="${category}">${category}</option>`).join("")}`;

    select.addEventListener("change", () => {
        state.category = select.value;
        applyFilters();
    });

    document.getElementById("search-input").addEventListener("input", (event) => {
        state.search = event.target.value.trim().toLowerCase();
        applyFilters();
    });
}

function applyFilters() {
    state.filteredItems = state.allItems.filter((item) => {
        const matchesCategory = state.category === "All" || item.category === state.category;
        const searchText = `${item.title} ${item.description} ${item.category} ${item.type}`.toLowerCase();
        const matchesSearch = !state.search || searchText.includes(state.search);
        return matchesCategory && matchesSearch;
    });

    renderCatalog();
}

function renderCatalog() {
    const grid = document.getElementById("catalog-grid");
    const empty = document.getElementById("catalog-empty");
    const sourceIndicator = document.getElementById("data-source-indicator");
    sourceIndicator.textContent = state.dataSource === "supabase" ? "Supabase" : "Mock API fallback";

    grid.innerHTML = state.filteredItems.map((item) => productCardTemplate(item, isWishlisted(item.id))).join("");
    updateEmptyState();
    empty.hidden = state.filteredItems.length !== 0;
    grid.setAttribute("aria-live", "polite");
}

function renderHighlights(items) {
    const grid = document.getElementById("highlights-grid");
    grid.innerHTML = items.map((item) => `
        <article class="proof-card">
            <i class="${item.icon}"></i>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
        </article>
    `).join("");
}

function renderTestimonials(items) {
    const grid = document.getElementById("testimonial-grid");
    grid.innerHTML = items.map((item) => `
        <article class="testimonial-card">
            <p>"${item.quote}"</p>
            <strong>${item.author}</strong>
            <span>${item.role}</span>
        </article>
    `).join("");
}

function setLoading(isLoading) {
    document.getElementById("catalog-loader").style.display = isLoading ? "grid" : "none";
}

function renderEmptyState(message) {
    const empty = document.getElementById("catalog-empty");
    empty.hidden = false;
    empty.querySelector("#catalog-empty-copy").textContent = message;
    updateEmptyState(message);
    document.getElementById("catalog-grid").innerHTML = "";
}

function updateEmptyState(customMessage = "") {
    const emptyCopy = document.getElementById("catalog-empty-copy");
    const actionsRoot = document.getElementById("catalog-empty-actions");
    const recommendationsRoot = document.getElementById("catalog-empty-recommendations");
    if (!emptyCopy || !actionsRoot || !recommendationsRoot) return;

    if (state.filteredItems.length) {
        emptyCopy.textContent = customMessage || "Try adjusting your search or switching to another category.";
        actionsRoot.innerHTML = "";
        recommendationsRoot.innerHTML = "";
        return;
    }

    emptyCopy.textContent = customMessage || buildEmptyMessage();
    actionsRoot.innerHTML = buildEmptyActions();
    recommendationsRoot.innerHTML = buildEmptyRecommendations();
}

function buildEmptyMessage() {
    if (state.search && state.category !== "All") {
        return `Nothing matched "${state.search}" in ${state.category}. Try a broader keyword or jump into one of the curated picks below.`;
    }

    if (state.search) {
        return `Nothing matched "${state.search}" yet. Try one of the popular naming routes below instead of starting over.`;
    }

    if (state.category !== "All") {
        return `There is nothing in ${state.category} right now. You can reset filters or explore another naming path below.`;
    }

    return "Try adjusting your search or switching to another category.";
}

function buildEmptyActions() {
    const actions = [
        `<button class="btn btn-secondary empty-state-btn" data-action="reset-filters">Show all collections</button>`
    ];

    if (state.search) {
        actions.push(`<button class="btn btn-secondary empty-state-btn" data-action="quick-filter" data-filter-type="search" data-value="">Clear search</button>`);
    }

    getSuggestionChips().forEach((chip) => {
        actions.push(`
            <button class="empty-suggestion-chip" data-action="quick-filter" data-filter-type="${chip.type}" data-value="${chip.value}">
                ${chip.label}
            </button>
        `);
    });

    return actions.join("");
}

function getSuggestionChips() {
    const suggestions = [];
    const categories = [...new Set(state.allItems.map((item) => item.category))];

    if (state.category !== "All") {
        suggestions.push({ type: "category", value: "All", label: "Browse all" });
    }

    ["Boy Names", "Girl Names", "Services", "Gifting"].forEach((category) => {
        if (categories.includes(category) && category !== state.category) {
            suggestions.push({ type: "category", value: category, label: category });
        }
    });

    if (state.search) {
        const keywordSuggestions = [
            { type: "search", value: "vedic", label: "Try: vedic" },
            { type: "search", value: "shortlist", label: "Try: shortlist" },
            { type: "search", value: "poster", label: "Try: poster" }
        ];
        keywordSuggestions.forEach((entry) => suggestions.push(entry));
    }

    return suggestions.slice(0, 5);
}

function buildEmptyRecommendations() {
    const recommendedItems = getRecommendedItems();
    if (!recommendedItems.length) return "";

    return `
        <div class="empty-recommendations-head">
            <span class="eyebrow">Better starting points</span>
            <strong>Popular picks parents usually open next</strong>
        </div>
        <div class="empty-recommendation-grid">
            ${recommendedItems.map((item) => `
                <article class="empty-recommendation-card">
                    <img src="${item.image}" alt="${item.title}" loading="lazy" decoding="async">
                    <div>
                        <p>${item.category}</p>
                        <h4>${item.title}</h4>
                        <span>${item.tag}</span>
                    </div>
                    <button class="btn btn-card" data-action="open-recommendation" data-id="${item.id}">View details</button>
                </article>
            `).join("")}
        </div>
    `;
}

function getRecommendedItems() {
    if (!state.allItems.length) return [];

    const categoryMatches = state.category === "All"
        ? []
        : state.allItems.filter((item) => item.category === state.category);

    const pool = categoryMatches.length ? categoryMatches : state.allItems;
    return pool.slice(0, 3);
}

function resetFilters() {
    state.category = "All";
    state.search = "";

    const categoryFilter = document.getElementById("category-filter");
    const searchInput = document.getElementById("search-input");

    if (categoryFilter) categoryFilter.value = "All";
    if (searchInput) searchInput.value = "";

    applyFilters();
}

function applyQuickFilter(value = "", filterType = "search") {
    if (filterType === "category") {
        state.category = value || "All";
        const categoryFilter = document.getElementById("category-filter");
        if (categoryFilter) categoryFilter.value = state.category;
    } else {
        state.search = (value || "").toLowerCase();
        const searchInput = document.getElementById("search-input");
        if (searchInput) searchInput.value = value || "";
    }

    applyFilters();
}

function openModal(item) {
    const modalRoot = document.getElementById("modal-root");
    modalRoot.innerHTML = detailModalTemplate(item, isWishlisted(item.id));
    document.body.classList.add("modal-open");
}

function closeModal() {
    document.getElementById("modal-root").innerHTML = "";
    document.body.classList.remove("modal-open");
}

function handleWishlistToggle(item) {
    const result = toggleWishlist(item);
    showToast(result.added ? `${item.title} added to shortlist` : `${item.title} removed from shortlist`);
}

function syncModalWishlistState() {
    const activeButton = document.querySelector("#modal-root [data-action='wishlist']");
    if (!activeButton) return;

    const itemId = activeButton.dataset.id;
    const active = isWishlisted(itemId);
    activeButton.classList.toggle("is-active", active);
    activeButton.setAttribute("aria-label", active ? "Remove from wishlist" : "Add to wishlist");
    activeButton.innerHTML = `<i class="${active ? "fa-solid" : "fa-regular"} fa-heart"></i>`;
}

function updateWishlistBadge() {
    const badge = document.getElementById("wishlist-count-badge");
    if (badge) badge.textContent = getWishlist().length;
}

function toggleNav() {
    const panel = document.getElementById("nav-panel");
    const button = document.getElementById("nav-toggle");
    const nextExpanded = !panel.classList.contains("is-open");
    panel.classList.toggle("is-open", nextExpanded);
    button.setAttribute("aria-expanded", String(nextExpanded));
}

function revealSections() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.16 });

    document.querySelectorAll(".reveal-up").forEach((element) => observer.observe(element));
}

function showToast(message) {
    const toastRoot = document.getElementById("toast-root");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toastRoot.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("is-visible"));
    window.setTimeout(() => {
        toast.classList.remove("is-visible");
        window.setTimeout(() => toast.remove(), 250);
    }, 2200);
}
