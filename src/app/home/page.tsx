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
      <input
        // onKeyUp={console.log("typing")}
        placeholder="Search"
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 px-2 py-1 border rounded"
      />
      <PostFeed searchQuery={search}/>
    </div>
  );
}
