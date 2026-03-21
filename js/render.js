export function renderFeaturePage(root, data) {
  if (!root) return;
  const titleEl = root.querySelector("[data-feature-title]");
  const descEl = root.querySelector("[data-feature-description]");
  const sectionsEl = root.querySelector("[data-feature-sections]");
  const layout = root.getAttribute("data-feature-layout") || "default";

  if (!data) {
    renderFeatureEmpty(root);
    return;
  }

  if (titleEl) titleEl.textContent = data.title || "Untitled";
  if (descEl) descEl.textContent = data.description || "";

  if (!sectionsEl) return;
  sectionsEl.innerHTML = "";

  const sections = Array.isArray(data.sections) ? data.sections : [];
  if (sections.length === 0) {
    sectionsEl.innerHTML = `<p class="feature-fallback">No sections available.</p>`;
    return;
  }

  if (layout === "pricing") {
    sections.forEach((section) => {
      const card = document.createElement("div");
      card.className = "pricing-card";
      card.innerHTML = `
        <div class="pricing-card-header">
          <div>
            <h3>${section.heading || "Untitled"}</h3>
          </div>
          <i class="fas fa-chevron-down pricing-card-toggle-icon"></i>
        </div>
        <div class="pricing-card-details">
          <p class="feature-section-content">${section.content || ""}</p>
          ${section.image ? `<img class="feature-section-image" src="${section.image}" alt="${section.heading || "Feature"}">` : ""}
        </div>
      `;
      sectionsEl.appendChild(card);
    });
  } else {
    sections.forEach((section) => {
      const item = document.createElement("div");
      item.className = "feature-card";
      item.innerHTML = `
        <h3>${section.heading || "Untitled"}</h3>
        <p>${section.content || ""}</p>
        ${section.image ? `<img class="feature-section-image" src="${section.image}" alt="${section.heading || "Feature"}">` : ""}
      `;
      sectionsEl.appendChild(item);
    });
  }
}

export function renderFeatureEmpty(root) {
  const titleEl = root.querySelector("[data-feature-title]");
  const descEl = root.querySelector("[data-feature-description]");
  const sectionsEl = root.querySelector("[data-feature-sections]");
  if (titleEl) titleEl.textContent = "Content coming soon";
  if (descEl) descEl.textContent = "We are preparing this page. Please check back shortly.";
  if (sectionsEl) {
    sectionsEl.innerHTML = `<p class="feature-fallback">No data found for this page.</p>`;
  }
}

export function renderFeatureError(root) {
  const titleEl = root.querySelector("[data-feature-title]");
  const descEl = root.querySelector("[data-feature-description]");
  const sectionsEl = root.querySelector("[data-feature-sections]");
  if (titleEl) titleEl.textContent = "Unable to load content";
  if (descEl) descEl.textContent = "Please refresh or try again later.";
  if (sectionsEl) {
    sectionsEl.innerHTML = `<p class="feature-fallback">Error loading data.</p>`;
  }
}
