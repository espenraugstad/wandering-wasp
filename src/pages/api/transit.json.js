import fs from "node:fs";

export const POST = ({ request }) => {
    const url = new URL("./_data.txt", import.meta.url);
    fs.writeFile(url, "Hello", err => {
        if(err){
            console.error(err);
        } else{
            console.log("Success");
        }
    });
   
    return new Response(JSON.stringify("Hitt"), {
        status: 200,
        headers: {
            "content-type": "application/json"
        }
    });
}

export const GET = async ()=>{
    const url = new URL("./_data.txt", import.meta.url);
    let info = fs.readFileSync(url, "utf-8");

    return new Response(JSON.stringify({
        data: info
    }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        }
    })
}