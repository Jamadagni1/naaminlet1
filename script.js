/* ======================================================
   SCRIPT.JS - FINAL COMPLETE VERSION
   (Includes: 2026 Horoscope, Favorites, Typing Animation)
   ====================================================== */

// ===========================
// GENDER THEME PERSISTENCE
// ===========================
const GenderTheme = {
    STORAGE_KEY: 'selectedGender',

    // Save gender selection to localStorage
    save(gender) {
        try {
            localStorage.setItem(this.STORAGE_KEY, gender);
            console.log('Gender saved:', gender);
        } catch (e) {
            console.error('Failed to save gender:', e);
        }
    },

    // Load gender from localStorage
    load() {
        try {
            return localStorage.getItem(this.STORAGE_KEY) || 'Boy';
        } catch (e) {
            console.error('Failed to load gender:', e);
            return 'Boy';
        }
    },

    // Apply theme based on gender
    apply(gender) {
        const html = document.documentElement;
        // Always enforce default (purple) theme regardless of gender
        html.removeAttribute('data-theme'); // Enforce default (purple) theme
        console.log('Applied default theme (Unified Purple)');
    },

    // Initialize theme on page load
    init() {
        const savedGender = this.load();
        this.apply(savedGender);
        return savedGender;
    }
};

// Apply theme immediately (before DOMContentLoaded for faster rendering)
GenderTheme.init();

document.body.style.visibility = "visible";
document.body.style.opacity = "1";

// Comprehensive English to Hindi Name Mapping & Transliteration
function getHindiName(englishName) {
    if (!englishName) return "";

    // 1. Precise Mapping for common names
    const preciseMapping = {
        'Aarav': 'à¤†à¤°à¤µ', 'Aditya': 'à¤†à¤¦à¤¿à¤¤à¥à¤¯', 'Arjun': 'à¤…à¤°à¥à¤œà¥à¤¨', 'Aryan': 'à¤†à¤°à¥à¤¯à¤¨',
        'Ayaan': 'à¤…à¤¯à¤¾à¤¨', 'Dev': 'à¤¦à¥‡à¤µ', 'Dhruv': 'à¤§à¥à¤°à¥à¤µ', 'Harsh': 'à¤¹à¤°à¥à¤·',
        'Ishan': 'à¤ˆà¤¶à¤¾à¤¨', 'Ishaan': 'à¤ˆà¤¶à¤¾à¤¨', 'Karan': 'à¤•à¤°à¤£', 'Krishna': 'à¤•à¥ƒà¤·à¥à¤£',
        'Om': 'à¥', 'Pranav': 'à¤ªà¥à¤°à¤£à¤µ', 'Rohan': 'à¤°à¥‹à¤¹à¤¨', 'Rahul': 'à¤°à¤¾à¤¹à¥à¤²',
        'Sahil': 'à¤¸à¤¾à¤¹à¤¿à¤²', 'Shiv': 'à¤¶à¤¿à¤µ', 'Vihaan': 'à¤µà¤¿à¤¹à¤¾à¤¨', 'Yash': 'à¤¯à¤¶',
        'Ansi': 'à¤…à¤‚à¤¸à¥€', 'Ananya': 'à¤…à¤¨à¤¨à¥à¤¯à¤¾', 'Aisha': 'à¤†à¤¯à¤¶à¤¾', 'Aditi': 'à¤…à¤¦à¤¿à¤¤à¤¿',
        'Diya': 'à¤¦à¥€à¤¯à¤¾', 'Isha': 'à¤ˆà¤¶à¤¾', 'Kavya': 'à¤•à¤¾à¤µà¥à¤¯à¤¾', 'Prisha': 'à¤ªà¥à¤°à¤¿à¤¶à¤¾'
    };

    if (preciseMapping[englishName]) return preciseMapping[englishName];

    // 2. Fallback: Phonetic Transliteration logic
    const phoneticMap = {
        'a': 'à¤…', 'i': 'à¤‡', 'u': 'à¤‰', 'e': 'à¤', 'o': 'à¤“',
        'k': 'à¤•', 'kh': 'à¤–', 'g': 'à¤—', 'gh': 'à¤˜',
        'ch': 'à¤š', 'chh': 'à¤›', 'j': 'à¤œ', 'jh': 'à¤',
        't': 'à¤¤', 'th': 'à¤¥', 'd': 'à¤¦', 'dh': 'à¤§', 'n': 'à¤¨',
        'p': 'à¤ª', 'ph': 'à¤«', 'b': 'à¤¬', 'bh': 'à¤­', 'm': 'à¤®',
        'y': 'à¤¯', 'r': 'à¤°', 'l': 'à¤²', 'v': 'à¤µ', 'w': 'à¤µ',
        's': 'à¤¸', 'sh': 'à¤¶', 'h': 'à¤¹'
    };

    let name = englishName.toLowerCase();
    let result = '';
    let i = 0;

    while (i < name.length) {
        // Try double characters first (e.g., 'sh', 'kh')
        let char2 = name.substring(i, i + 2);
        if (phoneticMap[char2]) {
            result += phoneticMap[char2];
            i += 2;
        } else {
            let char1 = name.substring(i, i + 1);
            result += phoneticMap[char1] || '';
            i += 1;
        }
    }

    return result || englishName;
}
window.getHindiName = getHindiName;


