import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rdydaiteaawnysqmqkus.supabase.co'
const supabaseKey = 'sb_publishable_GcJfCnCj9cSRTyNGucOmgA_I1Bfon_Z'

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey)