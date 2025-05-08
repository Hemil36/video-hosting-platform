import { db } from "@/db";
import { videos} from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, lt, or } from "drizzle-orm";
import { z } from "zod";

export const studiorouter = createTRPCRouter({
    getOne: protectedProcedure
.input(z.object({
  id: z.string().uuid({
    message: "Invalid video id",
  }),
}))
.query(async ({ctx,input}) => {
  const { id } = input;
  const { id: userId } = ctx.data;
  const video = await db.select().from(videos).where(
    and(
      eq(videos.userId, userId),
      eq(videos.id, id)
    )
  ).limit(1);
//   console.log(video[0]);
  if(!video || video.length === 0) {
    throw new TRPCError({code: "NOT_FOUND"});
  }
  
  return video[0];
}),
    getMany : protectedProcedure
    .input(
        z.object({
            cursor: z.object({
                id : z.string(),
                updatedAt : z.date()
            }).nullish(),
            limit: z.number().min(1).max(100),
        })
    )
    .query(async ({ctx,input}) => {
        const { cursor, limit } = input;
        const {id : userId} = ctx.data;
        const data = await db.select().from(videos).where(
            and(
                eq(videos.userId, userId),
                cursor ? or(
                    lt(videos.updatedAt, cursor.updatedAt),
                    and(
                        eq(videos.updatedAt, cursor.updatedAt),
                        lt(videos.id, cursor.id)
                    )
                ) : undefined
            )
        ).orderBy(desc(videos.updatedAt),desc(videos.id)).limit(limit + 1);
        const hasMore = data.length > limit;
        const items = hasMore ? data.slice(0, -1) : data;
        const nextCursor = hasMore ? data[data.length - 1] : undefined;
    
        return {
            items,
            nextCursor: nextCursor ? { id: nextCursor.id, updatedAt: nextCursor.updatedAt } : null,
        };
    })

    })