// ðŸŒŸ ASTRO ENGINE
class AstroEngine {
    constructor() {
        this.numerologyMap = { 'A': 1, 'I': 1, 'J': 1, 'Q': 1, 'Y': 1, 'B': 2, 'K': 2, 'R': 2, 'C': 3, 'G': 3, 'L': 3, 'S': 3, 'D': 4, 'M': 4, 'T': 4, 'E': 5, 'H': 5, 'N': 5, 'X': 5, 'U': 6, 'V': 6, 'W': 6, 'O': 7, 'Z': 7, 'F': 8, 'P': 8 };

        // --- 2026 FULL HOROSCOPE DATA (COMPLETE TEXT) ---
        this.rashiMap = [
            {
                rashi_en: "Aries (Mesh)", rashi_hi: "à¤®à¥‡à¤· (Aries)",
                letters: ["chu", "che", "cho", "la", "li", "lu", "le", "lo", "a"],
                nakshatras: ["Ashwini", "Bharani", "Krittika"],
                phal_en: "Courageous, energetic, and a born leader.",
                phal_hi: "à¤¸à¤¾à¤¹à¤¸à¥€, à¤Šà¤°à¥à¤œà¤¾à¤µà¤¾à¤¨ à¤”à¤° à¤¨à¥‡à¤¤à¥ƒà¤¤à¥à¤µ à¤•à¤°à¤¨à¥‡ à¤µà¤¾à¤²à¤¾à¥¤",
                rashiphal_en: "2026 brings massive career growth and energy. Focus on health in the second half. New beginnings are favored.",
                rashiphal_hi: "2026 à¤•à¤°à¤¿à¤¯à¤° à¤®à¥‡à¤‚ à¤­à¤¾à¤°à¥€ à¤µà¥ƒà¤¦à¥à¤§à¤¿ à¤”à¤° à¤Šà¤°à¥à¤œà¤¾ à¤²à¤¾à¤à¤—à¤¾à¥¤ à¤µà¤°à¥à¤· à¤•à¥‡ à¤¦à¥‚à¤¸à¤°à¥‡ à¤­à¤¾à¤— à¤®à¥‡à¤‚ à¤¸à¥à¤µà¤¾à¤¸à¥à¤¥à¥à¤¯ à¤ªà¤° à¤§à¥à¤¯à¤¾à¤¨ à¤¦à¥‡à¤‚à¥¤ à¤¨à¤ˆ à¤¶à¥à¤°à¥à¤†à¤¤ à¤•à¥‡ à¤²à¤¿à¤ à¤¸à¤®à¤¯ à¤…à¤¨à¥à¤•à¥‚à¤² à¤¹à¥ˆà¥¤"
            },
            {
                rashi_en: "Taurus (Vrishabh)", rashi_hi: "à¤µà¥ƒà¤·à¤­ (Taurus)",
                letters: ["i", "ee", "u", "oo", "e", "o", "va", "vi", "vu", "ve", "vo"],
                nakshatras: ["Krittika", "Rohini", "Mrigashira"],
                phal_en: "Calm, reliable, and lover of arts.",
                phal_hi: "à¤¶à¤¾à¤‚à¤¤, à¤µà¤¿à¤¶à¥à¤µà¤¸à¤¨à¥€à¤¯ à¤”à¤° à¤•à¤²à¤¾ à¤ªà¥à¤°à¥‡à¤®à¥€à¥¤",
                rashiphal_en: "Financial stability improves significantly in 2026. Relationships will deepen. Avoid stubbornness in family matters.",
                rashiphal_hi: "2026 à¤®à¥‡à¤‚ à¤†à¤°à¥à¤¥à¤¿à¤• à¤¸à¥à¤¥à¤¿à¤°à¤¤à¤¾ à¤•à¤¾à¤«à¥€ à¤¬à¥‡à¤¹à¤¤à¤° à¤¹à¥‹à¤—à¥€à¥¤ à¤°à¤¿à¤¶à¥à¤¤à¥‡ à¤—à¤¹à¤°à¥‡ à¤¹à¥‹à¤‚à¤—à¥‡à¥¤ à¤ªà¤¾à¤°à¤¿à¤µà¤¾à¤°à¤¿à¤• à¤®à¤¾à¤®à¤²à¥‹à¤‚ à¤®à¥‡à¤‚ à¤œà¤¿à¤¦à¥à¤¦à¥€ à¤¹à¥‹à¤¨à¥‡ à¤¸à¥‡ à¤¬à¤šà¥‡à¤‚à¥¤"
            },
            {
                rashi_en: "Gemini (Mithun)", rashi_hi: "à¤®à¤¿à¤¥à¥à¤¨ (Gemini)",
                letters: ["ka", "ki", "ku", "gh", "ng", "ch", "ke", "ko", "ha"],
                nakshatras: ["Mrigashira", "Ardra", "Punarvasu"],
                phal_en: "Intelligent, talkative, and versatile.",
                phal_hi: "à¤¬à¥à¤¦à¥à¤§à¤¿à¤®à¤¾à¤¨, à¤µà¤¾à¤šà¤¾à¤² à¤”à¤° à¤¬à¤¹à¥à¤®à¥à¤–à¥€ à¤ªà¥à¤°à¤¤à¤¿à¤­à¤¾ à¤µà¤¾à¤²à¤¾à¥¤",
                rashiphal_en: "A great year for learning, travel, and communication. New opportunities arise in business. Stay focused.",
                rashiphal_hi: "à¤¸à¥€à¤–à¤¨à¥‡, à¤¯à¤¾à¤¤à¥à¤°à¤¾ à¤”à¤° à¤¸à¤‚à¤šà¤¾à¤° à¤•à¥‡ à¤²à¤¿à¤ à¤¯à¤¹ à¤à¤• à¤¬à¥‡à¤¹à¤¤à¤°à¥€à¤¨ à¤µà¤°à¥à¤· à¤¹à¥ˆà¥¤ à¤µà¥à¤¯à¤¾à¤ªà¤¾à¤° à¤®à¥‡à¤‚ à¤¨à¤ à¤…à¤µà¤¸à¤° à¤®à¤¿à¤²à¥‡à¤‚à¤—à¥‡à¥¤ à¤…à¤ªà¤¨à¥‡ à¤²à¤•à¥à¤·à¥à¤¯ à¤ªà¤° à¤•à¥‡à¤‚à¤¦à¥à¤°à¤¿à¤¤ à¤°à¤¹à¥‡à¤‚à¥¤"
            },
            {
                rashi_en: "Cancer (Kark)", rashi_hi: "à¤•à¤°à¥à¤• (Cancer)",
                letters: ["hi", "hu", "he", "ho", "da", "di", "du", "de", "do"],
                nakshatras: ["Punarvasu", "Pushya", "Ashlesha"],
                phal_en: "Emotional, sensitive, and family-oriented.",
                phal_hi: "à¤­à¤¾à¤µà¥à¤•, à¤¸à¤‚à¤µà¥‡à¤¦à¤¨à¤¶à¥€à¤² à¤”à¤° à¤ªà¤°à¤¿à¤µà¤¾à¤° à¤ªà¥à¤°à¥‡à¤®à¥€à¥¤",
                rashiphal_en: "Focus on home and property in 2026. Emotional strength increases. Career stability is indicated mid-year.",
                rashiphal_hi: "2026 à¤®à¥‡à¤‚ à¤˜à¤° à¤”à¤° à¤¸à¤‚à¤ªà¤¤à¥à¤¤à¤¿ à¤ªà¤° à¤§à¥à¤¯à¤¾à¤¨ à¤•à¥‡à¤‚à¤¦à¥à¤°à¤¿à¤¤ à¤°à¤¹à¥‡à¤—à¤¾à¥¤ à¤­à¤¾à¤µà¤¨à¤¾à¤¤à¥à¤®à¤• à¤¶à¤•à¥à¤¤à¤¿ à¤¬à¤¢à¤¼à¥‡à¤—à¥€à¥¤ à¤µà¤°à¥à¤· à¤•à¥‡ à¤®à¤§à¥à¤¯ à¤®à¥‡à¤‚ à¤•à¤°à¤¿à¤¯à¤° à¤®à¥‡à¤‚ à¤¸à¥à¤¥à¤¿à¤°à¤¤à¤¾ à¤†à¤à¤—à¥€à¥¤"
            },
            {
                rashi_en: "Leo (Simha)", rashi_hi: "à¤¸à¤¿à¤‚à¤¹ (Leo)",
                letters: ["ma", "mi", "mu", "me", "mo", "ta", "ti", "tu", "te"],
                nakshatras: ["Magha", "Purva Phalguni", "Uttara Phalguni"],
                phal_en: "Confident, generous, and regal nature.",
                phal_hi: "à¤†à¤¤à¥à¤®à¤µà¤¿à¤¶à¥à¤µà¤¾à¤¸à¥€, à¤‰à¤¦à¤¾à¤° à¤”à¤° à¤°à¤¾à¤œà¤¾ à¤œà¥ˆà¤¸à¤¾ à¤¸à¥à¤µà¤­à¤¾à¤µà¥¤",
                rashiphal_en: "Leadership roles await you in 2026. Your creativity will shine. Recognition and fame are on the cards.",
                rashiphal_hi: "2026 à¤®à¥‡à¤‚ à¤¨à¥‡à¤¤à¥ƒà¤¤à¥à¤µ à¤•à¥€ à¤­à¥‚à¤®à¤¿à¤•à¤¾à¤à¤ à¤†à¤ªà¤•à¤¾ à¤‡à¤‚à¤¤à¤œà¤¼à¤¾à¤° à¤•à¤° à¤°à¤¹à¥€ à¤¹à¥ˆà¤‚à¥¤ à¤†à¤ªà¤•à¥€ à¤°à¤šà¤¨à¤¾à¤¤à¥à¤®à¤•à¤¤à¤¾ à¤šà¤®à¤•à¥‡à¤—à¥€à¥¤ à¤®à¤¾à¤¨-à¤¸à¤®à¥à¤®à¤¾à¤¨ à¤”à¤° à¤ªà¥à¤°à¤¸à¤¿à¤¦à¥à¤§à¤¿ à¤®à¤¿à¤²à¤¨à¥‡ à¤•à¥‡ à¤¯à¥‹à¤— à¤¹à¥ˆà¤‚à¥¤"
            },
            {
                rashi_en: "Virgo (Kanya)", rashi_hi: "à¤•à¤¨à¥à¤¯à¤¾ (Virgo)",
                letters: ["to", "pa", "pi", "pu", "sha", "na", "th", "pe", "po"],
                nakshatras: ["Uttara Phalguni", "Hasta", "Chitra"],
                phal_en: "Analytical, practical, and hardworking.",
                phal_hi: "à¤µà¤¿à¤¶à¥à¤²à¥‡à¤·à¤£ à¤•à¤°à¤¨à¥‡ à¤µà¤¾à¤²à¤¾, à¤µà¥à¤¯à¤¾à¤µà¤¹à¤¾à¤°à¤¿à¤• à¤”à¤° à¤®à¥‡à¤¹à¤¨à¤¤à¥€à¥¤",
                rashiphal_en: "Hard work pays off this year. Excellent time for skill development and education. Health requires care.",
                rashiphal_hi: "à¤‡à¤¸ à¤µà¤°à¥à¤· à¤•à¤¡à¤¼à¥€ à¤®à¥‡à¤¹à¤¨à¤¤ à¤•à¤¾ à¤«à¤² à¤®à¤¿à¤²à¥‡à¤—à¤¾à¥¤ à¤•à¥Œà¤¶à¤² à¤µà¤¿à¤•à¤¾à¤¸ à¤”à¤° à¤¶à¤¿à¤•à¥à¤·à¤¾ à¤•à¥‡ à¤²à¤¿à¤ à¤‰à¤¤à¥à¤¤à¤® à¤¸à¤®à¤¯ à¤¹à¥ˆà¥¤ à¤¸à¥à¤µà¤¾à¤¸à¥à¤¥à¥à¤¯ à¤•à¤¾ à¤§à¥à¤¯à¤¾à¤¨ à¤°à¤–à¤¨à¥‡ à¤•à¥€ à¤†à¤µà¤¶à¥à¤¯à¤•à¤¤à¤¾ à¤¹à¥ˆà¥¤"
            },
            {
                rashi_en: "Libra (Tula)", rashi_hi: "à¤¤à¥à¤²à¤¾ (Libra)",
                letters: ["ra", "ri", "ru", "re", "ro", "ta", "ti", "tu", "te"],
                nakshatras: ["Chitra", "Swati", "Vishakha"],
                phal_en: "Fair, balanced, and social.",
                phal_hi: "à¤¨à¥à¤¯à¤¾à¤¯à¤ªà¥à¤°à¤¿à¤¯, à¤¸à¤‚à¤¤à¥à¤²à¤¿à¤¤ à¤”à¤° à¤®à¤¿à¤²à¤¨à¤¸à¤¾à¤°à¥¤",
                rashiphal_en: "Balance in partnerships is key in 2026. Artistic pursuits flourish. A good year for marriage or new alliances.",
                rashiphal_hi: "2026 à¤®à¥‡à¤‚ à¤¸à¤¾à¤à¥‡à¤¦à¤¾à¤°à¥€ à¤®à¥‡à¤‚ à¤¸à¤‚à¤¤à¥à¤²à¤¨ à¤®à¤¹à¤¤à¥à¤µà¤ªà¥‚à¤°à¥à¤£ à¤°à¤¹à¥‡à¤—à¤¾à¥¤ à¤•à¤²à¤¾à¤¤à¥à¤®à¤• à¤•à¤¾à¤°à¥à¤¯à¥‹à¤‚ à¤®à¥‡à¤‚ à¤¸à¤«à¤²à¤¤à¤¾ à¤®à¤¿à¤²à¥‡à¤—à¥€à¥¤ à¤µà¤¿à¤µà¤¾à¤¹ à¤¯à¤¾ à¤¨à¤ à¤—à¤ à¤¬à¤‚à¤§à¤¨à¥‹à¤‚ à¤•à¥‡ à¤²à¤¿à¤ à¤…à¤šà¥à¤›à¤¾ à¤µà¤°à¥à¤· à¤¹à¥ˆà¥¤"
            },
            {
                rashi_en: "Scorpio (Vrishchik)", rashi_hi: "à¤µà¥ƒà¤¶à¥à¤šà¤¿à¤• (Scorpio)",
                letters: ["to", "na", "ni", "nu", "ne", "no", "ya", "yi", "yu"],
                nakshatras: ["Vishakha", "Anuradha", "Jyeshtha"],
                phal_en: "Intense, mysterious, and determined.",
                phal_hi: "à¤¤à¥€à¤µà¥à¤°, à¤°à¤¹à¤¸à¥à¤¯à¤®à¤¯à¥€ à¤”à¤° à¤¦à¥ƒà¤¢à¤¼ à¤¨à¤¿à¤¶à¥à¤šà¤¯ à¤µà¤¾à¤²à¤¾à¥¤",
                rashiphal_en: "A transformative year. Trust your intuition and take calculated risks. Sudden gains are possible.",
                rashiphal_hi: "à¤¯à¤¹ à¤à¤• à¤ªà¤°à¤¿à¤µà¤°à¥à¤¤à¤¨à¤•à¤¾à¤°à¥€ à¤µà¤°à¥à¤· à¤¹à¥ˆà¥¤ à¤…à¤ªà¤¨à¥€ à¤…à¤‚à¤¤à¤°à¥à¤œà¥à¤žà¤¾à¤¨ à¤ªà¤° à¤­à¤°à¥‹à¤¸à¤¾ à¤•à¤°à¥‡à¤‚ à¤”à¤° à¤¸à¥‹à¤š-à¤¸à¤®à¤à¤•à¤° à¤œà¥‹à¤–à¤¿à¤® à¤²à¥‡à¤‚à¥¤ à¤…à¤šà¤¾à¤¨à¤• à¤§à¤¨ à¤²à¤¾à¤­ à¤¸à¤‚à¤­à¤µ à¤¹à¥ˆà¥¤"
            },
            {
                rashi_en: "Sagittarius (Dhanu)", rashi_hi: "à¤§à¤¨à¥ (Sagittarius)",
                letters: ["ye", "yo", "bha", "bhi", "bhu", "dha", "pha", "dha", "bhe"],
                nakshatras: ["Mula", "Purva Ashadha", "Uttara Ashadha"],
                phal_en: "Optimistic, philosophical, and independent.",
                phal_hi: "à¤†à¤¶à¤¾à¤µà¤¾à¤¦à¥€, à¤¦à¤¾à¤°à¥à¤¶à¤¨à¤¿à¤• à¤”à¤° à¤¸à¥à¤µà¤¤à¤‚à¤¤à¥à¤°à¥¤",
                rashiphal_en: "Luck favors you in 2026. Spiritual growth and long-distance travel are strongly indicated. Optimism returns.",
                rashiphal_hi: "2026 à¤®à¥‡à¤‚ à¤­à¤¾à¤—à¥à¤¯ à¤†à¤ªà¤•à¤¾ à¤¸à¤¾à¤¥ à¤¦à¥‡à¤—à¤¾à¥¤ à¤†à¤§à¥à¤¯à¤¾à¤¤à¥à¤®à¤¿à¤• à¤µà¤¿à¤•à¤¾à¤¸ à¤”à¤° à¤²à¤‚à¤¬à¥€ à¤¦à¥‚à¤°à¥€ à¤•à¥€ à¤¯à¤¾à¤¤à¥à¤°à¤¾ à¤•à¥‡ à¤ªà¥à¤°à¤¬à¤² à¤¸à¤‚à¤•à¥‡à¤¤ à¤¹à¥ˆà¤‚à¥¤ à¤œà¥€à¤µà¤¨ à¤®à¥‡à¤‚ à¤†à¤¶à¤¾à¤µà¤¾à¤¦ à¤²à¥Œà¤Ÿà¥‡à¤—à¤¾à¥¤"
            },
            {
                rashi_en: "Capricorn (Makar)", rashi_hi: "à¤®à¤•à¤° (Capricorn)",
                letters: ["bho", "ja", "ji", "ju", "je", "jo", "kha", "ga", "gi"],
                nakshatras: ["Uttara Ashadha", "Shravana", "Dhanishtha"],
                phal_en: "Ambitious, disciplined, and patient.",
                phal_hi: "à¤®à¤¹à¤¤à¥à¤µà¤¾à¤•à¤¾à¤‚à¤•à¥à¤·à¥€, à¤…à¤¨à¥à¤¶à¤¾à¤¸à¤¿à¤¤ à¤”à¤° à¤§à¥ˆà¤°à¥à¤¯à¤µà¤¾à¤¨à¥¤",
                rashiphal_en: "Career goals will be met through discipline. 2026 rewards your patience. Real estate investments look good.",
                rashiphal_hi: "à¤…à¤¨à¥à¤¶à¤¾à¤¸à¤¨ à¤•à¥‡ à¤®à¤¾à¤§à¥à¤¯à¤® à¤¸à¥‡ à¤•à¤°à¤¿à¤¯à¤° à¤•à¥‡ à¤²à¤•à¥à¤·à¥à¤¯ à¤ªà¥‚à¤°à¥‡ à¤¹à¥‹à¤‚à¤—à¥‡à¥¤ 2026 à¤†à¤ªà¤•à¥‡ à¤§à¥ˆà¤°à¥à¤¯ à¤•à¤¾ à¤«à¤² à¤¦à¥‡à¤—à¤¾à¥¤ à¤…à¤šà¤² à¤¸à¤‚à¤ªà¤¤à¥à¤¤à¤¿ à¤®à¥‡à¤‚ à¤¨à¤¿à¤µà¥‡à¤¶ à¤¶à¥à¤­ à¤°à¤¹à¥‡à¤—à¤¾à¥¤"
            },
            {
                rashi_en: "Aquarius (Kumbh)", rashi_hi: "à¤•à¥à¤®à¥à¤­ (Aquarius)",
                letters: ["gu", "ge", "go", "sa", "si", "su", "se", "so", "da"],
                nakshatras: ["Dhanishtha", "Shatabhisha", "Purva Bhadrapada"],
                phal_en: "Innovative, humanitarian, and friendly.",
                phal_hi: "à¤¨à¤µà¥€à¤¨ à¤¸à¥‹à¤š à¤µà¤¾à¤²à¤¾, à¤®à¤¾à¤¨à¤µà¥€à¤¯ à¤”à¤° à¤®à¤¿à¤¤à¥à¤°à¤µà¤¤à¥¤",
                rashiphal_en: "Innovation leads to success. Your social circle expands significantly in 2026. Financial gains from networks.",
                rashiphal_hi: "à¤¨à¤µà¤šà¤¾à¤° à¤¸à¥‡ à¤¸à¤«à¤²à¤¤à¤¾ à¤®à¤¿à¤²à¥‡à¤—à¥€à¥¤ 2026 à¤®à¥‡à¤‚ à¤†à¤ªà¤•à¤¾ à¤¸à¤¾à¤®à¤¾à¤œà¤¿à¤• à¤¦à¤¾à¤¯à¤°à¤¾ à¤•à¤¾à¤«à¥€ à¤¬à¤¢à¤¼à¥‡à¤—à¤¾à¥¤ à¤¨à¥‡à¤Ÿà¤µà¤°à¥à¤•à¤¿à¤‚à¤— à¤¸à¥‡ à¤†à¤°à¥à¤¥à¤¿à¤• à¤²à¤¾à¤­ à¤¹à¥‹à¤—à¤¾à¥¤"
            },
            {
                rashi_en: "Pisces (Meen)", rashi_hi: "à¤®à¥€à¤¨ (Pisces)",
                letters: ["di", "du", "th", "jha", "yna", "de", "do", "cha", "chi"],
                nakshatras: ["Purva Bhadrapada", "Uttara Bhadrapada", "Revati"],
                phal_en: "Compassionate, spiritual, and imaginative.",
                phal_hi: "à¤¦à¤¯à¤¾à¤²à¥, à¤†à¤§à¥à¤¯à¤¾à¤¤à¥à¤®à¤¿à¤• à¤”à¤° à¤•à¤²à¥à¤ªà¤¨à¤¾à¤¶à¥€à¤²à¥¤",
                rashiphal_en: "Spiritual peace and overseas connections. Manage expenses wisely. Intuition will be your best guide.",
                rashiphal_hi: "à¤†à¤§à¥à¤¯à¤¾à¤¤à¥à¤®à¤¿à¤• à¤¶à¤¾à¤‚à¤¤à¤¿ à¤®à¤¿à¤²à¥‡à¤—à¥€ à¤”à¤° à¤µà¤¿à¤¦à¥‡à¤¶à¥€ à¤¸à¤‚à¤¬à¤‚à¤§ à¤¬à¤¨à¥‡à¤‚à¤—à¥‡à¥¤ à¤–à¤°à¥à¤šà¥‹à¤‚ à¤•à¤¾ à¤ªà¥à¤°à¤¬à¤‚à¤§à¤¨ à¤¸à¤®à¤à¤¦à¤¾à¤°à¥€ à¤¸à¥‡ à¤•à¤°à¥‡à¤‚à¥¤ à¤…à¤‚à¤¤à¤°à¥à¤œà¥à¤žà¤¾à¤¨ à¤†à¤ªà¤•à¤¾ à¤¸à¤¬à¤¸à¥‡ à¤…à¤šà¥à¤›à¤¾ à¤®à¤¾à¤°à¥à¤—à¤¦à¤°à¥à¤¶à¤• à¤¹à¥‹à¤—à¤¾à¥¤"
            }
        ];

        this.astroDetails = {
            1: { planet_en: "Sun", planet_hi: "à¤¸à¥‚à¤°à¥à¤¯", color_en: "Golden", color_hi: "à¤¸à¥à¤¨à¤¹à¤°à¤¾", lucky_nos: "1, 2, 3, 9", fal_en: "Leader...", fal_hi: "à¤¨à¥‡à¤¤à¤¾..." },
            2: { planet_en: "Moon", planet_hi: "à¤šà¤¨à¥à¤¦à¥à¤°", color_en: "White", color_hi: "à¤¸à¤«à¥‡à¤¦", lucky_nos: "2, 6, 7", fal_en: "Emotional...", fal_hi: "à¤­à¤¾à¤µà¥à¤•..." },
            3: { planet_en: "Jupiter", planet_hi: "à¤¬à¥ƒà¤¹à¤¸à¥à¤ªà¤¤à¤¿", color_en: "Yellow", color_hi: "à¤ªà¥€à¤²à¤¾", lucky_nos: "1, 3, 5, 9", fal_en: "Wise...", fal_hi: "à¤œà¥à¤žà¤¾à¤¨à¥€..." },
            4: { planet_en: "Rahu", planet_hi: "à¤°à¤¾à¤¹à¥‚", color_en: "Blue", color_hi: "à¤¨à¥€à¤²à¤¾", lucky_nos: "1, 4, 5, 6", fal_en: "Practical...", fal_hi: "à¤µà¥à¤¯à¤¾à¤µà¤¹à¤¾à¤°à¤¿à¤•..." },
            5: { planet_en: "Mercury", planet_hi: "à¤¬à¥à¤§", color_en: "Green", color_hi: "à¤¹à¤°à¤¾", lucky_nos: "1, 5, 6", fal_en: "Intelligent...", fal_hi: "à¤¬à¥à¤¦à¥à¤§à¤¿à¤®à¤¾à¤¨..." },
            6: { planet_en: "Venus", planet_hi: "à¤¶à¥à¤•à¥à¤°", color_en: "Pink", color_hi: "à¤—à¥à¤²à¤¾à¤¬à¥€", lucky_nos: "3, 6, 9", fal_en: "Charming...", fal_hi: "à¤†à¤•à¤°à¥à¤·à¤•..." },
            7: { planet_en: "Ketu", planet_hi: "à¤•à¥‡à¤¤à¥", color_en: "Multi", color_hi: "à¤šà¤¿à¤¤à¤•à¤¬à¤°à¤¾", lucky_nos: "2, 7", fal_en: "Spiritual...", fal_hi: "à¤†à¤§à¥à¤¯à¤¾à¤¤à¥à¤®à¤¿à¤•..." },
            8: { planet_en: "Saturn", planet_hi: "à¤¶à¤¨à¤¿", color_en: "Black", color_hi: "à¤•à¤¾à¤²à¤¾", lucky_nos: "1, 4, 8", fal_en: "Ambitious...", fal_hi: "à¤®à¤¹à¤¤à¥à¤µà¤¾à¤•à¤¾à¤‚à¤•à¥à¤·à¥€..." },
            9: { planet_en: "Mars", planet_hi: "à¤®à¤‚à¤—à¤²", color_en: "Red", color_hi: "à¤²à¤¾à¤²", lucky_nos: "3, 6, 9", fal_en: "Energetic...", fal_hi: "à¤Šà¤°à¥à¤œà¤¾à¤µà¤¾à¤¨..." }
        };
    }

