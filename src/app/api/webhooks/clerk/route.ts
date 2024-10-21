import { db } from "@/lib/db";

export async function POST(req: Request) {
  const data = await req.json();
  const emailAddress = data.email_address[0].email_address;
  const id = data.id;

  await db.user.upsert({
    where: {
      id,
    },
    create: {
      id,
      email: emailAddress,
    },
    update: {
      email: emailAddress,
    },
  });
}
