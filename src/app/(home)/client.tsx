"use client";
import { trpc } from "@/trpc/client";
const Homepage = () => {
    const [data] = trpc.categories.getMany.useSuspenseQuery();
    return (
        <div>
        <h1>Home Page</h1>
        <p>Welcome to the home page!</p>
        {data && data.length > 0 ? (
            <ul>
                {data.map((category) => (
                    <li key={category.id}>
                        {category.name} - {category.description}
                    </li>
                ))}
            </ul>
        ) : (
            <p>No categories available.</p>
        )}
        <p>More content can go here...</p>
        </div>
    );
    }
export default Homepage;