const SUPABASE_URL = "https://bsckjqnqwskpjtsufdov.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_8fkG69MQMNmavW1hZq1_pw_7okJyVA1";

const isSupabaseConfigured = () => {
  return Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
};

if (!window.supabase?.createClient) {
  throw new Error(
    "Supabase browser library is missing. Load @supabase/supabase-js before auth.js."
  );
}

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

export {
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  isSupabaseConfigured,
  supabase
};
