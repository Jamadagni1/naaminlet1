(function () {
    console.log("Navbar Fix Script Loaded");

    function getFavoritesCount() {
        try {
            const raw = localStorage.getItem("favorites");
            if (!raw) return 0;
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed.length : 0;
        } catch (_e) {
            return 0;
        }
    }

    function syncNavbarFavoritesCount() {
        const count = getFavoritesCount();
        document.querySelectorAll("#fav-count, #fav-count-mobile").forEach(el => {
            el.textContent = String(count);
            el.style.display = "inline-flex";
        });
    }

    function getLang() {
        return localStorage.getItem("language") || "en";
    }

    function applyNavbarTranslation() {
        const lang = getLang();
        console.log("Navbar Fix: Applying translation for", lang);

        const WIN1252_REVERSE = {
            8364: 128, 8218: 130, 402: 131, 8222: 132, 8230: 133, 8224: 134, 8225: 135,
            710: 136, 8240: 137, 352: 138, 8249: 139, 338: 140, 381: 142,
            8216: 145, 8217: 146, 8220: 147, 8221: 148, 8226: 149, 8211: 150, 8212: 151,
            732: 152, 8482: 153, 353: 154, 8250: 155, 339: 156, 382: 158, 376: 159
        };

        function normalizeMaybeMojibake(text) {
            if (!text) return text;
            if (!/(?:Â|Ã|â|à¤|à¥)/.test(text)) return text;

            try {
                const bytes = new Uint8Array(text.length);
                for (let i = 0; i < text.length; i++) {
                    const code = text.charCodeAt(i);
                    if (code <= 255) {
                        bytes[i] = code;
                        continue;
                    }
                    const mapped = WIN1252_REVERSE[code];
                    if (mapped === undefined) return text;
                    bytes[i] = mapped;
                }

                const decoded = new TextDecoder('utf-8').decode(bytes);
                if (!decoded || decoded === text) return text;
                if (decoded.includes('�')) return text;

                const devanagariCount = (decoded.match(/[\u0900-\u097F]/g) || []).length;
                if (devanagariCount > 0) return decoded;
                if (/(?:Â|Ã|â)/.test(text) && !/(?:Â|Ã|â)/.test(decoded)) return decoded;
                return text;
            } catch (_e) {
                return text;
            }
        }

        document.querySelectorAll(".navbar [data-en]").forEach(el => {
            const raw = el.getAttribute(lang === "hi" ? "data-hi" : "data-en");
            const text = normalizeMaybeMojibake(raw);

            // Special handling for "More" dropdown to preserve the arrow
            if (el.classList.contains("dropdown-toggle") || el.classList.contains("mobile-dropdown-toggle")) {
                // Check if arrow exists
                const arrow = el.querySelector(".arrow");
                if (text) {
                    // Update text node safely
                    let textNode = null;
                    for (let i = 0; i < el.childNodes.length; i++) {
                        if (el.childNodes[i].nodeType === 3 && el.childNodes[i].nodeValue.trim().length > 0) {
                            textNode = el.childNodes[i];
                            break;
                        }
                    }

                    if (textNode) {
                        textNode.nodeValue = text + " ";
                    } else if (!arrow) {
                        el.innerHTML = `${text} <span class="arrow">▼</span>`;
                    } else {
                        const newText = document.createTextNode(text + " ");
                        el.insertBefore(newText, el.firstChild);
                    }
                }
            } else {
                // Standard links
                if (text) el.textContent = text;
            }
        });
        // Platform-wide nav updates + footer standardization
        if (!window.__naaminPlatformBrandingApplied) {
            window.__naaminPlatformBrandingApplied = true;

            document.querySelectorAll('a[href*="motto-for-everything"]').forEach(a => {
                a.setAttribute('data-en', 'Motto Creator');
                a.setAttribute('data-hi', 'Motto Creator');
                if (!a.querySelector('*')) a.textContent = 'Motto Creator';
            });

            document.querySelectorAll('a[href$="product.html"]').forEach(a => {
                a.setAttribute('data-en', 'Our Products');
                a.setAttribute('data-hi', 'Our Products');
                if (!a.querySelector('*')) a.textContent = 'Our Products';
            });

            document.querySelectorAll('a[href$="pricing.html"]').forEach(a => {
                a.classList.add('nav-hidden');
            });

            // Determine correct relative path for services page links
            const servicesNavLink = document.querySelector('a[href$="services.html"]');
            const servicesBase = servicesNavLink ? (servicesNavLink.getAttribute('href') || 'services.html').replace(/#.*$/, '') : 'services.html';

            const isInMore = window.location.pathname.includes("/more/");
            const rootPrefix = isInMore ? "../" : "";
            const domainHref = isInMore
                ? "../domain-name-creator/index.html"
                : "more/domain-name-creator/index.html";

            // Update footer "Our Services" column (if present)
            document.querySelectorAll('footer .footer-grid').forEach(grid => {
                const columns = Array.from(grid.children || []);
                const servicesCol = columns.find(col => {
                    const h = col.querySelector('h3');
                    if (!h) return false;
                    const en = (h.getAttribute('data-en') || h.textContent || '').trim().toLowerCase();
                    return en === 'our services';
                });
                if (!servicesCol) return;
                servicesCol.querySelectorAll('a').forEach(a => a.remove());

                const links = [
                    { href: `${servicesBase}#consultation`, en: 'Name Consultation', hi: 'Name Consultation' },
                    { href: `${servicesBase}#brand`, en: 'Brand & Startup Naming', hi: 'Brand & Startup Naming' },
                    { href: `${servicesBase}#company`, en: 'Company & Institution Naming', hi: 'Company & Institution Naming' },
                    { href: domainHref, en: 'Domain Name Creator', hi: 'Domain Name Creator' },
                    { href: `${rootPrefix}more/motto-for-everything/index.html`, en: 'Motto Creator', hi: 'Motto Creator' },
                    { href: `${rootPrefix}name-report.html`, en: 'Name Report', hi: 'Name Report' },
                    { href: `${rootPrefix}product.html`, en: 'Our Products', hi: 'Our Products' }
                ];
                links.forEach(l => {
                    const a = document.createElement('a');
                    a.href = l.href;
                    a.setAttribute('data-en', l.en);
                    a.setAttribute('data-hi', l.hi);
                    a.textContent = l.en;
                    servicesCol.appendChild(a);
                });
            });
        }

        // NUCLEAR OPTION: Global Capture Phase Listener
        // This runs BEFORE any other click listeners on the page.
        // It guarantees we catch the click on the dropdown toggle.
        if (!window.navbarFixListenerAttached) {
            document.addEventListener('click', function (e) {
                // Check if we clicked a dropdown toggle
                const toggle = e.target.closest('.dropdown-toggle, .mobile-dropdown-toggle');

                if (toggle) {
                    console.log("Navbar Fix: Capture Phase Click Detected on", toggle);

                    e.preventDefault();
                    e.stopPropagation(); // Stop anyone else from messing with it

                    // Desktop
                    const li = toggle.closest('.dropdown');
                    if (li) {
                        const wasOpen = li.classList.contains('open');
                        // Close all others first (optional, but good behavior)
                        document.querySelectorAll('.dropdown.open').forEach(d => {
                            if (d !== li) d.classList.remove('open');
                        });

                        // Toggle current
                        if (wasOpen) li.classList.remove('open');
                        else li.classList.add('open');
                    }

                    // Mobile
                    const mLi = toggle.closest('.mobile-dropdown');
                    if (mLi) {
                        const wasOpen = mLi.classList.contains('open');
                        if (wasOpen) mLi.classList.remove('open');
                        else mLi.classList.add('open');
                    }
                }
            }, true); // TRUE = Capture Phase (Runs top-down, first!)

            // Also handle document closing for outside clicks (Bubble phase is fine)
            document.addEventListener('click', function (e) {
                if (!e.target.closest('.dropdown') && !e.target.closest('.mobile-dropdown')) {
                    document.querySelectorAll('.dropdown.open, .mobile-dropdown.open').forEach(d => {
                        d.classList.remove('open');
                    });
                }
            });

            window.navbarFixListenerAttached = true;
            console.log("Navbar Fix: Global Capture Listener Attached");
        }
    }

    // Run on load
    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(applyNavbarTranslation, 500); // 500ms delay to be safe
        syncNavbarFavoritesCount();
    });

    document.addEventListener("favoritesUpdated", syncNavbarFavoritesCount);
    window.addEventListener("storage", (event) => {
        if (!event || event.key === "favorites") {
            syncNavbarFavoritesCount();
        }
    });

    // Hook into language toggle buttons if they exist
    const toggles = document.querySelectorAll("#language-toggle, #language-toggle-mobile");
    toggles.forEach(btn => {
        btn.addEventListener("click", () => {
            setTimeout(applyNavbarTranslation, 100);
        });
    });

    // Expose globally just in case
    window.forceNavbarTranslation = applyNavbarTranslation;
    window.syncNavbarFavoritesCount = syncNavbarFavoritesCount;

})();

