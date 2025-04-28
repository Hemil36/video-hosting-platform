import { z } from 'zod';
import {  createTRPCRouter, protectedProcedure } from '../init';
export const appRouter = createTRPCRouter({
  hello: protectedProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query(async (opts) => {
      console.log("hello i am protected" , opts.ctx.data)
      console.log("hello i am prefetched" , opts.ctx.clerkUserId)
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;