import { getUserFromDb } from "@/action/auth";
import { db } from "@/lib/db";
import { initTRPC, TRPCError } from "@trpc/server";

const t = initTRPC.create();

const isAuthenticated = t.middleware(async (opts) => {
  const user = await getUserFromDb();

  if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

  return opts.next({
    ctx: {
      userId: user.id,
      user,
      db,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);
