import { db } from "@/db";
import { categories } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const categoriesRouter = createTRPCRouter({
    getMany : baseProcedure.query(async () => {
        // console.log("Fetching categories from the database...")
        // throw new TRPCError({code: "INTERNAL_SERVER_ERROR"}) 
        const data = await db.select().from(categories)
        return data;
    })
})