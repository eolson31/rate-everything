// components/PostFeedClient.tsx
"use client";

import { useRouter } from "next/navigation";
import PostFeed from "../post_feed";

interface PostFeedClientProps {
  posts: any; // Replace 'any' with your post type if you have types
}

export default function PostFeedClient({ posts }: PostFeedClientProps) {
  const router = useRouter();

  const handlePost = () => {
    router.push("/new_post");
  };

  return (
    <div>
      <button
        onClick={handlePost}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Rate Something
      </button>
      <PostFeed posts={posts} />
    </div>
  );
}
