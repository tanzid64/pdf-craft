import { db } from "@/lib/db";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const payload: WebhookEvent = await request.json();
  console.log(payload.type);

  if (payload.type === "user.created") {
    await db.user.create({
      data: {
        id: payload.data.id,
        email: payload.data.email_addresses[0].email_address,
      },
    });
  }

  if (payload.type === "user.deleted") {
    await db.user.delete({ where: { id: payload.data.id } });
  }

  if (payload.type === "user.updated") {
    await db.user.update({
      where: { id: payload.data.id },
      data: {
        email: payload.data.email_addresses[0].email_address,
      },
    });
  }
  return new Response(`Clerk Webhook Success - ${payload.type}`, {
    status: 200,
  });
}
