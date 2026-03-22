import { supabase } from "./supabase-client.js";
import { mockCatalog, mockFeaturePages, mockHighlights, mockSiteContent, mockTestimonials } from "./storefront-data.js";

function normalizeCatalogItem(item) {
    return {
        id: item.id || item.slug || crypto.randomUUID(),
        title: item.title || "Untitled",
        description: item.description || "",
        price: item.price || item.price_text || "Custom",
        tag: item.tag || "Featured",
        category: item.category || "Collection",
        type: item.type || item.item_type || "General",
        image: item.image || "IMG2.jpeg",
        accent: item.accent || "Premium",
        badge: item.badge || "Featured",
        details: item.details || item.description || "",
        highlights: Array.isArray(item.highlights) ? item.highlights : []
    };
}

function sectionArray(rows) {
    return rows.reduce((acc, row) => {
        acc[row.section_key] = {
            eyebrow: row.eyebrow || "",
            title: row.title || "",
            description: row.description || "",
            payload: row.payload || {}
        };
        return acc;
    }, {});
}

function fallbackData() {
    return {
        source: "mock",
        sections: mockSiteContent,
        catalog: mockCatalog.map(normalizeCatalogItem),
        highlights: mockHighlights,
        testimonials: mockTestimonials
    };
}

function normalizeFeaturePage(page, slug) {
    return {
        slug: page.slug || slug || "feature",
        eyebrow: page.eyebrow || "",
        title: page.title || "Untitled feature page",
        description: page.description || "",
        payload: page.payload || {},
        published: page.published !== false
    };
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loadStorefrontData() {
    try {
        const [sectionsResult, catalogResult] = await Promise.all([
            supabase.from("site_sections").select("*").eq("published", true),
            supabase.from("catalog_items").select("*").eq("is_published", true).order("sort_order", { ascending: true })
        ]);

        if (sectionsResult.error) throw sectionsResult.error;
        if (catalogResult.error) throw catalogResult.error;

        const sections = sectionArray(sectionsResult.data || []);
        const catalog = (catalogResult.data || []).map(normalizeCatalogItem);

        if (!catalog.length || !Object.keys(sections).length) {
            throw new Error("Supabase content not seeded yet");
        }

        await delay(250);

        return {
            source: "supabase",
            sections: {
                ...mockSiteContent,
                ...sections
            },
            catalog,
            highlights: sections.highlights?.payload?.items || mockHighlights,
            testimonials: sections.testimonials?.payload?.items || mockTestimonials
        };
    } catch (error) {
        console.warn("Falling back to mock storefront data", error);
        await delay(400);
        return fallbackData();
    }
}

export async function loadFeaturePage(slug) {
    try {
        const { data, error } = await supabase
            .from("feature_pages")
            .select("*")
            .eq("slug", slug)
            .eq("published", true)
            .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error(`Feature page not found for ${slug}`);

        return {
            source: "supabase",
            page: normalizeFeaturePage(data, slug)
        };
    } catch (error) {
        console.warn(`Falling back to mock feature page for ${slug}`, error);
        await delay(250);
        const fallback = mockFeaturePages[slug];
        return {
            source: "mock",
            page: normalizeFeaturePage(fallback || {}, slug)
        };
    }
}
