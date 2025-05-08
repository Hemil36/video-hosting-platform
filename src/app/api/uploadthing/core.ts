import { db } from "@/db";
import { users, videos } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();


// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  thumbnailUploader: f({
    image: {
      
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
  .input(z.object({ videoId: z.string().uuid() }))
  .middleware(async ({input}) =>{
    const {userId : clerkUserId} = await auth();

    if(!clerkUserId) throw new UploadThingError("UNAUTHORIZED")

      const [user] = await db.select().from(users).where(eq(users.clerkId, clerkUserId));
      if(!user) throw new UploadThingError("UNAUTHORIZED")

      return {clerkUserId, ...input,user}
  })
  
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
       await db.update(videos).set({thumbnailUrl: file.url}).where( eq(videos.id, metadata.videoId));

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.user.id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
