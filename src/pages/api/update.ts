import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";
import { resend } from "../../lib/resend";


export const PUT: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    // Get every entry from the database
    const { data, error } = await supabase.from("registrations").select("*");
    if (error === null) {
      // Get the body from the request - an array of dryers (numbers/ints);
      const body = await request.json();

      // data is an array of all the entries in the database

      // Loop through all entries in db
      for (let entry of data) {
        let entryDryers = JSON.parse(entry.dryers); // Dryers registered to this entry

        // Filter out all entries in entryDryers that exists in body
        //let updatedEntryDryers = entryDryers.filter((el) => !body.includes(el));
        let updatedEntryDryers = removeAfromB(body, entryDryers);
        console.log(updatedEntryDryers);

        let dryersToNotifyAbout = intersection(body, entryDryers);
        notify(entry.email, dryersToNotifyAbout);

        // If there are no more dryers, delete the entire entry
        if (updatedEntryDryers.length === 0) {
          try {
            const { error } = await supabase
              .from("registrations")
              .delete()
              .eq("id", entry.id);
            if (error !== null) {
              throw error;
            }
          } catch (error) {
            console.error(error);
          }
        } else {
          // Update the entry
          try {
            const { error } = await supabase
              .from("registrations")
              .update({ dryers: JSON.stringify(updatedEntryDryers) })
              .eq("id", entry.id);
            if (error !== null) {
              throw error;
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
      return new Response(
        JSON.stringify({
          message: "OK",
        }),
        {
          status: 200,
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          message: "Something went wrong fetching data from db.",
        }),
        {
          status: 500,
        }
      );
    }
  } else {
    return new Response(
      JSON.stringify({
        message: "Incorrect Content-Type in headers",
      }),
      {
        status: 500,
      }
    );
  }
};

async function notify(email: string, dryers: number[]) {
    for(const dryer of dryers){
      //@ts-ignore
        const { data, error } = await resend.emails.send({
          from: "Notificator <notification@notification.decade21.com>",
          to: email,
          subject: `Dryer ${dryer} is done!`,
          html: "You can now pick up your clothes."
        });

        if(error){
          console.error(error);
        } else {
          console.log(data);
        }
        console.log(
            `Notifying ${email} that dryer ${dryer} is finished.`
          );
    }
  
}

function removeAfromB(A: number[],B: number[]){
    return B.filter(el => !A.includes(el));
}

function intersection(A: number[], B: number[]): number[] {
    let setA = new Set(A);
    let setB = new Set(B);
    let intersectionSet = new Set();
    if(setA.size > setB.size){
        for(const element of setB){
            if(setA.has(element)){
                intersectionSet.add(element);
            }
        }
    } else {
        for(const element of setA){
            if(setB.has(element)){
                intersectionSet.add(element);
            }
        }
    }

    return Array.from(intersectionSet) as number[];
}