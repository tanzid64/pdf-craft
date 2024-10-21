"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export const getUserFromDb = async () => {
  const { userId } = auth();
  if (!userId) return null;
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) return null;
  return user;
};
