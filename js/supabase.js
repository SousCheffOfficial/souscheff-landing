// ============================================
// SUPABASE CREDENTIALS — REPLACE THESE TWO LINES
// ============================================
const SUPABASE_URL = 'https://iticbmodzgfrunguurjx.supabase.co';
const SUPABASE_KEY = 'sb_publishable_CDSBop0nJh5BGKVvh9i-VQ_Uo_Uk9Dv';
// ============================================

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);