import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";

export const GET: APIRoute = async () => {
    const { data, error } = await supabase
  .from('registrations')
  .select();

  return new Response(JSON.stringify(data), {status: 200});

}