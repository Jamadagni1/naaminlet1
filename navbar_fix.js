(function () {
    console.log("Navbar Fix Script Loaded");

    function getLang() {
        return localStorage.getItem("language") || "en";
    }

    function applyNavbarTranslation() {
        const lang = getLang();
        console.log("Navbar Fix: Applying translation for", lang);

        document.querySelectorAll(".navbar [data-en]").forEach(el => {
            const text = el.getAttribute(lang === "hi" ? "data-hi" : "data-en");

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

})();
