// components/PostFeedClient.tsx
"use client";

import { useRouter } from "next/navigation";
import PostFeed from "./PostFeed";
import { useState } from "react";

export default function PostFeedClient() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handlePost = () => {
    router.push("/new_post");
  };

  return (
    <div>
      <PostFeed/>
    </div>
  );
}
