import { getSortedPosts } from "@/utils/content-utils";

export async function GET() {
    const posts = await getSortedPosts();
    
    const searchIndex = posts.map(post => ({
        title: post.data.title,
        description: post.data.description,
        slug: post.slug,
    }));

    return new Response(JSON.stringify(searchIndex), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}
