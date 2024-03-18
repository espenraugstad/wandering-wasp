import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const body = await request.json();
    const { data, error } = await supabase
      .from("registrations")
      .insert({
        email: body.recipient,
        dryers: body.dryers, //.replaceAll("\"", ""), // Important to replace "" around numbers to get correct output when fetching the data.
      })
      .select();

    if (error === null) {
      console.log("Dryers registered");
        return new Response(JSON.stringify({
            data,
        }), 
        {
            status: 200
        });
    }
    else {
        console.error(error);
        return new Response(JSON.stringify({message: "Something went wrong"}), {status: 500});
    }
    
  }

  //return redirect("/thankyou");
};
