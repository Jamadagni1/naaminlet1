import { mockCatalog, mockSiteContent } from "./storefront-data.js";
import { supabase } from "./supabase-client.js";

const app = document.getElementById("admin-app");

const state = {
    user: null,
    isAdmin: false,
    sections: [],
    catalog: [],
    activeSectionKey: "hero",
    activeCatalogSlug: null
};

renderShell();
bindStaticEvents();
boot();

async function boot() {
    const { data } = await supabase.auth.getSession();
    await handleAuthChange(data.session?.user || null);
    supabase.auth.onAuthStateChange(async (_event, session) => {
        await handleAuthChange(session?.user || null);
    });
}

function renderShell() {
    app.innerHTML = `
        <div class="admin-shell">
            <div class="admin-topbar">
                <div class="admin-brand">
                    <span class="admin-brand-dot"></span>
                    <div>
                        <h1>Naamin Admin</h1>
                        <p class="admin-meta">Supabase-powered content control for the full website.</p>
                    </div>
                </div>
                <div class="admin-actions">
                    <button class="admin-btn secondary admin-hidden" id="seed-defaults-btn">Seed Default Content</button>
                    <button class="admin-btn secondary admin-hidden" id="refresh-dashboard-btn">Refresh</button>
                    <button class="admin-btn danger admin-hidden" id="sign-out-btn">Sign out</button>
                </div>
            </div>

            <section class="admin-auth-card" id="auth-card">
                <h2>Admin Sign In</h2>
                <p class="admin-help">Use Supabase Auth credentials. Your user must also exist in the <span class="admin-code">admin_users</span> table.</p>
                <div class="admin-form-row">
                    <div class="admin-field">
                        <label for="login-email">Email</label>
                        <input id="login-email" type="email" placeholder="admin@naamin.com">
                    </div>
                    <div class="admin-field">
                        <label for="login-password">Password</label>
                        <input id="login-password" type="password" placeholder="Enter password">
                    </div>
                </div>
                <div class="admin-actions" style="margin-top:16px;">
                    <button class="admin-btn primary" id="sign-in-btn">Sign In</button>
                </div>
                <div class="admin-status" id="auth-status"></div>
            </section>

            <section class="admin-grid admin-hidden" id="dashboard">
                <div class="admin-panel-stack">
                    <div class="admin-card">
                        <h2>Managed Sections</h2>
                        <p class="admin-help">Control hero, highlights, testimonials, and footer content through these section records.</p>
                        <div class="admin-list" id="section-list"></div>
                    </div>

                    <div class="admin-card">
                        <div class="admin-actions" style="justify-content:space-between; align-items:center;">
                            <div>
                                <h2>Catalog Items</h2>
                                <p class="admin-help">These cards power the public homepage catalog.</p>
                            </div>
                            <button class="admin-btn secondary" id="new-catalog-btn">New Item</button>
                        </div>
                        <div class="admin-list" id="catalog-list"></div>
                    </div>
                </div>

                <div class="admin-panel-stack">
                    <div class="admin-card">
                        <div class="admin-actions" style="justify-content:space-between; align-items:center;">
                            <div>
                                <h2>Section Editor</h2>
                                <p class="admin-help">Payload should be valid JSON. This controls metrics, CTAs, pills, links, and similar nested content.</p>
                            </div>
                            <span class="admin-badge" id="active-section-badge">hero</span>
                        </div>
                        <div class="admin-form-row">
                            <div class="admin-field">
                                <label for="section-key">Section Key</label>
                                <input id="section-key" readonly>
                            </div>
                            <div class="admin-checkbox">
                                <input id="section-published" type="checkbox">
                                <label for="section-published">Published</label>
                            </div>
                            <div class="admin-field">
                                <label for="section-eyebrow">Eyebrow</label>
                                <input id="section-eyebrow" type="text">
                            </div>
                            <div class="admin-field">
                                <label for="section-title">Title</label>
                                <input id="section-title" type="text">
                            </div>
                            <div class="admin-field">
                                <label for="section-description">Description</label>
                                <textarea id="section-description"></textarea>
                            </div>
                            <div class="admin-field">
                                <label for="section-payload">Payload JSON</label>
                                <textarea id="section-payload"></textarea>
                            </div>
                        </div>
                        <div class="admin-actions" style="margin-top:16px;">
                            <button class="admin-btn primary" id="save-section-btn">Save Section</button>
                        </div>
                    </div>

                    <div class="admin-card">
                        <div class="admin-actions" style="justify-content:space-between; align-items:center;">
                            <div>
                                <h2>Catalog Editor</h2>
                                <p class="admin-help">Add, update, or remove the homepage cards from here.</p>
                            </div>
                            <span class="admin-badge" id="active-catalog-badge">new item</span>
                        </div>
                        <div class="admin-form-grid two">
                            <div class="admin-field">
                                <label for="catalog-slug">Slug</label>
                                <input id="catalog-slug" type="text" placeholder="rare-boy-names-edit">
                            </div>
                            <div class="admin-field">
                                <label for="catalog-title">Title</label>
                                <input id="catalog-title" type="text">
                            </div>
                            <div class="admin-field">
                                <label for="catalog-category">Category</label>
                                <input id="catalog-category" type="text" placeholder="Boy Names">
                            </div>
                            <div class="admin-field">
                                <label for="catalog-type">Type</label>
                                <input id="catalog-type" type="text" placeholder="Premium List">
                            </div>
                            <div class="admin-field">
                                <label for="catalog-price">Price Text</label>
                                <input id="catalog-price" type="text" placeholder="&#8377;499">
                            </div>
                            <div class="admin-field">
                                <label for="catalog-tag">Tag</label>
                                <input id="catalog-tag" type="text">
                            </div>
                            <div class="admin-field">
                                <label for="catalog-badge">Badge</label>
                                <input id="catalog-badge" type="text">
                            </div>
                            <div class="admin-field">
                                <label for="catalog-accent">Accent</label>
                                <input id="catalog-accent" type="text">
                            </div>
                            <div class="admin-field">
                                <label for="catalog-image">Image Path</label>
                                <input id="catalog-image" type="text" placeholder="baby_aarav_1768672098297.png">
                            </div>
                            <div class="admin-field">
                                <label for="catalog-order">Sort Order</label>
                                <input id="catalog-order" type="number" min="0" step="1" value="0">
                            </div>
                        </div>
                        <div class="admin-form-row" style="margin-top:14px;">
                            <div class="admin-field">
                                <label for="catalog-description">Short Description</label>
                                <textarea id="catalog-description"></textarea>
                            </div>
                            <div class="admin-field">
                                <label for="catalog-details">Detailed Copy</label>
                                <textarea id="catalog-details"></textarea>
                            </div>
                            <div class="admin-field">
                                <label for="catalog-highlights">Highlights (one per line)</label>
                                <textarea id="catalog-highlights"></textarea>
                            </div>
                            <div class="admin-checkbox">
                                <input id="catalog-published" type="checkbox" checked>
                                <label for="catalog-published">Published</label>
                            </div>
                        </div>
                        <div class="admin-actions" style="margin-top:16px;">
                            <button class="admin-btn primary" id="save-catalog-btn">Save Item</button>
                            <button class="admin-btn danger" id="delete-catalog-btn">Delete Item</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    `;
}

