import newBlogPost from "@/temp_blog_post_data";
import { insertBlogPost } from "@/services/supabase-blog";
import { v4 as uuidv4 } from "uuid";

async function run() {
  try {
    const postToInsert = {
      ...newBlogPost,
      id: uuidv4(), // Generate a new UUID for the blog post
    };
    const result = await insertBlogPost(postToInsert);

    if (result) {
      console.log("Blog post inserted successfully:", result.title);
      console.log("Slug:", result.slug);
    } else {
      console.error("Failed to insert blog post.");
    }
  } catch (error) {
    console.error("An error occurred during blog post insertion:", error);
  }
}

run();