"use client";

import { useEffect, useState } from "react";

type Post = {
  id: number;
  title: string;
  description: string;
  rating: number;
  createdAt: Date;
  author: {
    name: string;
  };
}

export default function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);

  // Fetch posts from database
  const fetchPosts = async () => {
    const results = await fetch("/api/posts");
    const data = await results.json();
    // Map stringified date to Date object
    const postsWithParsedDates = data.posts.map((post: Post) => ({
      ...post,
      createdAt: new Date(post.createdAt),
    }))
    setPosts(postsWithParsedDates);
  }

  // Fetch posts on launch
  useEffect(() => {
    fetchPosts();
  }, []);

  // Delete post
  const deletePost = async (postID: number) => {
    console.log("Deleting post with id", postID);
    const result = await fetch("/api/user", {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        postID,
      }),
    });
    if (result.ok) {
      // Delete post from the local list as to not make unnecessary database calls
      setPosts(previous => previous.filter(post => post.id !== postID));
    } else {
      console.error("Failed to delete post", postID);
    }
  };

  return (
    <div>
        {posts.map((post) => (
            <div key={`post-container-${post.id}`} style={{border: "1px solid black", display: "flex", flexDirection: "row", width: "50%"}}>
              <div>
                <p key={`title-${post.id}`} style={{fontSize: "40px"}}>{post.title}</p>
                <p key={`description-${post.id}`} style={{fontSize: "24px"}}>{`${post.description}`}</p>
                <p key={`author-${post.id}`}>{`By: ${post.author.name}`}</p>
                <p key={`timestamp-${post.id}`}>{`Posted on: ${post.createdAt.toLocaleDateString()} at ${post.createdAt.toLocaleTimeString()}`}</p>
                <p key={`rating-${post.id}`}>{`Rating: ${post.rating}/5`}</p>
              </div>
              <div style={{marginLeft: "auto"}}>
                <button id={`delete-${post.id}`} onClick={() => deletePost(post.id)}>🗑️</button>
              </div>
            </div>
        ))}
    </div>
  ); 
}
