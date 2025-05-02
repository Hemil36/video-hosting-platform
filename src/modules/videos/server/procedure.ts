import { db } from "@/db";
import { videos, videoSchema } from "@/db/schema";
import { mux } from "@/lib/mux";
import {createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const videosRouter = createTRPCRouter({
    delete : protectedProcedure.input(z.object({
        id: z.string().uuid(),
    })).mutation(async ({ctx,input}) => {
        const { id : userId } = ctx.data;
        const { id } = input;
        if(!id){
            throw new TRPCError({code: "BAD_REQUEST", message: "Video id is required"});
        }
        const [video] = await db.delete(videos).where(
            and(
                eq(videos.userId, userId),
                eq(videos.id, id)
            )
        ).returning();
        if(!video) {
            throw new TRPCError({code: "NOT_FOUND"});
        }
        return video;
    }),
    update :protectedProcedure.input(videoSchema).mutation(async ({ctx,input}) => {
        const { id : userId } = ctx.data;
        const { id, ...data } = input;
        if(!id){
            throw new TRPCError({code: "BAD_REQUEST", message: "Video id is required"});
        }
        const [video]= await db.update(videos).set({
            title: data.title,
            description: data.description,
            visibility: data.visibility,
            categoryId: data.categoryId,
            updatedAt: new Date(),
        }).where(
            and(
                eq(videos.userId, userId),
                eq(videos.id, id)
            )
        ).returning();
        if(!video) {
            throw new TRPCError({code: "NOT_FOUND"});
        }
        return video;
    }
    ),
    create : protectedProcedure.mutation(async ({ ctx }) => {
        const { id : userId } = ctx.data;

        const upload = await mux.video.uploads.create({
            new_asset_settings: {
                passthrough : userId,
                playback_policy: ["public"],
                inputs :[
                    {
                        generated_subtitles :[
                            {
                                language_code : "en",
                                name : "English",
                            }
                        ]
                    }
                ]
            
            },
            cors_origin: "*",
        })
        const [video] = await db.insert(videos).values({
            userId,
            title: "",
            muxStatus : "waiting",
            muxUploadId: upload.id,
        }).returning();

        return {
            video,
            url : upload.url,
        };
    }),
    
});