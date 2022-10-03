import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
//@ts-ignore
import { REACT_APP_API_URL, REACT_APP_API_ANON_KEY } from "@env";

const supabaseUrl = REACT_APP_API_URL as string;
const supabaseAnonKey = REACT_APP_API_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