function bindStaticEvents() {
    document.getElementById("sign-in-btn").addEventListener("click", signIn);
    document.getElementById("sign-out-btn").addEventListener("click", async () => {
        await supabase.auth.signOut();
    });
    document.getElementById("refresh-dashboard-btn").addEventListener("click", loadDashboard);
    document.getElementById("save-section-btn").addEventListener("click", saveSection);
    document.getElementById("save-catalog-btn").addEventListener("click", saveCatalogItem);
    document.getElementById("delete-catalog-btn").addEventListener("click", deleteCatalogItem);
    document.getElementById("new-catalog-btn").addEventListener("click", () => {
        state.activeCatalogSlug = null;
        fillCatalogForm();
    });
    document.getElementById("seed-defaults-btn").addEventListener("click", seedDefaults);
}

async function signIn() {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const status = document.getElementById("auth-status");

    status.textContent = "Signing in...";
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    status.textContent = error ? error.message : "Signed in. Loading dashboard...";
}

async function handleAuthChange(user) {
    state.user = user;
    state.isAdmin = false;

    if (!user) {
        toggleDashboard(false);
        document.getElementById("auth-status").textContent = "Sign in with a Supabase admin account.";
        return;
    }

    const isAdmin = await checkAdmin(user.id);
    state.isAdmin = isAdmin;

    if (!isAdmin) {
        toggleDashboard(false);
        document.getElementById("auth-status").textContent = "You are signed in, but this user is not present in the admin_users table yet.";
        return;
    }

    toggleDashboard(true);
    document.getElementById("auth-status").textContent = `Signed in as ${user.email}`;
    try {
        await loadDashboard();
    } catch (error) {
        console.error(error);
        document.getElementById("auth-status").textContent = `Admin setup incomplete: ${error.message}`;
    }
}

