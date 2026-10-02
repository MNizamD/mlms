import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";

const webhookSecret: string = process.env.CLERK_WEBHOOK_SIGNING_SECRET || "test";
export async function POST(req: Request) {
    const svix_id = req.headers.get("svix-id") ?? "";
    const svix_timestamp = req.headers.get("svix-timestamp") ?? "";
    const svix_signature = req.headers.get("svix-signature") ?? "";

    const body = await req.text();

    const sivx = new Webhook(webhookSecret);
    let event: WebhookEvent | undefined;

    try {
        event = sivx.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent | undefined;;
        if (!event) throw Error(event);

        const msg = JSON.parse(body);
        console.log(msg);

        // Rest

        const clerk = await clerkClient();
        if(event.type === "user.created"){
            clerk.users.updateUser(event.data.id, {
                publicMetadata: {
                    roles: ["user"]
                }
            })
        }
    } catch (err) {
        return new Response(`Bad Request: ${String(err)}`, { status: 400 });
    }
}
