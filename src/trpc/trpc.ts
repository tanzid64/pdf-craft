import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";

const t = initTRPC.create();

const isAuthenticated = t.middleware(async (opts) => {
  const { userId } = auth();
  console.log(userId);
  if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });
  const user = await db.user.findUnique({
    where: {
      id: userId!,
    },
  });


  return opts.next({
    ctx: {
      userId: user?.id,
      user,
      db,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);
