import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://bsckjqnqwskpjtsufdov.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_8fkG69MQMNmavW1hZq1_pw_7okJyVA1_";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
});

export { SUPABASE_URL, SUPABASE_ANON_KEY };
