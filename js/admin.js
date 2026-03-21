import { subscribeFeatureDoc, upsertFeature, deleteFeature } from "./fetchData.js";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "./firebase.js";

const idInput = document.getElementById("feature-id");
const titleInput = document.getElementById("feature-title");
const descInput = document.getElementById("feature-description");
const sectionsContainer = document.getElementById("sections-container");
const addSectionBtn = document.getElementById("add-section-btn");
const saveBtn = document.getElementById("save-feature-btn");
const deleteBtn = document.getElementById("delete-feature-btn");
const featureList = document.getElementById("feature-list");

function renderSectionRow(section = {}) {
  const wrapper = document.createElement("div");
  wrapper.className = "section-item";
  wrapper.innerHTML = `
    <div class="admin-row">
      <label>Heading</label>
      <input data-field="heading" value="${section.heading || ""}" />
    </div>
    <div class="admin-row">
      <label>Content</label>
      <textarea data-field="content" rows="2">${section.content || ""}</textarea>
    </div>
    <div class="admin-row">
      <label>Image URL</label>
      <input data-field="image" value="${section.image || ""}" />
    </div>
    <button class="admin-btn danger" data-remove>Remove Section</button>
  `;
  wrapper.querySelector("[data-remove]").addEventListener("click", () => wrapper.remove());
  sectionsContainer.appendChild(wrapper);
}

addSectionBtn.addEventListener("click", () => renderSectionRow());

saveBtn.addEventListener("click", async () => {
  const id = idInput.value.trim();
  if (!id) return alert("Please enter a Page ID (e.g., aura)");

  const sections = Array.from(sectionsContainer.querySelectorAll(".section-item")).map((row) => ({
    heading: row.querySelector("[data-field='heading']").value.trim(),
    content: row.querySelector("[data-field='content']").value.trim(),
    image: row.querySelector("[data-field='image']").value.trim()
  }));

  const payload = {
    title: titleInput.value.trim(),
    description: descInput.value.trim(),
    sections
  };

  await upsertFeature(id, payload);
  alert("Saved!");
});

deleteBtn.addEventListener("click", async () => {
  const id = idInput.value.trim();
  if (!id) return alert("Enter Page ID to delete.");
  if (!confirm("Delete this feature page?")) return;
  await deleteFeature(id);
  alert("Deleted.");
});

function loadFeature(id) {
  idInput.value = id;
  sectionsContainer.innerHTML = "";
  const unsub = subscribeFeatureDoc(id, (data) => {
    if (!data) return;
    titleInput.value = data.title || "";
    descInput.value = data.description || "";
    sectionsContainer.innerHTML = "";
    (data.sections || []).forEach(renderSectionRow);
  });
  return unsub;
}

// Live list of features
onSnapshot(collection(db, "features"), (snap) => {
  if (!featureList) return;
  featureList.innerHTML = "";
  snap.forEach((docSnap) => {
    const item = document.createElement("div");
    item.className = "admin-row";
    item.innerHTML = `
      <strong>${docSnap.id}</strong>
      <button class="admin-btn secondary" data-load>Load</button>
    `;
    item.querySelector("[data-load]").addEventListener("click", () => loadFeature(docSnap.id));
    featureList.appendChild(item);
  });
});
