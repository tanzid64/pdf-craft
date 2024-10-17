import { auth } from "@/auth";
import { db } from "@/lib/db";
import { initTRPC, TRPCError } from "@trpc/server";

const t = initTRPC.create();

const isAuthenticated = t.middleware(async (opts) => {
  const session = await auth();
  const user = session?.user;
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
