import { db } from '@/db';
import { users } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { initTRPC, TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { cache } from 'react';

import { ratelimit } from '@/lib/ratelimit';
import SuperJSON from 'superjson';
export const createTRPCContext = cache(async () => {
  const {userId} = await auth();
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { clerkUserId : userId };
});

export type CreateTRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<CreateTRPCContext>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: SuperJSON,
});
// Base router and procedure helpers

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async ({ ctx,next }) => {
  if (!ctx.clerkUserId) {
    throw new TRPCError({code : 'UNAUTHORIZED'});
  }

  
  const [data] = await db.select().from(users).where(eq(users.clerkId, ctx.clerkUserId));
  if (!data) {
    throw new TRPCError({code : 'UNAUTHORIZED'});
  }

  const {success} = await ratelimit.limit(data.id);
  if (!success) {
    throw new TRPCError({code : 'TOO_MANY_REQUESTS'});
  }

  console.log("Authenticaed user", data.id);  

  return next({
    ctx: {
      ...ctx,
      data
    },
  });
});