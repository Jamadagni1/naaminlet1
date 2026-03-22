const WISHLIST_KEY = "naamin_storefront_wishlist_v2";

export function getWishlist() {
    try {
        const raw = localStorage.getItem(WISHLIST_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        console.error("Wishlist read failed", error);
        return [];
    }
}

export function saveWishlist(items) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
    document.dispatchEvent(new CustomEvent("wishlist:changed", { detail: { items } }));
}

export function isWishlisted(itemId) {
    return getWishlist().some((item) => item.id === itemId);
}

export function toggleWishlist(item) {
    const items = getWishlist();
    const exists = items.some((entry) => entry.id === item.id);

    if (exists) {
        const nextItems = items.filter((entry) => entry.id !== item.id);
        saveWishlist(nextItems);
        return { added: false, items: nextItems };
    }

    const nextItems = [item, ...items];
    saveWishlist(nextItems);
    return { added: true, items: nextItems };
}

export function removeWishlistItem(itemId) {
    const nextItems = getWishlist().filter((item) => item.id !== itemId);
    saveWishlist(nextItems);
    return nextItems;
}

export function clearWishlist() {
    saveWishlist([]);
}
