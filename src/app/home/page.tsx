// components/PostFeedClient.tsx
"use client";

import { useRouter } from "next/navigation";
import PostFeed from "./PostFeed";

export default function PostFeedClient() {
  const router = useRouter();

  const handlePost = () => {
    router.push("/new_post");
  };

  return (
    <div>
      
      <PostFeed/>
    </div>
  );
}
