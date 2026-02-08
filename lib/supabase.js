//SUPABASE MODULE TO INTERACT WITH SUPABASE DATABASE
import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;


const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

export default supabase;
