import { createClient } from '@supabase/supabase-js'

// Public keep-alive endpoint: pinged periodically so Supabase doesn't pause the project for inactivity.
export async function GET() {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL as string,
    process.env.VITE_SUPABASE_ANON_KEY as string,
  )
  const { error } = await supabase
    .from('scales')
    .select('id', { count: 'exact', head: true })

  if (error) {
    return new Response('ERROR', { status: 500, headers: { 'Cache-Control': 'no-store' } })
  }

  return new Response('OK', { headers: { 'Cache-Control': 'no-store' } })
}
