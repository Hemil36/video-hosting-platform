import { db } from "@/db"
import { videos } from "@/db/schema"
import { serve } from "@upstash/workflow/nextjs"
import { and, eq } from "drizzle-orm"

interface workFlowProp {
  userId: string
  videoId: string
}

export const { POST } = serve(
  async (context) => {
    const {userId , videoId} = context.requestPayload as workFlowProp

    if(!userId || !videoId) {
      throw new Error("userId and videoId are required")
    }


    const [video] = await db.select().from(videos).where(
      and(
        eq(videos.userId, userId),
        eq(videos.id, videoId)
      )
    ).limit(1)

    if(!video) {
      throw new Error("Video not found")
    }

    await context.run("initial-step", () => {
      console.log("initial step ran")
    })

    await context.run("second-step", () => {
      console.log("second step ran")
      console.log(context.requestPayload)
    })
  }
)