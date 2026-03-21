import { db } from "./firebase.js";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const cacheKey = (id) => `feature_cache_${id}`;

export function readCachedFeature(id) {
  try {
    const raw = localStorage.getItem(cacheKey(id));
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function cacheFeature(id, data) {
  try {
    localStorage.setItem(cacheKey(id), JSON.stringify(data));
  } catch (e) {
    // ignore cache errors
  }
}

export function subscribeFeatureDoc(id, onData, onError) {
  const ref = doc(collection(db, "features"), id);
  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        onData(null);
        return;
      }
      const data = { id: snap.id, ...snap.data() };
      cacheFeature(id, data);
      onData(data);
    },
    (err) => {
      console.error("Firestore subscribe error:", err);
      if (onError) onError(err);
    }
  );
}

export async function upsertFeature(id, payload) {
  const ref = doc(collection(db, "features"), id);
  const data = { ...payload, updatedAt: serverTimestamp() };
  await setDoc(ref, data, { merge: true });
}

export async function deleteFeature(id) {
  const ref = doc(collection(db, "features"), id);
  await deleteDoc(ref);
}

export async function updateFeature(id, payload) {
  const ref = doc(collection(db, "features"), id);
  await updateDoc(ref, payload);
}
