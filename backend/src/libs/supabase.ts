import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

const realtime_opt = {
  realtime: {
    params: {
      eventsPerSecond: 10,
    }
  }
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, realtime_opt)

export default supabase