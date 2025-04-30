import { db } from "@/db"
import { categories } from "@/db/schema"

 const categoriesName =[
    "cars and vehicles",
    "Comedy",
    "Education",
    "Gaming",
    "Entertainment",
    "Film & Animation",
    "How-to and Style",
    "Music",
    "News & Politics",
    "Nonprofits & Activism",
    "People & Blogs",
    "Pets & Animals",
    "Science & Technology",
    "Sports",
    "Travel & Events",
 ]

async function main(){
    console.log("Categories:")

    try{
        const values = categoriesName.map((category) => ({
            name : category,
            description : `Videos about ${category.toLowerCase()}`,
    }))
        await db.insert(categories).values(values)
        console.log("Categories inserted successfully")
}
    catch (error) {
        console.error("Error inserting categories:", error)
    }
    finally {
        // await db.destroy()
    }
    console.log("Database connection closed")
}

main();