    calculateNumerology(name) {
        if (!name) return 1;
        let total = 0, clean = name.toUpperCase().replace(/[^A-Z]/g, '');
        for (let c of clean) total += this.numerologyMap[c] || 0;
        while (total > 9) { let s = 0; while (total > 0) { s += total % 10; total = Math.floor(total / 10); } total = s; }
        return total || 1;
    }

    calculateRashi(name) {
        if (!name) return this.rashiMap[0];
        let n = name.toLowerCase().trim();
        for (let r of this.rashiMap) {
            for (let l of r.letters) if (n.startsWith(l)) return r;
        }
        return this.rashiMap[0];
    }

    processName(data, lang) {
        let safeName = data.name || data.Name;
        if (!safeName) return null;

        const num = this.calculateNumerology(safeName);
        const rashi = this.calculateRashi(safeName);
        const astro = this.astroDetails[num] || this.astroDetails[1];

        const isHindi = lang === 'hi';

        // Get Hindi Name if available in data, or fallback to mapping
        const hName = data.hindiName || data.hindi_name || data.name_hindi || getHindiName(safeName) || "";

        return {
            ...data,
            name: safeName, // English Name
            name_en: safeName,
            name_hi: hName,

            // Meaning logic: preserve whatever is in data (might be English or Hindi based on source)
            meaning: data.meaning || (isHindi ? "à¤¡à¥‡à¤Ÿà¤¾à¤¬à¥‡à¤¸ à¤®à¥‡à¤‚ à¤¨à¤¹à¥€à¤‚ à¤®à¤¿à¤²à¤¾" : "Meaning not in database"),
            meaning_en: data.meaning_en || data.meaning || "Meaning not available", // Attempt to have an En version
            gender: data.gender || "Unknown",
            origin: data.origin || (isHindi ? "à¤¸à¤‚à¤¸à¥à¤•à¥ƒà¤¤/à¤­à¤¾à¤°à¤¤à¥€à¤¯" : "Sanskrit/Indian"),
            origin_en: data.origin_en || data.origin || "Sanskrit/Indian",

            // Bilingual versions for poster control
            rashi: isHindi ? rashi.rashi_hi : rashi.rashi_en,
            rashi_en: rashi.rashi_en,
            rashi_hi: rashi.rashi_hi,

            nakshatra: rashi.nakshatras.join(", "),

            phal: isHindi ? rashi.phal_hi : rashi.phal_en,
            phal_en: rashi.phal_en,
            phal_hi: rashi.phal_hi,

            rashiphal: isHindi ? rashi.rashiphal_hi : rashi.rashiphal_en,
            rashiphal_en: rashi.rashiphal_en,
            rashiphal_hi: rashi.rashiphal_hi,

            num: num,
            planet: isHindi ? astro.planet_hi : astro.planet_en,
            planet_en: astro.planet_en,
            planet_hi: astro.planet_hi,

            color: isHindi ? astro.color_hi : astro.color_en,
            color_en: astro.color_en,
            color_hi: astro.color_hi,

            luckyNumbers: astro.lucky_nos,
            numFal: isHindi ? astro.fal_hi : astro.fal_en,
            numFal_en: astro.fal_en,
            numFal_hi: astro.fal_hi,

            labels: {
                meaning: isHindi ? "à¤…à¤°à¥à¤¥" : "Meaning",
                gender: isHindi ? "à¤²à¤¿à¤‚à¤—" : "Gender",
                origin: isHindi ? "à¤®à¥‚à¤²" : "Origin",
                vedicTitle: isHindi ? "ðŸ”® à¤µà¥ˆà¤¦à¤¿à¤• à¤œà¥à¤¯à¥‹à¤¤à¤¿à¤·" : "ðŸ”® Vedic Astrology",
                rashi: isHindi ? "à¤°à¤¾à¤¶à¤¿" : "Rashi",
                nakshatra: isHindi ? "à¤¨à¤•à¥à¤·à¤¤à¥à¤°" : "Nakshatra",
                personality: isHindi ? "2026 à¤­à¤µà¤¿à¤·à¥à¤¯à¤µà¤¾à¤£à¥€" : "2026 Prediction",
                rashiphalTitle: isHindi ? "âœ¨ 2026 à¤°à¤¾à¤¶à¤¿à¤«à¤²" : "âœ¨ 2026 Horoscope",
                numTitle: isHindi ? "ðŸ”¢ à¤…à¤‚à¤• à¤œà¥à¤¯à¥‹à¤¤à¤¿à¤·" : "ðŸ”¢ Numerology",
                number: isHindi ? "à¤…à¤‚à¤•" : "Number",
                planet: isHindi ? "à¤—à¥à¤°à¤¹" : "Planet",
                luckyColor: isHindi ? "à¤¶à¥à¤­ à¤°à¤‚à¤—" : "Lucky Color",
                luckyNos: isHindi ? "à¤¶à¥à¤­ à¤…à¤‚à¤•" : "Lucky Numbers",
                prediction: isHindi ? "à¤­à¤µà¤¿à¤·à¥à¤¯à¤«à¤²" : "Prediction"
            }
        };
    }
}

