import { db } from "@/db";
import { videos, videoSchema } from "@/db/schema";
import { mux } from "@/lib/mux";
import { workflow } from "@/lib/workflow";
import {createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const videosRouter = createTRPCRouter({

    generateThumbnail : protectedProcedure
    .input(z.object({   
        videoId: z.string().uuid(),
    }))
    .mutation(async ({ctx , input}) => {
        console.log("happening workflow")
        const { id : userId } = ctx.data;
        
        try{
        const {workflowRunId } = await workflow.trigger({
            url: "https://starling-nice-warthog.ngrok-free.app/api/videos/workflow",
            body: {videoId:"d14dccbd-9c3a-49af-8c4f-0a2e04e28949" , userId},
            headers: {
              "Content-Type": "application/json",
            },
            retries : 2
          })
    } catch (error) {
        console.error("Error triggering workflow:", error);
    }

    }),
    restoreThumnail : protectedProcedure.input(z.object({   
        id: z.string().uuid(),
    })).mutation(async ({ctx,input}) => {
        const { id : userId } = ctx.data;
        const { id } = input;
        if(!id){
            throw new TRPCError({code: "BAD_REQUEST", message: "Video id is required"});
        }

        const [existingVideo] = await db.select().from(videos).where(
            and(
                eq(videos.userId, userId),
                eq(videos.id, id)
            )
        );
        const thumbnailUrl = `https://image.mux.com/${existingVideo.muxPlaybackId}/thumbnail.jpg`;
        const [video] = await db.update(videos).set({
            thumbnailUrl:thumbnailUrl,
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
    }),
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