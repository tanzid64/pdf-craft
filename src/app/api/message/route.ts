import { auth } from "@/auth";
import { db } from "@/lib/db";
import { SendMessageValidator } from "@/lib/validators/send-message-validator";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const session = await auth();
  const user = session?.user;
  if (!user || !user.id) new Response("Unauthorized", { status: 401 });
  const { fileId, message } = SendMessageValidator.parse(body);
  const file = await db.file.findUnique({
    where: { id: fileId, userId: user?.id },
  });

  if (!file) return new Response("Not found", { status: 404 });

  await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId: user?.id,
      fileId,
    },
  });

  // 
};
