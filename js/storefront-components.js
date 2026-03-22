export function createNavbar(currentPath = "index.html") {
    const isWishlist = currentPath.includes("wishlist");
    const sectionBase = isWishlist ? "index.html" : "";

    return `
        <header class="site-shell">
            <nav class="navbar">
                <a class="brandmark" href="index.html" aria-label="Naamin home">
                    <span class="brandmark-glow"></span>
                    <span class="brandmark-word">Naam<span>in</span></span>
                </a>

                <button class="nav-toggle" id="nav-toggle" aria-label="Open navigation" aria-expanded="false">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div class="nav-panel" id="nav-panel">
                    <div class="nav-links">
                        <a href="index.html" class="${!isWishlist ? "is-active" : ""}">Home</a>
                        <a href="${sectionBase}#catalog">Names</a>
                        <a href="${sectionBase}#experience">Services</a>
                        <a href="${sectionBase}#footer-contact">Contact</a>
                    </div>

                    <div class="nav-actions">
                        <a href="wishlist.html" class="nav-icon-link ${isWishlist ? "is-active" : ""}" aria-label="Wishlist">
                            <i class="fa-solid fa-heart"></i>
                            <span id="wishlist-count-badge">0</span>
                        </a>
                        <a href="login.html" class="btn btn-secondary">Log in</a>
                        <a href="signup.html" class="btn btn-primary">Get Started</a>
                    </div>
                </div>
            </nav>
        </header>
    `;
}

export function createFooter(data) {
    const payload = data?.payload || {};
    const pills = Array.isArray(payload.pills) ? payload.pills : [];
    const quickLinks = Array.isArray(payload.quickLinks) ? payload.quickLinks : [];
    const socialLinks = Array.isArray(payload.socialLinks) ? payload.socialLinks : [];
    const contacts = Array.isArray(payload.contacts) ? payload.contacts : [];

    return `
        <footer class="footer" id="footer-contact">
            <div class="footer-shell">
                <div class="footer-top">
                    <div class="footer-brand-card">
                        <p class="footer-kicker">${data.eyebrow || "Naamin"}</p>
                        <h3>${data.title || ""}</h3>
                        <p class="footer-copy">${data.description || ""}</p>
                        <div class="footer-pill-row">
                            ${pills.map((pill) => `<span class="footer-pill">${pill}</span>`).join("")}
                        </div>
                        <div class="footer-cta-row">
                            <a href="${payload.primaryCta?.href || "signup.html"}" class="footer-mini-link">${payload.primaryCta?.label || "Start your journey"}</a>
                            <a href="${payload.secondaryCta?.href || "wishlist.html"}" class="footer-mini-link is-ghost">${payload.secondaryCta?.label || "Open shortlist"}</a>
                        </div>
                    </div>

                    <div class="footer-grid">
                        <div class="footer-column">
                            <p class="footer-kicker">Explore</p>
                            ${quickLinks.map((link) => `<a href="${link.href}">${link.label}</a>`).join("")}
                        </div>
                        <div class="footer-column">
                            <p class="footer-kicker">Social</p>
                            ${socialLinks.map((link) => `
                                <a class="footer-social-link" href="${link.href}" target="_blank" rel="noopener">
                                    <i class="${link.icon}"></i>
                                    <span>${link.label}</span>
                                </a>
                            `).join("")}
                        </div>
                        <div class="footer-column">
                            <p class="footer-kicker">Contact</p>
                            ${contacts.map((item) => item.href ? `
                                <a class="footer-contact-item" href="${item.href}">
                                    <i class="${item.icon}"></i>
                                    <span>${item.label}</span>
                                </a>
                            ` : `
                                <div class="footer-contact-item">
                                    <i class="${item.icon}"></i>
                                    <span>${item.label}</span>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                </div>

                <div class="footer-bottom">
                    <span>${payload.bottomLeft || "&copy; 2026 Naamin. All rights reserved."}</span>
                    <span>${payload.bottomRight || "Designed for a premium naming and gifting experience."}</span>
                </div>
            </div>
        </footer>
    `;
}

export function productCardTemplate(item, wishlisted) {
    const highlights = item.highlights.slice(0, 2).map((point) => `<span>${point}</span>`).join("");
    return `
        <article class="catalog-card" data-item-id="${item.id}">
            <button class="wishlist-button ${wishlisted ? "is-active" : ""}" data-action="wishlist" data-id="${item.id}" aria-label="${wishlisted ? "Remove from wishlist" : "Add to wishlist"}">
                <i class="${wishlisted ? "fa-solid" : "fa-regular"} fa-heart"></i>
            </button>
            <div class="catalog-card-media">
                <img src="${item.image}" alt="${item.title}" loading="lazy" decoding="async">
                <span class="catalog-badge">${item.badge}</span>
            </div>
            <div class="catalog-card-body">
                <div class="catalog-meta">
                    <span>${item.category}</span>
                    <span>${item.type}</span>
                </div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="catalog-highlights">${highlights}</div>
                <div class="catalog-footer-row">
                    <div>
                        <strong>${item.price}</strong>
                        <small>${item.tag}</small>
                    </div>
                    <button class="btn btn-card" data-action="details" data-id="${item.id}">View Details</button>
                </div>
            </div>
        </article>
    `;
}

export function detailModalTemplate(item, wishlisted) {
    return `
        <div class="modal-backdrop" data-close-modal></div>
        <div class="detail-modal" role="dialog" aria-modal="true" aria-label="${item.title}">
            <button class="modal-close" data-close-modal aria-label="Close details">
                <i class="fa-solid fa-xmark"></i>
            </button>
            <div class="detail-modal-media">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="detail-modal-content">
                <div class="detail-modal-head">
                    <div>
                        <p class="detail-kicker">${item.category} &middot; ${item.type}</p>
                        <h2>${item.title}</h2>
                    </div>
                    <button class="wishlist-button ${wishlisted ? "is-active" : ""}" data-action="wishlist" data-id="${item.id}" aria-label="${wishlisted ? "Remove from wishlist" : "Add to wishlist"}">
                        <i class="${wishlisted ? "fa-solid" : "fa-regular"} fa-heart"></i>
                    </button>
                </div>
                <p class="detail-copy">${item.details}</p>
                <div class="detail-grid">
                    <div>
                        <span>Price</span>
                        <strong>${item.price}</strong>
                    </div>
                    <div>
                        <span>Signature Tag</span>
                        <strong>${item.tag}</strong>
                    </div>
                    <div>
                        <span>Palette</span>
                        <strong>${item.accent}</strong>
                    </div>
                </div>
                <div class="detail-points">
                    ${item.highlights.map((point) => `<div><i class="fa-solid fa-check"></i><span>${point}</span></div>`).join("")}
                </div>
                <div class="detail-actions">
                    <a href="wishlist.html" class="btn btn-secondary">Open Wishlist</a>
                    <a href="contact.html" class="btn btn-primary">Book Naming Help</a>
                </div>
            </div>
        </div>
    `;
}
