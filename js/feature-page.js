import { loadFeaturePage, loadStorefrontData } from "./storefront-api.js";
import { createFooter, createNavbar } from "./storefront-components.js";
import { mockSiteContent } from "./storefront-data.js";
import { hydrateSiteAuthNav } from "./site-auth.js";
import { getWishlist } from "./storefront-store.js";

const app = document.getElementById("feature-app");
const pageSlug = document.body?.dataset?.featurePage || "aura";

boot();

async function boot() {
    renderLoadingShell();
    wireUi();

    try {
        const [siteData, featureData] = await Promise.all([
            loadStorefrontData(),
            loadFeaturePage(pageSlug)
        ]);

        const footer = siteData.sections?.footer || mockSiteContent.footer;
        renderFeaturePage(featureData.page, featureData.source, footer);
        updateWishlistBadge();
        await hydrateSiteAuthNav();
        revealSections();
    } catch (error) {
        console.error(error);
        renderErrorShell();
        updateWishlistBadge();
    }
}

function renderLoadingShell() {
    app.innerHTML = `
        ${createNavbar("pricing.html")}
        <main class="feature-page-shell">
            <section class="feature-hero reveal-up is-visible">
                <div class="feature-hero-copy">
                    <span class="eyebrow">Loading Aura</span>
                    <h1>Preparing your premium naming experience.</h1>
                    <p>We are pulling in the latest Aura content right now.</p>
                </div>
            </section>
            <section class="catalog-section">
                <div class="loader-state">
                    <div class="loader-spinner"></div>
                    <p>Loading Aura page...</p>
                </div>
            </section>
        </main>
        ${createFooter(mockSiteContent.footer)}
    `;
}

function renderErrorShell() {
    app.innerHTML = `
        ${createNavbar("pricing.html")}
        <main class="feature-page-shell">
            <section class="feature-hero reveal-up is-visible">
                <div class="feature-hero-copy">
                    <span class="eyebrow">Aura</span>
                    <h1>We could not load Aura right now.</h1>
                    <p>Please refresh the page or try again shortly.</p>
                    <div class="hero-actions">
                        <a href="index.html" class="btn btn-secondary">Back to Home</a>
                        <a href="signup.html" class="btn btn-primary">Create account</a>
                    </div>
                </div>
            </section>
        </main>
        ${createFooter(mockSiteContent.footer)}
    `;
}

