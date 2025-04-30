import { db } from "@/db";
import { videos } from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const videosRouter = createTRPCRouter({
    create : protectedProcedure.mutation(async ({ ctx }) => {
        const { id : userId } = ctx.data;

        const [video] = await db.insert(videos).values({
            userId,
            title: "",
        }).returning();

        return {
            video,
        };
    }),
    // Define your video-related procedures here
});