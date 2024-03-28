import type { APIRoute } from "astro";
import { resend } from "../../lib/resend";

export const POST: APIRoute = async ({ request }) => {
    if (request.headers.get("Content-Type") === "application/json"){
        const body = await request.json();
        console.log(body);
        let dryerArray = JSON.parse(body.dryers);
        console.log(dryerArray.length);
        let message = "";
        if(dryerArray.length === 1){
            message = `You have registered dryer ${dryerArray[0]}.`;
        } else {
            message = "You have registered the following dryers: ";
            for(let i = 0; i < dryerArray.length; i++){
                if(i === dryerArray.length - 2){
                    message += dryerArray[i] + " and ";
                } else if(i === dryerArray.length - 1){
                    message += dryerArray[i] + ".";
                } else {
                    message += dryerArray[i] + ", ";
                }
            }
        }

        console.log(message);

        const { data, error } = await resend.emails.send({
            from: "Notificator <notification@notification.decade21.com>",
            to: body.email,
            subject: `Confirmation of dryer registration`,
            html: message
          });

          if(error === null){
            return new Response(JSON.stringify({message: "OK"}), {status: 200});
          } else {
            return new Response(JSON.stringify({message: error}), {status: 500});
          }

        //return new Response(JSON.stringify({message: "Verification mail sent"}), {status: 200});
        
    }
}