function toggleDashboard(enabled) {
    document.getElementById("auth-card").classList.toggle("admin-hidden", enabled);
    document.getElementById("dashboard").classList.toggle("admin-hidden", !enabled);
    document.getElementById("seed-defaults-btn").classList.toggle("admin-hidden", !enabled);
    document.getElementById("refresh-dashboard-btn").classList.toggle("admin-hidden", !enabled);
    document.getElementById("sign-out-btn").classList.toggle("admin-hidden", !enabled);
}

async function checkAdmin(userId) {
    const { data, error } = await supabase.from("admin_users").select("user_id").eq("user_id", userId).maybeSingle();
    if (error) {
        console.error(error);
        return false;
    }
    return Boolean(data);
}

async function loadDashboard() {
    const [sectionsResult, catalogResult] = await Promise.all([
        supabase.from("site_sections").select("*").order("section_key", { ascending: true }),
        supabase.from("catalog_items").select("*").order("sort_order", { ascending: true })
    ]);

    if (sectionsResult.error) throw sectionsResult.error;
    if (catalogResult.error) throw catalogResult.error;

    state.sections = sectionsResult.data || [];
    state.catalog = catalogResult.data || [];

    renderSectionList();
    renderCatalogList();

    const firstSection = state.sections[0]?.section_key || "hero";
    selectSection(firstSection);

    if (state.catalog.length) {
        selectCatalog(state.catalog[0].slug);
    } else {
        fillCatalogForm();
    }
}

function renderSectionList() {
    const list = document.getElementById("section-list");
    list.innerHTML = "";

    const orderedKeys = ["hero", "highlights", "testimonials", "footer"];
    orderedKeys.forEach((key) => {
        const section = state.sections.find((entry) => entry.section_key === key) || buildMockSection(key);
        const item = document.createElement("button");
        item.type = "button";
        item.className = `admin-list-item ${state.activeSectionKey === key ? "is-active" : ""}`;
        item.innerHTML = `
            <div>
                <h4>${key}</h4>
                <p>${section.title || "No title yet"}</p>
            </div>
            <span class="admin-badge">${section.published === false ? "Draft" : "Live"}</span>
        `;
        item.addEventListener("click", () => selectSection(key));
        list.appendChild(item);
    });
}

function renderCatalogList() {
    const list = document.getElementById("catalog-list");
    list.innerHTML = "";

    if (!state.catalog.length) {
        list.innerHTML = `<div class="admin-empty">No catalog items yet. Use "New Item" or "Seed Default Content".</div>`;
        return;
    }

    state.catalog.forEach((item) => {
        const row = document.createElement("button");
        row.type = "button";
        row.className = `admin-list-item ${state.activeCatalogSlug === item.slug ? "is-active" : ""}`;
        row.innerHTML = `
            <div>
                <h4>${item.title}</h4>
                <p>${item.category} • ${item.item_type}</p>
            </div>
            <span class="admin-badge">${item.is_published ? "Live" : "Draft"}</span>
        `;
        row.addEventListener("click", () => selectCatalog(item.slug));
        list.appendChild(row);
    });
}

function selectSection(key) {
    state.activeSectionKey = key;
    renderSectionList();
    const section = state.sections.find((entry) => entry.section_key === key) || buildMockSection(key);
    document.getElementById("active-section-badge").textContent = key;
    document.getElementById("section-key").value = key;
    document.getElementById("section-eyebrow").value = section.eyebrow || "";
    document.getElementById("section-title").value = section.title || "";
    document.getElementById("section-description").value = section.description || "";
    document.getElementById("section-payload").value = JSON.stringify(section.payload || {}, null, 2);
    document.getElementById("section-published").checked = section.published !== false;
}

function selectCatalog(slug) {
    state.activeCatalogSlug = slug;
    renderCatalogList();
    const item = state.catalog.find((entry) => entry.slug === slug);
    fillCatalogForm(item);
}

function fillCatalogForm(item = null) {
    document.getElementById("active-catalog-badge").textContent = item?.slug || "new item";
    document.getElementById("catalog-slug").value = item?.slug || "";
    document.getElementById("catalog-title").value = item?.title || "";
    document.getElementById("catalog-category").value = item?.category || "";
    document.getElementById("catalog-type").value = item?.item_type || "";
    document.getElementById("catalog-price").value = item?.price_text || "";
    document.getElementById("catalog-tag").value = item?.tag || "";
    document.getElementById("catalog-badge").value = item?.badge || "";
    document.getElementById("catalog-accent").value = item?.accent || "";
    document.getElementById("catalog-image").value = item?.image || "";
    document.getElementById("catalog-order").value = item?.sort_order ?? 0;
    document.getElementById("catalog-description").value = item?.description || "";
    document.getElementById("catalog-details").value = item?.details || "";
    document.getElementById("catalog-highlights").value = Array.isArray(item?.highlights) ? item.highlights.join("\n") : "";
    document.getElementById("catalog-published").checked = item?.is_published !== false;
}