function renderFeaturePage(page, source, footer) {
    const payload = page.payload || {};
    const stats = Array.isArray(payload.stats) ? payload.stats : [];
    const pillars = Array.isArray(payload.pillars) ? payload.pillars : [];
    const plans = Array.isArray(payload.plans) ? payload.plans : [];
    const process = Array.isArray(payload.process) ? payload.process : [];
    const faq = Array.isArray(payload.faq) ? payload.faq : [];
    const spotlight = payload.spotlight || {};
    const primaryCta = payload.primaryCta || { label: "Get Started", href: "signup.html" };
    const secondaryCta = payload.secondaryCta || { label: "Back to home", href: "index.html" };

    app.innerHTML = `
        ${createNavbar("pricing.html")}
        <main class="feature-page-shell">
            <section class="feature-hero reveal-up" id="top">
                <div class="feature-hero-grid">
                    <div class="feature-hero-copy">
                        <span class="eyebrow">${page.eyebrow || "Aura"}</span>
                        <h1>${page.title}</h1>
                        <p>${page.description}</p>
                        <div class="hero-actions">
                            <a href="${primaryCta.href}" class="btn btn-primary">${primaryCta.label}</a>
                            <a href="${secondaryCta.href}" class="btn btn-secondary">${secondaryCta.label}</a>
                        </div>
                    </div>

                    <div class="feature-hero-panel">
                        <div class="feature-source-pill">Source: ${source === "supabase" ? "Supabase" : "Mock fallback"}</div>
                        <div class="feature-spotlight-card">
                            <span>${spotlight.eyebrow || "Included in Aura"}</span>
                            <strong>${spotlight.title || "Guided naming support"}</strong>
                            <p>${spotlight.copy || "Expert direction, shortlists, and presentation support."}</p>
                        </div>
                        <div class="feature-stat-grid">
                            ${stats.map((stat) => `
                                <div class="feature-stat-card">
                                    <strong>${stat.value}</strong>
                                    <span>${stat.label}</span>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                </div>
            </section>

            <section class="proof-section reveal-up" id="aura-benefits">
                <div class="section-heading">
                    <span class="eyebrow">Why Aura</span>
                    <h2>Built for parents who want guidance, not guesswork.</h2>
                </div>
                <div class="proof-grid">
                    ${pillars.map((item) => `
                        <article class="proof-card feature-proof-card">
                            <i class="${item.icon || "fa-solid fa-star"}"></i>
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                        </article>
                    `).join("")}
                </div>
            </section>

            <section class="catalog-section reveal-up" id="aura-plans">
                <div class="section-heading section-heading-row">
                    <div>
                        <span class="eyebrow">Aura plans</span>
                        <h2>Choose the level of guidance that fits your naming journey.</h2>
                    </div>
                    <p class="section-note">Each route can start simple and move deeper when your shortlist gets serious.</p>
                </div>
                <div class="feature-plan-grid">
                    ${plans.map((plan) => `
                        <article class="feature-plan-card">
                            <span class="feature-plan-badge">${plan.badge || "Aura"}</span>
                            <h3>${plan.name}</h3>
                            <strong>${plan.price}</strong>
                            <p>${plan.description}</p>
                            <div class="feature-plan-points">
                                ${(Array.isArray(plan.features) ? plan.features : []).map((point) => `<div><i class="fa-solid fa-check"></i><span>${point}</span></div>`).join("")}
                            </div>
                            <a href="${primaryCta.href}" class="btn btn-primary">Choose this plan</a>
                        </article>
                    `).join("")}
                </div>
            </section>

            <section class="proof-section reveal-up" id="aura-process">
                <div class="section-heading">
                    <span class="eyebrow">How it works</span>
                    <h2>Aura keeps the naming journey structured from first thought to final shortlist.</h2>
                </div>
                <div class="feature-process-grid">
                    ${process.map((item) => `
                        <article class="feature-process-card">
                            <span>${item.step}</span>
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                        </article>
                    `).join("")}
                </div>
            </section>

            <section class="testimonial-section reveal-up" id="aura-faq">
                <div class="section-heading">
                    <span class="eyebrow">Questions</span>
                    <h2>Common things parents ask before choosing Aura.</h2>
                </div>
                <div class="feature-faq-list">
                    ${faq.map((item, index) => `
                        <article class="feature-faq-item ${index === 0 ? "is-open" : ""}">
                            <button class="feature-faq-trigger" type="button" data-action="toggle-faq" aria-expanded="${index === 0 ? "true" : "false"}">
                                <span>${item.question}</span>
                                <i class="fa-solid fa-plus"></i>
                            </button>
                            <div class="feature-faq-answer">
                                <p>${item.answer}</p>
                            </div>
                        </article>
                    `).join("")}
                </div>
            </section>
        </main>
        ${createFooter(footer)}
    `;
}

function wireUi() {
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

        const faqTrigger = event.target.closest("[data-action='toggle-faq']");
        if (faqTrigger) {
            const item = faqTrigger.closest(".feature-faq-item");
            const nextExpanded = !item.classList.contains("is-open");
            item.classList.toggle("is-open", nextExpanded);
            faqTrigger.setAttribute("aria-expanded", String(nextExpanded));
        }
    });
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

function updateWishlistBadge() {
    const badge = document.getElementById("wishlist-count-badge");
    if (badge) badge.textContent = getWishlist().length;
}
