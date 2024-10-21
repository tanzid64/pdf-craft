"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function getFile(fileId: string) {
  const {userId} = await auth();
  if (!userId)
    return {
      status: 401,
      success: false,
      message: "Unauthorized",
    };
  try {
    const file = await db.file.findUnique({
      where: {
        id: fileId,
        userId,
      },
    });
    if (!file)
      return {
        status: 404,
        success: false,
        message: "File not found",
      };
    return {
      status: 200,
      success: true,
      file,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      success: false,
      message: "Something went wrong",
    };
  }
}