async function saveSection() {
    const payloadText = document.getElementById("section-payload").value.trim();
    let payload = {};

    try {
        payload = payloadText ? JSON.parse(payloadText) : {};
    } catch (error) {
        alert("Section payload must be valid JSON.");
        return;
    }

    const record = {
        section_key: document.getElementById("section-key").value.trim(),
        eyebrow: document.getElementById("section-eyebrow").value.trim(),
        title: document.getElementById("section-title").value.trim(),
        description: document.getElementById("section-description").value.trim(),
        payload,
        published: document.getElementById("section-published").checked
    };

    const { error } = await supabase.from("site_sections").upsert(record, { onConflict: "section_key" });
    if (error) {
        alert(error.message);
        return;
    }

    await loadDashboard();
}

async function saveCatalogItem() {
    const slug = document.getElementById("catalog-slug").value.trim();
    if (!slug) {
        alert("Catalog slug is required.");
        return;
    }

    const record = {
        slug,
        title: document.getElementById("catalog-title").value.trim(),
        category: document.getElementById("catalog-category").value.trim(),
        item_type: document.getElementById("catalog-type").value.trim(),
        price_text: document.getElementById("catalog-price").value.trim(),
        tag: document.getElementById("catalog-tag").value.trim(),
        badge: document.getElementById("catalog-badge").value.trim(),
        accent: document.getElementById("catalog-accent").value.trim(),
        image: document.getElementById("catalog-image").value.trim(),
        sort_order: Number(document.getElementById("catalog-order").value || 0),
        description: document.getElementById("catalog-description").value.trim(),
        details: document.getElementById("catalog-details").value.trim(),
        highlights: document.getElementById("catalog-highlights").value.split("\n").map((line) => line.trim()).filter(Boolean),
        is_published: document.getElementById("catalog-published").checked
    };

    const { error } = await supabase.from("catalog_items").upsert(record, { onConflict: "slug" });
    if (error) {
        alert(error.message);
        return;
    }

    await loadDashboard();
    selectCatalog(slug);
}

async function deleteCatalogItem() {
    const slug = document.getElementById("catalog-slug").value.trim();
    if (!slug) {
        alert("Select a catalog item first.");
        return;
    }

    if (!window.confirm("Delete this catalog item?")) return;

    const { error } = await supabase.from("catalog_items").delete().eq("slug", slug);
    if (error) {
        alert(error.message);
        return;
    }

    state.activeCatalogSlug = null;
    await loadDashboard();
}

async function seedDefaults() {
    if (!window.confirm("Seed default site sections and catalog items into Supabase? Existing rows with the same keys/slugs will be updated.")) {
        return;
    }

    const sectionRows = Object.entries(mockSiteContent).map(([section_key, value]) => ({
        section_key,
        eyebrow: value.eyebrow || "",
        title: value.title || "",
        description: value.description || "",
        payload: value.payload || {},
        published: true
    }));

    const catalogRows = mockCatalog.map((item, index) => ({
        slug: item.id,
        title: item.title,
        description: item.description,
        price_text: item.price,
        tag: item.tag,
        category: item.category,
        item_type: item.type,
        image: item.image,
        accent: item.accent,
        badge: item.badge,
        details: item.details,
        highlights: item.highlights,
        is_published: true,
        sort_order: index
    }));

    const [sectionsResult, catalogResult] = await Promise.all([
        supabase.from("site_sections").upsert(sectionRows, { onConflict: "section_key" }),
        supabase.from("catalog_items").upsert(catalogRows, { onConflict: "slug" })
    ]);

    if (sectionsResult.error) {
        alert(sectionsResult.error.message);
        return;
    }

    if (catalogResult.error) {
        alert(catalogResult.error.message);
        return;
    }

    await loadDashboard();
}

function buildMockSection(key) {
    const source = mockSiteContent[key];
    return {
        section_key: key,
        eyebrow: source?.eyebrow || "",
        title: source?.title || "",
        description: source?.description || "",
        payload: source?.payload || {},
        published: true
    };
}