const engine = new AstroEngine();
window.astroEngine = engine;
window.AstroEngine = AstroEngine;

let namesData = [];

// --- FALLBACK DATA FOR OFFLINE MODE ---
const FALLBACK_DATA = {
    Boy: [
        { "name": "Aarav", "meaning": "Peaceful, calm, melodious sound" }, { "name": "Aditya", "meaning": "Sun, son of Aditi" },
        { "name": "Arjun", "meaning": "Bright, shining, white" }, { "name": "Aryan", "meaning": "Noble, honorable" },
        { "name": "Ayaan", "meaning": "Gift of God" }, { "name": "Avik", "meaning": "Brave, fearless" },
        { "name": "Anay", "meaning": "Without a leader, supreme" }, { "name": "Arnav", "meaning": "Ocean, vast" },
        { "name": "Aarush", "meaning": "First ray of sun" }, { "name": "Aahan", "meaning": "Dawn, sunrise" },
        { "name": "Bhavesh", "meaning": "Lord of the world" }, { "name": "Bhuvan", "meaning": "Earth, world" },
        { "name": "Bharat", "meaning": "India, universal monarch" }, { "name": "Brijesh", "meaning": "Lord of Brij" },
        { "name": "Chirag", "meaning": "Lamp, light" }, { "name": "Chetan", "meaning": "Consciousness, intelligence" },
        { "name": "Dev", "meaning": "God, divine" }, { "name": "Darshan", "meaning": "Sight, vision" },
        { "name": "Dhruv", "meaning": "Pole star" }, { "name": "Dinesh", "meaning": "Lord of the day, sun" },
        { "name": "Eshan", "meaning": "Lord Shiva" }, { "name": "Ekansh", "meaning": "Whole, complete" },
        { "name": "Farhan", "meaning": "Happy, joyful" }, { "name": "Faisal", "meaning": "Decisive" },
        { "name": "Gaurav", "meaning": "Honor, pride" }, { "name": "Gagan", "meaning": "Sky" },
        { "name": "Harsh", "meaning": "Happiness, joy" }, { "name": "Hriday", "meaning": "Heart, soul" },
        { "name": "Ishan", "meaning": "Sun, Lord Shiva" }, { "name": "Ishaan", "meaning": "Sun, Lord Vishnu" },
        { "name": "Jay", "meaning": "Victory" }, { "name": "Jatin", "meaning": "Disciplined" },
        { "name": "Karan", "meaning": "Helper" }, { "name": "Kunal", "meaning": "Lotus" },
        { "name": "Lakshya", "meaning": "Aim" }, { "name": "Manish", "meaning": "God of mind" },
        { "name": "Nikhil", "meaning": "Complete" }, { "name": "Om", "meaning": "Sacred syllable" },
        { "name": "Pranav", "meaning": "Sacred syllable Om" }, { "name": "Rohan", "meaning": "Ascending" },
        { "name": "Rahul", "meaning": "Conqueror of miseries" }, { "name": "Sahil", "meaning": "Guide, Shore" },
        { "name": "Samar", "meaning": "Battle, War" }, { "name": "Shaurya", "meaning": "Bravery" },
        { "name": "Shiv", "meaning": "Lord Shiva" }, { "name": "Tanish", "meaning": "Ambition" },
        { "name": "Uday", "meaning": "Sunrise" }, { "name": "Vihaan", "meaning": "Dawn" },
        { "name": "Yash", "meaning": "Fame, Glory" }, { "name": "Zaid", "meaning": "Abundance" }
    ],
    Girl: [
        { "name": "Ansi", "meaning": "God's Gift" }, { "name": "Ananya", "meaning": "Unique" },
        { "name": "Aisha", "meaning": "Life" }, { "name": "Aditi", "meaning": "Boundless" },
        { "name": "Anika", "meaning": "Grace" }, { "name": "Avni", "meaning": "Earth" },
        { "name": "Bhavya", "meaning": "Magnificent" }, { "name": "Bina", "meaning": "Musical instrument" },
        { "name": "Chhavi", "meaning": "Reflection" }, { "name": "Charvi", "meaning": "Beautiful" },
        { "name": "Diya", "meaning": "Lamp" }, { "name": "Deepika", "meaning": "Light" },
        { "name": "Eesha", "meaning": "Purity" }, { "name": "Eshita", "meaning": "Desired" },
        { "name": "Falak", "meaning": "Sky" }, { "name": "Farah", "meaning": "Happiness" },
        { "name": "Gauri", "meaning": "Fair" }, { "name": "Gitanjali", "meaning": "Songs" },
        { "name": "Harini", "meaning": "Deer" }, { "name": "Himani", "meaning": "Snow" },
        { "name": "Isha", "meaning": "Protector" }, { "name": "Ira", "meaning": "Earth" },
        { "name": "Jahnavi", "meaning": "Ganga River" }, { "name": "Jivika", "meaning": "Source of Life" },
        { "name": "Kavya", "meaning": "Poetry" }, { "name": "Kiara", "meaning": "Bright" },
        { "name": "Laxmi", "meaning": "Wealth" }, { "name": "Lavanya", "meaning": "Grace" },
        { "name": "Mira", "meaning": "Ocean" }, { "name": "Madhavi", "meaning": "Sweet" },
        { "name": "Nisha", "meaning": "Night" }, { "name": "Nandini", "meaning": "Daughter" },
        { "name": "Ojasvi", "meaning": "Energetic" }, { "name": "Omisha", "meaning": "Goddess of Birth" },
        { "name": "Prisha", "meaning": "Gift of God" }, { "name": "Pavitra", "meaning": "Pure" },
        { "name": "Riya", "meaning": "Singer" }, { "name": "Radhika", "meaning": "Success" },
        { "name": "Saanvi", "meaning": "Goddess Lakshmi" }, { "name": "Shruti", "meaning": "Scripture" },
        { "name": "Tanya", "meaning": "Fairy Princess" }, { "name": "Trisha", "meaning": "Desire" },
        { "name": "Urvashi", "meaning": "Celestial" }, { "name": "Ujjwala", "meaning": "Bright" },
        { "name": "Vaishnavi", "meaning": "Devotee of Vishnu" }, { "name": "Vanya", "meaning": "Grace" },
        { "name": "Waniya", "meaning": "Gift" }, { "name": "Yashvi", "meaning": "Fame" },
        { "name": "Zara", "meaning": "Princess" }, { "name": "Zoya", "meaning": "Life" }
    ]
};

// --- FAVORITES MANAGER CLASS ---
class FavoritesManager {
    constructor() {
        this.storageKey = 'naamin_favorites_v1';
        this.favorites = this.load();
        this.updateHeaderCount();
    }

    load() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
        this.updateHeaderCount();
    }

    toggle(nameObj) {
        const name = nameObj.name || nameObj.Name;
        const exists = this.favorites.find(item => (item.name || item.Name) === name);

        if (exists) {
            this.favorites = this.favorites.filter(item => (item.name || item.Name) !== name);
            return false; // Removed
        } else {
            this.favorites.push(nameObj);
            return true; // Added
        }
    }

    isFavorite(name) {
        return this.favorites.some(item => (item.name || item.Name) === name);
    }

    clear() {
        this.favorites = [];
        this.save();
    }

    updateHeaderCount() {
        const countSpan = document.getElementById('fav-count');
        if (countSpan) countSpan.textContent = this.favorites.length;
    }
}

const favManager = new FavoritesManager();
window.favManager = favManager;
window.FavoritesManager = FavoritesManager;

// Notify shortlist hub whenever favorites change
const _favSave = favManager.save.bind(favManager);
favManager.save = function () {
    _favSave();
    document.dispatchEvent(new CustomEvent('shortlistChanged'));
};


