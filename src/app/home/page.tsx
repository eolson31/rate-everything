// components/PostFeedClient.tsx
"use client";

import { useRouter } from "next/navigation";
import PostFeed from "./PostFeed";
import { useState } from "react";

export default function PostFeedClient() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  

  return (
    <div>
      <PostFeed/>
    </div>
  );
}
