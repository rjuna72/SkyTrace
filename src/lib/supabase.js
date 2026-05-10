import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null

export const isConnected = !!(SUPABASE_URL && SUPABASE_ANON_KEY)

async function query(fn) {
  if (!supabase) return null
  try { return await fn() } catch (e) { console.warn('Supabase:', e.message); return null }
}

export const db = {
  aircraft:     () => query(() => supabase.from('aircraft').select('*').order('tail').then(r => r.data)),
  subsystems:   (acId) => query(() => supabase.from('subsystems').select('*').eq('aircraft_id', acId).then(r => r.data)),
  sboms:        (ssId) => query(() => supabase.from('sboms').select('*').eq('subsystem_id', ssId).then(r => r.data)),
  components:   (sbomId) => query(() => supabase.from('components').select('*').eq('sbom_id', sbomId).then(r => r.data)),
  dependencies: (sbomId) => query(() => supabase.from('dependencies').select('*').eq('sbom_id', sbomId).then(r => r.data)),
  insertSBOM:   (d) => query(() => supabase.from('sboms').insert([d]).select().then(r => r.data?.[0])),
  insertComponents: (d) => query(() => supabase.from('components').insert(d)),
  insertDeps:   (d) => query(() => supabase.from('dependencies').insert(d)),
}