document.addEventListener("DOMContentLoaded", () => {

    // Initialize Speech Synthesis voices (needed for pronunciation feature)
    if ('speechSynthesis' in window) {
        // Load voices - some browsers need this explicitly
        let voicesLoaded = false;

        function loadVoices() {
            const voices = speechSynthesis.getVoices();
            if (voices.length > 0) {
                voicesLoaded = true;
                console.log('Speech synthesis voices loaded:', voices.length);
            }
            return voices;
        }

        // Initial load
        loadVoices();

        // Some browsers fire this event when voices are loaded
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }

        // Fallback: try loading after a short delay
        setTimeout(() => {
            if (!voicesLoaded) {
                loadVoices();
            }
        }, 100);
    }

    // Header Padding
    const header = document.querySelector('header');
    if (header) document.body.style.paddingTop = `${header.offsetHeight}px`;

    // Theme Toggle
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
        const saved = localStorage.getItem("theme") || "light";
        document.body.setAttribute("data-theme", saved);
        themeBtn.innerHTML = saved === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        themeBtn.onclick = () => {
            const current = document.body.getAttribute("data-theme");
            const next = current === "dark" ? "light" : "dark";
            document.body.setAttribute("data-theme", next);
            localStorage.setItem("theme", next);
            themeBtn.innerHTML = next === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        };
    }

    // ========== MOBILE MENU - FIXED ==========
    const hamburger = document.getElementById("hamburger-menu");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileDropdown = document.querySelector(".mobile-dropdown");
    const mobileDropdownToggle = document.querySelector(".mobile-dropdown-toggle");

    // Toggle mobile menu
    if (hamburger && mobileMenu) {
        hamburger.addEventListener("click", (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle("open");

            // Change hamburger icon
            const icon = hamburger.querySelector('i');
            if (icon) {
                if (mobileMenu.classList.contains("open")) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            }
        });
    }

    // Mobile dropdown toggle
    if (mobileDropdownToggle && mobileDropdown) {
        mobileDropdownToggle.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            mobileDropdown.classList.toggle("open");
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
        if (mobileMenu && hamburger) {
            if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
                mobileMenu.classList.remove("open");
                const icon = hamburger.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
        }
    });

    // Close mobile menu when clicking a link
    if (mobileMenu) {
        const mobileLinks = mobileMenu.querySelectorAll('a:not(.mobile-dropdown-toggle)');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                const icon = hamburger?.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            });
        });
    }

    // Language toggle sync removed because they now have direct handlers below


    // Sync favorites button between desktop and mobile
    const favBtnDesktop = document.getElementById('fav-view-btn');
    const favBtnMobileSync = document.getElementById('fav-view-btn-mobile');

    if (favBtnMobileSync && favBtnDesktop) {
        favBtnMobileSync.addEventListener('click', () => {
            favBtnDesktop.click();
        });
    }

    // Sync favorites count
    function syncFavoritesCount() {
        const countDesktop = document.getElementById('fav-count');
        const countMobile = document.getElementById('fav-count-mobile');
        if (countDesktop && countMobile) {
            countMobile.textContent = countDesktop.textContent;
        }
    }

    // Watch for changes in favorites count
    const favCountObserver = new MutationObserver(syncFavoritesCount);
    const favCountElement = document.getElementById('fav-count');
    if (favCountElement) {
        favCountObserver.observe(favCountElement, { childList: true, characterData: true, subtree: true });
    }

    // Initial sync
    syncFavoritesCount();

    // Dropdown behavior for new navbar
    document.querySelectorAll('.dropdown-toggle').forEach(function (toggle) {
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var li = toggle.closest('.dropdown');
            if (!li) return;
            li.classList.toggle('open');
        });
    });

    // Close dropdowns when clicking elsewhere
    document.addEventListener('click', function (e) {
        document.querySelectorAll('.dropdown.open').forEach(function (d) {
            if (!d.contains(e.target)) d.classList.remove('open');
        });
    });

    // Allow keyboard toggle with Enter/Space
    document.querySelectorAll('.dropdown-toggle').forEach(function (el) {
        el.setAttribute('tabindex', '0');
        el.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); el.click(); } });
    });

    // Scroll To Top
    const scrollBtn = document.getElementById("scrollToTopBtn");
    if (scrollBtn) {
        window.addEventListener("scroll", () => {
            scrollBtn.classList.toggle("show", window.scrollY > 300);
            scrollBtn.style.opacity = window.scrollY > 300 ? "1" : "0";
            scrollBtn.style.visibility = window.scrollY > 300 ? "visible" : "hidden";
        });
        scrollBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Language Handling
    function getLanguage() {
        return localStorage.getItem("language") || "en";
    }

    function namesFileForGender(gender) {
        const lang = getLanguage() === 'hi' ? 'hi' : 'en';
        // return a list of candidate filenames (some files in the repo use slightly different suffixes)
        if (lang === 'hi') {
            return gender === 'Boy'
                ? ['boy_names_hi.json', 'boy_names_hin.json', 'boy_names_hi.json', 'boy_names.json']
                : ['girl_names_hi.json', 'girl_names_hi.json', 'girl_names.json'];
        }
        return gender === 'Boy'
            ? ['boy_names_eng.json', 'boy_names_en.json', 'bnames.json']
            : ['girl_names_eng.json', 'girl_names_en.json', 'gnames.json'];
    }

    async function fetchFirstJson(candidates) {
        if (!Array.isArray(candidates)) candidates = [candidates];
        // Cache-busting: add timestamp to force reload of updated JSON files
        const cacheBuster = `?v=${Date.now()}`;
        for (const f of candidates) {
            try {
                const res = await fetch(f + cacheBuster);
                if (!res.ok) { console.debug('fetchFirstJson: skip', f, res.status); continue; }
                const j = await res.json();
                console.debug('fetchFirstJson: loaded', f, Array.isArray(j) ? j.length + ' items' : typeof j);
                return { data: j, file: f };
            } catch (err) {
                console.debug('fetchFirstJson: error', f, err);
                continue;
            }
        }
        return null;
    }

    // Expose helper functions for tests
    if (typeof window !== 'undefined') {
        window.namesFileForGender = namesFileForGender;
        window.fetchFirstJson = fetchFirstJson;
        window.getLanguage = getLanguage;
    }

    function updateContent(lang) {
        console.log("Script.js: updateContent called with lang:", lang);
        document.documentElement.lang = lang;
        localStorage.setItem("language", lang);
        const translatableElements = document.querySelectorAll("[data-en]");
        translatableElements.forEach(el => {
            const text = el.getAttribute(lang === "hi" ? "data-hi" : "data-en");
            if (text) {
                if (el.getAttribute('href') && el.getAttribute('href').includes('popular-names')) {
                    console.log("Script.js: Translating Popular Names element to: " + text);
                }
                el.textContent = text;
            }
        });

        // Dispatch global event for other scripts to react
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: lang } }));

        const inp = document.getElementById("hero-search-input");
        if (inp) inp.placeholder = lang === "hi" ? "à¤‰à¤¦à¤¾: à¤†à¤°à¤µ, à¤…à¤¦à¥à¤µà¤¿à¤•..." : "e.g., Aarav, Advik...";

        // If name finder is visible, reload names for currently selected gender so JSON file/language updates instantly
        try {
            const activeGenderBtn = document.querySelector('.gender-btn.active-boy, .gender-btn.active-girl');
            if (activeGenderBtn) {
                // trigger click to reload names using existing handlers
                activeGenderBtn.click();
            }
        } catch (e) {
            console.debug('updateContent: no gender controls yet');
        }
    }

    const langBtn = document.getElementById("language-toggle");
    if (langBtn) langBtn.onclick = () => {
        const newLang = getLanguage() === "hi" ? "en" : "hi";
        updateContent(newLang);
    };

    const langBtnMobile = document.getElementById("language-toggle-mobile");
    if (langBtnMobile) langBtnMobile.onclick = () => {
        const newLang = getLanguage() === "hi" ? "en" : "hi";
        updateContent(newLang);
    };
    updateContent(getLanguage());

    // --- Aura Plan Click Logic ---
    const pricingSection = document.querySelector('.pricing-grid');
    if (pricingSection) {
        pricingSection.addEventListener('click', function (e) {
            const header = e.target.closest('.pricing-card-header');
            if (header) {
                const card = header.closest('.pricing-card');
                if (card) {
                    card.classList.toggle('expanded');
                }
            }
        });
    }

    // Helper: Show Details UI (UPDATED WITH HEART BUTTON)
    function showDetails(box, data) {
        window.showDetails = showDetails;

        if (!box || !data) return;
        const L = data.labels;
        const isFav = favManager.isFavorite(data.name);

        // Determine gender class for pink/purple coloring
        const gender = data.gender || 'Boy';
        const genderClass = gender === 'Girl' ? 'girl-name' : 'boy-name';

        box.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h2 class="${genderClass}">${data.name}</h2>
                <div style="display:flex; gap:10px;">
                    <button class="pronounce-name-btn" id="pronounce-name-btn" title="Play name pronunciation" aria-label="Play name pronunciation">
                        <i class="fas fa-volume-up"></i>
                    </button>
                    <button class="download-btn" id="download-poster-btn" title="Download Poster">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="card-heart-btn ${isFav ? 'active' : ''}" id="detail-heart-btn">
                        <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
            </div>
            <div class="detail-grid" style="text-align: left; margin-top: 20px;">
                <p><strong>${L.meaning}:</strong> ${data.meaning}</p>
                <p><strong>${L.gender}:</strong> ${getLanguage() === 'hi' ? (data.gender === 'Boy' ? 'à¤²à¤¡à¤¼à¤•à¤¾' : 'à¤²à¤¡à¤¼à¤•à¥€') : data.gender}</p> 
                <p><strong>${L.origin}:</strong> ${data.origin}</p>
                <hr style="margin: 15px 0; border: 0; border-top: 1px solid #ddd;">
                <h3>${L.vedicTitle}</h3>
                <p><strong>${L.rashi}:</strong> ${data.rashi}</p>
                <p><strong>${L.nakshatra}:</strong> ${data.nakshatra}</p>
                <p><strong>${L.personality}:</strong> ${data.phal}</p>
                <p style="margin-top:10px; background: rgba(0,0,0,0.05); padding:10px; border-radius:8px;">
                    <strong>${L.rashiphalTitle}:</strong><br> ${data.rashiphal}
                </p>
                <hr style="margin: 15px 0; border: 0; border-top: 1px solid #ddd;">
                <h3>${L.numTitle}</h3>
                <p><strong>${L.number}:</strong> ${data.num}</p>
                <p><strong>${L.planet}:</strong> ${data.planet}</p>
                <p><strong>${L.luckyColor}:</strong> ${data.color}</p>
                <p><strong>${L.luckyNos}:</strong> ${data.luckyNumbers}</p>
                <p style="margin-top:10px;">
                    <strong>${L.prediction}:</strong> ${data.numFal}
                </p>
            </div>
        `;

        // --- HEART BUTTON LOGIC ---
        const hb = document.getElementById('detail-heart-btn');
        if (hb) {
            hb.onclick = (e) => {
                e.stopPropagation();
                const added = favManager.toggle(data);
                favManager.save();
                hb.classList.toggle('active', added);
                hb.querySelector('i').className = added ? 'fas fa-heart' : 'far fa-heart';
                renderNames();
            };
        }



        // --- PRONUNCIATION BUTTON LOGIC (NEW) ---
        const pronounceBtn = document.getElementById('pronounce-name-btn');
        if (pronounceBtn) {
            // Check if browser supports speech synthesis
            const speechSupported = 'speechSynthesis' in window;

            if (!speechSupported) {
                // Disable button if not supported
                pronounceBtn.style.opacity = '0.5';
                pronounceBtn.style.cursor = 'not-allowed';
                pronounceBtn.title = 'Pronunciation not supported on this device';
            } else {
                let currentUtterance = null;

                pronounceBtn.onclick = () => {
                    // Cancel any ongoing speech
                    if (currentUtterance) {
                        speechSynthesis.cancel();
                    }

                    // Create new utterance
                    currentUtterance = new SpeechSynthesisUtterance(data.name);

                    // Get best available voice
                    const voices = speechSynthesis.getVoices();
                    const priorities = [
                        (v) => v.lang.includes('en-IN'),  // Indian English
                        (v) => v.lang.includes('en-GB'),  // British English
                        (v) => v.lang.startsWith('en'),   // Any English
                        (v) => v.name.toLowerCase().includes('female'), // Female voice
                        (v) => true  // Any voice
                    ];

                    for (const priorityFn of priorities) {
                        const voice = voices.find(priorityFn);
                        if (voice) {
                            currentUtterance.voice = voice;
                            break;
                        }
                    }

                    // Configure speech settings
                    currentUtterance.rate = 0.85;  // Slightly slower for clarity
                    currentUtterance.pitch = 1.0;  // Natural pitch
                    currentUtterance.volume = 1.0; // Full volume

                    // Add playing class for animation
                    currentUtterance.onstart = () => {
                        pronounceBtn.classList.add('playing');
                    };

                    currentUtterance.onend = () => {
                        pronounceBtn.classList.remove('playing');
                        currentUtterance = null;
                    };

                    currentUtterance.onerror = (event) => {
                        console.error('Speech synthesis error:', event);
                        pronounceBtn.classList.remove('playing');
                        currentUtterance = null;
                    };

                    // Speak the name
                    speechSynthesis.speak(currentUtterance);
                };

                // Keyboard accessibility
                pronounceBtn.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        pronounceBtn.click();
                    }
                });
            }
        }

        // --- POSTER DOWNLOAD LOGIC ---
        const downloadBtn = document.getElementById('download-poster-btn');
        if (downloadBtn) {
            downloadBtn.onclick = async () => {
                try {
                    // Show loading state
                    const originalHTML = downloadBtn.innerHTML;
                    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                    downloadBtn.disabled = true;

                    // Lucky color palette based on numerology
                    const luckyColors = {
                        1: '#FFD700', // Sun - Gold
                        2: '#C0C0C0', // Moon - Silver
                        3: '#FF8C00', // Jupiter - Orange/Yellow
                        4: '#4169E1', // Rahu - Royal Blue
                        5: '#32CD32', // Mercury - Green
                        6: '#FF1493', // Venus - Pink
                        7: '#708090', // Ketu - Grey
                        8: '#2F4F4F', // Saturn - Dark Slate
                        9: '#DC143C'  // Mars - Crimson
                    };

                    // Get the poster card element
                    const posterCard = document.getElementById('poster-card');
                    const luckyColor = luckyColors[data.num] || '#FF8C00';

                    // Set dynamic lucky color CSS variable
                    posterCard.style.setProperty('--lucky-color', luckyColor);

                    const setIfExist = (id, text) => {
                        const el = document.getElementById(id);
                        if (el) {
                            if (text) {
                                el.textContent = text;
                                el.style.display = ''; // Reset display
                            } else {
                                el.style.display = 'none'; // Hide if empty
                            }
                        }
                    };

                    setIfExist('poster-name-en', data.name_en);
                    setIfExist('poster-name-hi', data.name_hi);

                    // Meaning remains as-is (source-dependent) but other details forced to English
                    setIfExist('poster-meaning', data.meaning);
                    setIfExist('poster-gender', data.gender);
                    setIfExist('poster-origin', data.origin);
                    setIfExist('poster-nakshatra', data.nakshatra); // Nakshatras are mostly transliterated already
                    setIfExist('poster-rashi', data.rashi_en);

                    // Single Panel Data (Forced English)
                    setIfExist('poster-number', data.num);
                    setIfExist('poster-planet', data.planet_en);
                    setIfExist('poster-color', data.color_en);
                    setIfExist('poster-aura', data.phal_en || 'Energetic and dynamic personality.');

                    // Prediction (Forced English)
                    setIfExist('poster-year', new Date().getFullYear());
                    setIfExist('poster-prediction', data.rashiphal_en || '2026 brings new opportunities and growth.');

                    // Update gender icon (Safely preserving other classes)
                    const genderIcon = document.getElementById('poster-gender-icon');
                    if (genderIcon) {
                        genderIcon.classList.remove('fa-venus', 'fa-mars', 'fa-venus-mars');
                        if (data.gender === 'Girl') {
                            genderIcon.classList.add('fa-venus');
                        } else {
                            genderIcon.classList.add('fa-mars');
                        }
                    }

                    // Wait a moment for fonts/CSS to apply
                    await new Promise(resolve => setTimeout(resolve, 100));

                    // Generate high-quality poster using html2canvas
                    const canvas = await html2canvas(posterCard, {
                        scale: 3, // High resolution
                        backgroundColor: posterCard.classList.contains('premium-variant') ? '#FCF9F2' : '#FFF8E7',
                        logging: false,
                        useCORS: true,
                        allowTaint: false
                    });

                    // Convert to blob and download
                    canvas.toBlob((blob) => {
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.download = `Naamin_${data.name.replace(/\s+/g, '_')}_Poster.png`;
                        link.href = url;
                        link.click();
                        URL.revokeObjectURL(url);

                        // Reset button
                        downloadBtn.innerHTML = originalHTML;
                        downloadBtn.disabled = false;
                    }, 'image/png', 1.0);

                } catch (error) {
                    console.error('Poster generation error:', error);
                    alert('Failed to generate poster. Please try again.');
                    downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
                    downloadBtn.disabled = false;
                }
            };
        }


    }

    // === SEARCH LOGIC ===
    async function handleHeroSearch() {
        const input = document.getElementById('hero-search-input');
        if (!input || !input.value.trim()) return;
        const term = input.value.trim().toLowerCase();

        const section = document.getElementById('name-finder');
        const detailsBox = document.querySelector('.name-details');
        const listContainer = document.querySelector('.name-list-container');
        const detailsContainer = document.querySelector('.name-details-container');

        if (section) {
            window.scrollTo({ top: section.offsetTop - 100, behavior: 'smooth' });
            if (listContainer) listContainer.style.display = 'none';
            if (detailsContainer) detailsContainer.style.display = 'block';
            if (detailsBox) detailsBox.innerHTML = '<div class="spinner">Searching...</div>';

            try {
                const bCandidates = namesFileForGender('Boy');
                const gCandidates = namesFileForGender('Girl');
                const bLoaded = await fetchFirstJson(bCandidates);
                const gLoaded = await fetchFirstJson(gCandidates);

                const bRaw = bLoaded && bLoaded.data ? bLoaded.data : [];
                const gRaw = gLoaded && gLoaded.data ? gLoaded.data : [];

                const boys = (Array.isArray(bRaw) ? bRaw : Object.values(bRaw).find(v => Array.isArray(v)) || []).map(item => ({ ...item, gender: 'Boy' }));
                const girls = (Array.isArray(gRaw) ? gRaw : Object.values(gRaw).find(v => Array.isArray(v)) || []).map(item => ({ ...item, gender: 'Girl' }));

                const all = [].concat(boys, girls);
                const found = all.find(n => (n.name || n.Name).toLowerCase() === term);

                if (found) {
                    const smartData = engine.processName(found, getLanguage());
                    showDetails(detailsBox, smartData);
                } else {
                    const isHindi = getLanguage() === 'hi';
                    const msg = isHindi
                        ? "à¤œà¤²à¥à¤¦à¥€ à¤† à¤°à¤¹à¤¾ à¤¹à¥ˆ, à¤•à¥ƒà¤ªà¤¯à¤¾ à¤ªà¥à¤°à¤¤à¥€à¤•à¥à¤·à¤¾ à¤•à¤°à¥‡à¤‚, à¤¹à¤® à¤†à¤ªà¤•à¥‡ à¤§à¥ˆà¤°à¥à¤¯ à¤•à¥€ à¤¸à¤°à¤¾à¤¹à¤¨à¤¾ à¤•à¤°à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤"
                        : "Coming soon, please wait, we appreciate your patience.";

                    detailsBox.innerHTML = `
                        <div style="text-align: center; padding: 40px;">
                            <i class="fas fa-hourglass-half" style="font-size: 3rem; color: var(--accent-primary); margin-bottom: 20px;"></i>
                            <h3 style="color: var(--text-dark);">${isHindi ? "à¤ªà¤°à¤¿à¤£à¤¾à¤® à¤¨à¤¹à¥€à¤‚ à¤®à¤¿à¤²à¤¾" : "No Result Found"}</h3>
                            <p style="font-size: 1.2rem; color: var(--text-medium); margin-top: 10px;">${msg}</p>
                        </div>
                    `;
                }

            } catch (e) {
                console.error(e);
                detailsBox.innerHTML = "<p>Search error. Please try again.</p>";
            }
        }
    }

    const sBtn = document.getElementById('hero-search-btn');
    const sInp = document.getElementById('hero-search-input');
    if (sBtn) sBtn.onclick = handleHeroSearch;
    if (sInp) sInp.onkeypress = (e) => { if (e.key === "Enter") handleHeroSearch(); };

    // === A-Z LIST LOGIC (UPDATED WITH HEARTS) ===
    const nameFinderSection = document.getElementById('name-finder');
    if (nameFinderSection) {
        const alphabetContainer = document.querySelector('.alphabet-selector');
        const nameListContainer = document.querySelector('.name-list');
        const nameDetailsBox = document.querySelector('.name-details');
        const nameDetailsContainer = document.querySelector('.name-details-container');
        const genderBtns = document.querySelectorAll('.gender-btn');
        const backBtn = document.querySelector('.back-btn');

        let currentGender = "Boy";
        let currentLetter = "A";

        async function loadNames(gender) {
            const candidates = namesFileForGender(gender);
            try {
                if (nameListContainer) nameListContainer.innerHTML = '<div class="spinner">Loading...</div>';
                let loaded = await fetchFirstJson(candidates);

                // FALLBACK IF FETCH FAILS
                if (!loaded || !loaded.data) {
                    console.warn('loadNames: fetch failed, using fallback data');
                    const fallbackKey = gender === 'Boy' ? 'Boy' : 'Girl';
                    loaded = { data: FALLBACK_DATA[fallbackKey], file: 'fallback_builtin' };

                    // Show user notification about offline mode
                    if (!document.getElementById('offline-toast')) {
                        const toast = document.createElement('div');
                        toast.id = 'offline-toast';
                        toast.style.cssText = "position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:rgba(50,50,50,0.9); color:white; padding:10px 20px; border-radius:30px; z-index:9999; font-size:12px; pointer-events:none; opacity:0; transition:opacity 0.5s;";
                        toast.textContent = "Offline Mode: Using sample names. Run local server for full list.";
                        document.body.appendChild(toast);
                        setTimeout(() => toast.style.opacity = '1', 100);
                        setTimeout(() => toast.style.opacity = '0', 5000);
                    }
                }

                if (!loaded || !loaded.data) {
                    // This should not happen with fallback
                    if (nameListContainer) nameListContainer.innerHTML = `<p>Error loading names.</p>`;
                    namesData = [];
                    renderNames();
                    return;
                }

                let rawData = loaded.data;
                let rawArray = [];
                if (Array.isArray(rawData)) rawArray = rawData;
                else rawArray = Object.values(rawData).find(v => Array.isArray(v)) || [];

                namesData = rawArray.map(item => ({ ...item, gender: gender }));
                console.debug('loadNames: using file', loaded.file, 'items', namesData.length);
                renderNames();
            } catch (error) {
                console.error('loadNames error', error);
                if (nameListContainer) nameListContainer.innerHTML = `<p>Error loading names. See console.</p>`;
            }
        }

        function generateAlphabet() {
            if (!alphabetContainer) return;
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
            alphabetContainer.innerHTML = "";
            chars.forEach(char => {
                const btn = document.createElement("button");
                btn.className = `alphabet-btn ${char === currentLetter ? 'active' : ''}`;
                btn.textContent = char;
                btn.onclick = () => {
                    document.querySelectorAll('.alphabet-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    currentLetter = char;
                    renderNames();
                };
                alphabetContainer.appendChild(btn);
            });
        }

        // Updated Render Names to include Heart Icon
        function renderNames() {
            if (!nameListContainer) return;
            nameListContainer.innerHTML = "";
            const listSection = document.querySelector('.name-list-container');
            if (listSection) listSection.style.display = 'block';
            if (nameDetailsContainer) nameDetailsContainer.style.display = 'none';

            if (!Array.isArray(namesData)) return;
            console.debug('renderNames: namesData length', namesData.length, 'currentLetter', currentLetter);
            const filtered = namesData.filter(n => {
                let nName = n.name || n.Name;
                if (!nName) return false;
                try { return nName.toUpperCase().startsWith(currentLetter); } catch (e) { return false; }
            });
            console.debug('renderNames: filtered length', filtered.length);

            if (filtered.length === 0) {
                nameListContainer.innerHTML = `<p style="width:100%; text-align:center;">No names found.</p>`;
                return;
            }

            filtered.forEach(person => {
                const pName = person.name || person.Name;
                const isFav = favManager.isFavorite(pName);
                const gender = person.gender || 'Boy';
                const genderClass = gender === 'Girl' ? 'girl-name' : 'boy-name';

                const div = document.createElement("div");
                div.className = `name-item ${genderClass}`;
                // Structure: Name text + Speaker Button + Heart Button
                div.innerHTML = `
                    <span class="${genderClass}">${pName}</span>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <button class="pronounce-name-btn" title="Play name pronunciation" aria-label="Play name pronunciation" data-name="${pName}">
                            <i class="fas fa-volume-up"></i>
                        </button>
                        <button class="card-heart-btn ${isFav ? 'active' : ''}" title="Add to favorites">
                            <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
                        </button>
                    </div>
                `;

                // Card Click -> Open Details (but not if clicking buttons)
                div.onclick = (e) => {
                    if (e.target.closest('button')) return;

                    if (listSection) listSection.style.display = 'none';
                    if (nameDetailsContainer) nameDetailsContainer.style.display = 'block';

                    const smartData = engine.processName(person, getLanguage());
                    showDetails(nameDetailsBox, smartData);
                };

                // Speaker Button Click -> Pronounce Name
                const speakerBtn = div.querySelector('.pronounce-name-btn');
                if (speakerBtn) {
                    speakerBtn.onclick = (e) => {
                        e.stopPropagation();

                        if (!('speechSynthesis' in window)) {
                            alert('Speech synthesis not supported on this browser');
                            return;
                        }

                        // Cancel any ongoing speech
                        speechSynthesis.cancel();

                        // Create utterance
                        const utterance = new SpeechSynthesisUtterance(pName);

                        // Get and set best voice
                        const voices = speechSynthesis.getVoices();
                        const priorities = [
                            (v) => v.lang.includes('en-IN'),
                            (v) => v.lang.includes('en-GB'),
                            (v) => v.lang.startsWith('en'),
                            (v) => v.name.toLowerCase().includes('female'),
                            (v) => true
                        ];

                        for (const priorityFn of priorities) {
                            const voice = voices.find(priorityFn);
                            if (voice) {
                                utterance.voice = voice;
                                break;
                            }
                        }

                        // Configure speech
                        utterance.rate = 0.85;
                        utterance.pitch = 1.0;
                        utterance.volume = 1.0;

                        // Visual feedback
                        utterance.onstart = () => speakerBtn.classList.add('playing');
                        utterance.onend = () => speakerBtn.classList.remove('playing');
                        utterance.onerror = (event) => {
                            console.error('Speech error:', event);
                            speakerBtn.classList.remove('playing');
                        };

                        // Speak!
                        speechSynthesis.speak(utterance);
                    };
                }

                // Heart Click -> Toggle Save
                const heartBtn = div.querySelector('.card-heart-btn');
                heartBtn.onclick = (e) => {
                    e.stopPropagation();
                    const added = favManager.toggle(person);
                    favManager.save();
                    heartBtn.classList.toggle('active', added);
                    heartBtn.querySelector('i').className = added ? 'fas fa-heart' : 'far fa-heart';
                };

                nameListContainer.appendChild(div);
            });
        }

        genderBtns.forEach(btn => {
            btn.onclick = () => {
                // Remove both active classes from all buttons
                genderBtns.forEach(b => {
                    b.classList.remove('active-boy');
                    b.classList.remove('active-girl');
                });

                // Add the appropriate active class based on gender
                currentGender = btn.dataset.gender;
                if (currentGender === 'Girl') {
                    btn.classList.add('active-girl');
                } else {
                    btn.classList.add('active-boy');
                }

                // Save gender selection and apply theme
                GenderTheme.save(currentGender);
                GenderTheme.apply(currentGender);

                loadNames(currentGender);
            };
        });

        if (backBtn) backBtn.onclick = () => {
            if (nameDetailsContainer) nameDetailsContainer.style.display = 'none';
            const listSection = document.querySelector('.name-list-container');
            if (listSection) listSection.style.display = 'block';
            renderNames(); // Re-render to update hearts if changed inside details
        };

        generateAlphabet();
        loadNames("Boy");
    }

    // --- FAVORITES MODAL LOGIC ---
    const favBtn = document.getElementById('fav-view-btn');
    const favOverlay = document.getElementById('fav-overlay');
    const closeFavBtn = document.getElementById('close-fav-btn');
    const clearFavBtn = document.getElementById('clear-fav-btn');
    const favListContainer = document.getElementById('fav-list-container');

    if (favBtn) {
        favBtn.onclick = () => {
            openShortlistPanel();
        };
    }

    // If the in-page overlay exists we keep its handlers for backward compatibility
    if (favOverlay) {
        if (closeFavBtn) closeFavBtn.onclick = () => { favOverlay.style.display = 'none'; };
        favOverlay.onclick = (e) => { if (e.target === favOverlay) favOverlay.style.display = 'none'; };
        if (clearFavBtn) clearFavBtn.onclick = () => {
            if (confirm("Are you sure you want to clear all favorites?")) {
                favManager.clear();
                renderFavoritesList();
                renderNames();
            }
        };
    }

    function renderFavoritesList() {
        if (!favListContainer) return;
        favListContainer.innerHTML = "";
        const list = favManager.favorites;

        if (list.length === 0) {
            favListContainer.innerHTML = '<p style="text-align:center; color:var(--text-medium);">No names saved yet.</p>';
            return;
        }

        list.forEach(item => {
            const name = item.name || item.Name;
            const row = document.createElement('div');
            row.className = 'fav-item-row';
            row.innerHTML = `
                <span>${name}</span>
                <button class="fav-remove-btn"><i class="fas fa-trash"></i></button>
            `;

            // Remove item
            row.querySelector('.fav-remove-btn').onclick = (e) => {
                e.stopPropagation();
                favManager.toggle(item);
                favManager.save();
                renderFavoritesList(); // Re-render this list
                renderNames(); // Update background list
            };

            // Click to view details
            row.onclick = () => {
                favOverlay.style.display = 'none'; // Close modal

                // Open details logic
                const section = document.getElementById('name-finder');
                const listSection = document.querySelector('.name-list-container');
                const nameDetailsBox = document.querySelector('.name-details');
                const nameDetailsContainer = document.querySelector('.name-details-container');

                if (section) {
                    window.scrollTo({ top: section.offsetTop - 100, behavior: 'smooth' });
                    if (listSection) listSection.style.display = 'none';
                    if (nameDetailsContainer) nameDetailsContainer.style.display = 'block';
                    const smartData = engine.processName(item, getLanguage());
                    showDetails(nameDetailsBox, smartData);
                }
            };

            favListContainer.appendChild(row);
        });
    }

    // --- NAME SHORTLIST HUB ---
    const shortlistPanel = document.getElementById('shortlist-panel');
    const shortlistBackdrop = document.getElementById('shortlist-backdrop');
    const shortlistCloseBtn = document.getElementById('shortlist-close');
    const shortlistTopGrid = document.getElementById('shortlist-top-grid');
    const shortlistCompareGrid = document.getElementById('shortlist-compare-grid');
    const shortlistList = document.getElementById('shortlist-list');
    const shortlistEmpty = document.getElementById('shortlist-empty');
    const shortlistTop = document.getElementById('shortlist-top');
    const shortlistCompare = document.getElementById('shortlist-compare');
    const shortlistCopyBtn = document.getElementById('shortlist-copy-btn');
    const shortlistShareBtn = document.getElementById('shortlist-share-btn');
    const favBtnMobile = document.getElementById('fav-view-btn-mobile');

    const shortlistMetaKey = 'naamin_shortlist_meta_v1';
    const shortlistFinalKey = 'naamin_shortlist_final_v1';

    function loadShortlistMeta() {
        try {
            return JSON.parse(localStorage.getItem(shortlistMetaKey)) || {};
        } catch (e) {
            return {};
        }
    }

    function saveShortlistMeta(meta) {
        localStorage.setItem(shortlistMetaKey, JSON.stringify(meta));
    }

    let shortlistMeta = loadShortlistMeta();
    let finalName = localStorage.getItem(shortlistFinalKey) || '';

    function getItemName(item) {
        return item?.name || item?.Name || '';
    }

    function getItemMeaning(item) {
        return item?.meaning || item?.Meaning || 'Meaning coming soon';
    }

    function ensureMeta(name) {
        if (!shortlistMeta[name]) {
            shortlistMeta[name] = { category: 'Modern', notes: '', compare: false };
        }
    }

    function openShortlistPanel() {
        if (!shortlistPanel) return;
        shortlistPanel.classList.add('open');
        shortlistPanel.setAttribute('aria-hidden', 'false');
        renderShortlist();
    }

    function closeShortlistPanel() {
        if (!shortlistPanel) return;
        shortlistPanel.classList.remove('open');
        shortlistPanel.setAttribute('aria-hidden', 'true');
    }

    function renderShortlist() {
        if (!shortlistList || !shortlistTopGrid || !shortlistCompareGrid || !shortlistEmpty) return;
        shortlistTopGrid.innerHTML = '';
        shortlistCompareGrid.innerHTML = '';
        shortlistList.innerHTML = '';

        const list = Array.isArray(favManager.favorites) ? favManager.favorites : [];

        if (list.length === 0) {
            shortlistEmpty.style.display = 'block';
            if (shortlistTop) shortlistTop.style.display = 'none';
            if (shortlistCompare) shortlistCompare.style.display = 'none';
            shortlistList.style.display = 'grid';

            const suggestions = [
                { name: 'Aarav', meaning: 'Peaceful', category: 'Modern', image: 'baby_aarav_1768672098297.png' },
                { name: 'Ananya', meaning: 'Unique', category: 'Unique', image: 'baby_ananya_1768672114695.png' },
                { name: 'Diya', meaning: 'Lamp', category: 'Spiritual', image: 'baby_diya_1768672149752.png' },
                { name: 'Vihaan', meaning: 'Dawn', category: 'Modern', image: 'baby_vihaan_1768672167983.png' }
            ];

            shortlistList.innerHTML = `
                <div class="shortlist-suggestions">
                    <h4 class="shortlist-suggestions-title">Suggested baby names</h4>
                    <div class="shortlist-suggestions-grid">
                        ${suggestions.map(item => {
                            const id = `${item.name}`.toLowerCase().replace(/\\s+/g, '-');
                            return `
                                <div class="shortlist-suggest-card">
                                    <img src="${item.image}" alt="${item.name}">
                                    <div class="shortlist-suggest-info">
                                        <div class="shortlist-suggest-name">${item.name}</div>
                                        <div class="shortlist-suggest-meta">${item.meaning}</div>
                                        <div class="shortlist-suggest-tag">${item.category}</div>
                                        <button class="shortlist-suggest-btn" data-suggest-id="${id}" data-name="${item.name}" data-meaning="${item.meaning}" data-category="${item.category}">Save Name</button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;

            document.querySelectorAll('.shortlist-suggest-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const item = {
                        name: btn.getAttribute('data-name'),
                        meaning: btn.getAttribute('data-meaning'),
                        category: btn.getAttribute('data-category')
                    };
                    favManager.toggle(item);
                    favManager.save();
                });
            });
            return;
        }
        shortlistEmpty.style.display = 'none';
        if (shortlistTop) shortlistTop.style.display = 'block';
        shortlistList.style.display = 'grid';

        // Top Picks (first 3)
        list.slice(0, 3).forEach(item => {
            const name = getItemName(item);
            const card = document.createElement('div');
            card.className = 'shortlist-top-card';
            card.innerHTML = `
                <span class="shortlist-top-name">${name}</span>
                ${finalName === name ? '<span class="shortlist-final-badge">Final</span>' : ''}
            `;
            shortlistTopGrid.appendChild(card);
        });

        // Compare section (2–3 selected)
        const compareItems = list.filter(item => {
            const name = getItemName(item);
            return shortlistMeta[name]?.compare;
        }).slice(0, 3);

        if (compareItems.length >= 2) {
            if (shortlistCompare) shortlistCompare.style.display = 'block';
            compareItems.forEach(item => {
                const name = getItemName(item);
                const meaning = getItemMeaning(item);
                const category = shortlistMeta[name]?.category || 'Modern';
                const card = document.createElement('div');
                card.className = 'shortlist-compare-card';
                card.innerHTML = `
                    <h5>${name}</h5>
                    <div class="shortlist-compare-meta">Meaning: ${meaning}</div>
                    <div class="shortlist-compare-meta">Category: ${category}</div>
                `;
                shortlistCompareGrid.appendChild(card);
            });
        }

        // Full list
        list.forEach(item => {
            const name = getItemName(item);
            if (!name) return;
            ensureMeta(name);

            const meaning = getItemMeaning(item);
            const category = shortlistMeta[name].category || 'Modern';
            const notes = shortlistMeta[name].notes || '';
            const compareChecked = shortlistMeta[name].compare ? 'checked' : '';

            const row = document.createElement('div');
            row.className = `shortlist-item ${finalName === name ? 'final' : ''}`;
            row.innerHTML = `
                <div class="shortlist-item-header">
                    <div>
                        <div class="shortlist-item-title">${name}</div>
                        <div class="shortlist-item-meta">${meaning}</div>
                    </div>
                    ${finalName === name ? '<span class="shortlist-final-badge">Final</span>' : ''}
                </div>
                <div class="shortlist-controls">
                    <select class="shortlist-select" data-role="category">
                        <option ${category === 'Modern' ? 'selected' : ''}>Modern</option>
                        <option ${category === 'Spiritual' ? 'selected' : ''}>Spiritual</option>
                        <option ${category === 'Unique' ? 'selected' : ''}>Unique</option>
                    </select>
                    <label class="shortlist-btn">
                        <input type="checkbox" data-role="compare" ${compareChecked} /> Compare
                    </label>
                    <button class="shortlist-btn primary" data-role="final">Mark Final</button>
                    <button class="shortlist-btn" data-role="remove">Remove</button>
                </div>
                <div class="shortlist-notes">
                    <textarea data-role="notes" placeholder="Add a note...">${notes}</textarea>
                </div>
            `;

            const categorySelect = row.querySelector('[data-role="category"]');
            const compareCheckbox = row.querySelector('[data-role="compare"]');
            const finalBtn = row.querySelector('[data-role="final"]');
            const removeBtn = row.querySelector('[data-role="remove"]');
            const notesBox = row.querySelector('[data-role="notes"]');

            if (categorySelect) {
                categorySelect.addEventListener('change', () => {
                    shortlistMeta[name].category = categorySelect.value;
                    saveShortlistMeta(shortlistMeta);
                    renderShortlist();
                });
            }

            if (compareCheckbox) {
                compareCheckbox.addEventListener('change', () => {
                    const selectedCount = list.filter(it => shortlistMeta[getItemName(it)]?.compare).length;
                    if (compareCheckbox.checked && selectedCount >= 3) {
                        compareCheckbox.checked = false;
                        alert('You can compare up to 3 names.');
                        return;
                    }
                    shortlistMeta[name].compare = compareCheckbox.checked;
                    saveShortlistMeta(shortlistMeta);
                    renderShortlist();
                });
            }

            if (finalBtn) {
                finalBtn.addEventListener('click', () => {
                    finalName = name;
                    localStorage.setItem(shortlistFinalKey, finalName);
                    renderShortlist();
                });
            }

            if (removeBtn) {
                removeBtn.addEventListener('click', () => {
                    favManager.toggle(item);
                    favManager.save();
                });
            }

            if (notesBox) {
                notesBox.addEventListener('input', () => {
                    shortlistMeta[name].notes = notesBox.value;
                    saveShortlistMeta(shortlistMeta);
                });
            }

            shortlistList.appendChild(row);
        });
    }

    function buildShareText() {
        const list = Array.isArray(favManager.favorites) ? favManager.favorites : [];
        if (list.length === 0) return 'No names saved yet.';
        return list.map(item => {
            const name = getItemName(item);
            const meaning = getItemMeaning(item);
            const category = shortlistMeta[name]?.category || 'Modern';
            return `${name} — ${meaning} (${category})`;
        }).join('\n');
    }

    if (shortlistCopyBtn) {
        shortlistCopyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(buildShareText());
                shortlistCopyBtn.textContent = 'Copied!';
                setTimeout(() => shortlistCopyBtn.textContent = 'Copy', 1200);
            } catch (e) {
                alert('Copy failed. Please try again.');
            }
        });
    }

    if (shortlistShareBtn) {
        shortlistShareBtn.addEventListener('click', async () => {
            const text = buildShareText();
            if (navigator.share) {
                try {
                    await navigator.share({ title: 'Naamin Shortlist', text });
                } catch (e) { }
            } else {
                try {
                    await navigator.clipboard.writeText(text);
                    shortlistShareBtn.textContent = 'Copied!';
                    setTimeout(() => shortlistShareBtn.textContent = 'Share', 1200);
                } catch (e) {
                    alert('Share not supported on this device.');
                }
            }
        });
    }

    if (shortlistBackdrop) shortlistBackdrop.addEventListener('click', closeShortlistPanel);
    if (shortlistCloseBtn) shortlistCloseBtn.addEventListener('click', closeShortlistPanel);

    if (favBtnMobile) favBtnMobile.addEventListener('click', openShortlistPanel);

    document.addEventListener('shortlistChanged', () => {
        if (shortlistPanel?.classList.contains('open')) renderShortlist();
    });
// --- NAAMIN TYPING ANIMATION (GUARANTEED LOOP) ---
    const typeNaam = document.getElementById("type-naam");
    const typeIn = document.getElementById("type-in");

    if (typeNaam && typeIn) {
        const text1 = "Naam";
        const text2 = "in";
        const typeSpeed = 200;
        const delayBeforeRestart = 2000; // 2 seconds wait

        const runAnimation = () => {
            typeNaam.textContent = "";
            typeIn.textContent = "";

            let i = 0;
            let j = 0;

            const step = () => {
                if (i < text1.length) {
                    typeNaam.textContent += text1.charAt(i);
                    i++;
                    setTimeout(step, typeSpeed);
                }
                else if (j < text2.length) {
                    typeIn.textContent += text2.charAt(j);
                    j++;
                    setTimeout(step, typeSpeed);
                }
                else {
                    setTimeout(runAnimation, delayBeforeRestart);
                }
            };
            step();
        };
        runAnimation();
    }
});
/* ======================================================
   SLIDESHOW FUNCTIONALITY
   ====================================================== */
document.addEventListener('DOMContentLoaded', function () {
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (!slideshowContainer) return;

    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slide-dots .dot');
    const prevBtn = document.querySelector('.slide-prev');
    const nextBtn = document.querySelector('.slide-next');

    let currentSlide = 0;
    let autoplayInterval;
    const autoplayDelay = 2000; // 2 seconds

    function showSlide(n) {
        if (n >= slides.length) currentSlide = 0;
        if (n < 0) currentSlide = slides.length - 1;

        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Add active class to current slide and dot
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        currentSlide++;
        showSlide(currentSlide);
        resetAutoplay();
    }

    function prevSlide() {
        currentSlide--;
        showSlide(currentSlide);
        resetAutoplay();
    }

    function goToSlide(n) {
        currentSlide = n;
        showSlide(currentSlide);
        resetAutoplay();
    }

    function autoplay() {
        nextSlide();
    }

    function startAutoplay() {
        autoplayInterval = setInterval(autoplay, autoplayDelay);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    // Event listeners for navigation buttons
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    // Pause autoplay on hover
    slideshowContainer.addEventListener('mouseenter', stopAutoplay);
    slideshowContainer.addEventListener('mouseleave', startAutoplay);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
    // Start autoplay on page load
    startAutoplay();
    showSlide(currentSlide);
});

/* ======================================================
   BABY SHOWCASE CAROUSEL FUNCTIONALITY
   ====================================================== */
document.addEventListener('DOMContentLoaded', function () {
    const babyCarousel = document.querySelector('.baby-carousel');
    if (!babyCarousel) return;

    const babyCards = document.querySelectorAll('.baby-card');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');

    let currentIndex = 0;
    let autoplayInterval;
    const autoplayDelay = 4000; // 4 seconds
    let touchStartX = 0;
    let touchEndX = 0;

    // Create dots
    babyCards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.carousel-dot');

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function scrollToCard(index) {
        const cardWidth = babyCards[0].offsetWidth;
        const gap = 30;
        const scrollPosition = (cardWidth + gap) * index;
        babyCarousel.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        currentIndex = index;
        updateDots();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % babyCards.length;
        scrollToCard(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + babyCards.length) % babyCards.length;
        scrollToCard(currentIndex);
    }

    function goToSlide(index) {
        scrollToCard(index);
        resetAutoplay();
    }

    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, autoplayDelay);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    // Navigation buttons
    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
    });

    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
    });

    // Touch swipe support
    babyCarousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    babyCarousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next
                nextSlide();
            } else {
                // Swipe right - prev
                prevSlide();
            }
            resetAutoplay();
        }
    }

    // Pause on hover (desktop)
    babyCarousel.addEventListener('mouseenter', stopAutoplay);
    babyCarousel.addEventListener('mouseleave', startAutoplay);

    // Start autoplay
    startAutoplay();

    // Update language content
    const updateBabyCarouselLanguage = () => {
        const lang = getLanguage();
        const sectionTitle = document.querySelector('#baby-showcase h2');
        const sectionSubtitle = document.querySelector('#baby-showcase .section-subtitle');

        if (sectionTitle) {
            sectionTitle.textContent = lang === 'hi'
                ? sectionTitle.getAttribute('data-hi')
                : sectionTitle.getAttribute('data-en');
        }

        if (sectionSubtitle) {
            sectionSubtitle.textContent = lang === 'hi'
                ? sectionSubtitle.getAttribute('data-hi')
                : sectionSubtitle.getAttribute('data-en');
        }
    };

    // Initial language update
updateBabyCarouselLanguage();
});

// === TESTIMONIAL ROTATION (HOMEPAGE) ===
(function () {
    const grid = document.querySelector('.testimonial-grid[data-rotate]');
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll('.testimonial-card'));
    if (cards.length < 2) return;

    let current = 0;
    const rotate = () => {
        cards[current].classList.remove('active');
        current = (current + 1) % cards.length;
        cards[current].classList.add('active');
    };

    setInterval(rotate, 5000);
})();









