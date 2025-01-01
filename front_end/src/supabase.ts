import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default supabase;

export const getToken = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
};
