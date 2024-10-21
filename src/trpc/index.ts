import { INFINITE_QUERY_LIMIT } from "@/lib/constants/infinite-query";
import { getUserSubscriptionPlan, PLANS, stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "./trpc";

export const appRouter = router({
  // Get all files for a user
  getUserFiles: protectedProcedure.query(async ({ ctx }) => {
    const { userId, db } = ctx;
    return await db.file.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  // Get file messages
  getFileMessages: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        fileId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { userId, db } = ctx;
      const { cursor, fileId } = input;
      const limit = input.limit ?? INFINITE_QUERY_LIMIT;

      const file = await db.file.findUnique({
        where: {
          id: fileId,
          userId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      const messages = await db.message.findMany({
        take: limit + 1,
        where: {
          fileId,
        },
        orderBy: {
          createdAt: "desc",
        },
        cursor: cursor
          ? {
              id: cursor,
            }
          : undefined,
        select: {
          id: true,
          isUserMessage: true,
          createdAt: true,
          text: true,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (messages.length > limit) {
        const nextMessage = messages.pop();
        nextCursor = nextMessage?.id;
      }

      return {
        messages,
        nextCursor,
      };
    }),

  // get file upload status
  getFileUploadStatus: protectedProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ input, ctx }) => {
      const file = await ctx.db.file.findFirst({
        where: {
          id: input.fileId,
          userId: ctx.userId,
        },
      });

      if (!file) return { status: "PENDING" as const };

      return { status: file.uploadStatus };
    }),

  // get file
  getFile: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId, db } = ctx;
      const file = await db.file.findFirst({
        where: {
          key: input.key,
          userId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });
      return file;
    }),

  // delete a file
  deleteFile: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId, db } = ctx;
      const file = await db.file.findUnique({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      await db.file.delete({
        where: {
          id: input.id,
        },
      });
      return file;
    }),

  createStripeSession: protectedProcedure.mutation(async ({ ctx }) => {
    const { userId, db } = ctx;
    const billingUrl = absoluteUrl("/dashboard/billing");
    if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });
    const dbUser = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!dbUser) throw new TRPCError({ code: "UNAUTHORIZED" });

    const subscriptionPlan = await getUserSubscriptionPlan();
    if (subscriptionPlan.isSubscribed && dbUser.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: dbUser.stripeCustomerId,
        return_url: billingUrl,
      });

      return {
        url: stripeSession.url,
      };
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card", "paypal"],
      mode: "subscription",
      billing_address_collection: "auto",
      line_items: [
        {
          price: PLANS.find((p) => p.name === "Pro")?.price.priceIds.test,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      }
    });

    return {
      url: stripeSession.url,
    };
  }),
});

export type AppRouter = typeof appRouter;
