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

type StarRatingButtonProps = {
  rating: number;
  onChange: (newRating: number) => void;
};

function StarRatingButton({ rating, onChange }: StarRatingButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, starIndex: number) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - left;
    const clickedHalf = clickX < width / 2;
    const newRating = clickedHalf ? starIndex - 0.5 : starIndex;
    onChange(newRating);
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        let starChar = "★";
        let starColor = "text-gray-300";

        if (rating >= star) {
          starColor = "text-yellow-400";
        } else if (rating >= star - 0.5) {
          starChar = "⯨"; // fallback half-star
          starColor = "text-yellow-400";
        }

        return (
          <button
            key={star}
            type="button"
            onClick={(e) => handleClick(e, star)}
            className={`text-2xl ${starColor} cursor-pointer focus:outline-none`}
          >
            {starChar}
          </button>
        );
      })}
      <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}/5</span>
    </div>
  );
}

export default function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postRatings, setPostRatings] = useState<{ [postId: number]: number }>({});


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
    setPostRatings(Object.fromEntries(postsWithParsedDates.map((p: { id: any; rating: any; }) => [p.id, p.rating])));
  }

  // Fetch posts on launch
  useEffect(() => {
    fetchPosts();
  }, []);

  // Listen for events from the server
  useEffect(() => {
    const eventSource = new EventSource("/api/event_stream");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "newPost") {
        data.post.createdAt = new Date(data.post.createdAt);
        setPosts((previous) => [...previous, data.post]);
        setPostRatings((prev) => ({ ...prev, [data.post.id]: data.post.rating }));
      } else if (data.type === "deletePost") {
        setPosts((previous) => previous.filter((post) => post.id !== data.postID));
        setPostRatings((prev) => {
          const updated = { ...prev };
          delete updated[data.postID];
          return updated;
        });
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Delete post
  const deletePost = async (postID: number) => {
    const result = await fetch("/api/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postID }),
    });

    if (result.ok) {
      setPosts((previous) => previous.filter((post) => post.id !== postID));
      setPostRatings((prev) => {
        const updated = { ...prev };
        delete updated[postID];
        return updated;
      });
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
                <div key={`rating-${post.id}`}>
                <StarRatingButton
                  rating={postRatings[post.id] ?? post.rating}
                  onChange={(newRating) => {
                    setPostRatings((prev) => ({ ...prev, [post.id]: newRating }));
                    // Optional: persist rating update to server here
                    console.log(`Updated rating for post ${post.id}: ${newRating}`);
                  }}
                />
                </div>
              </div>
              <div style={{marginLeft: "auto"}}>
                <button id={`delete-${post.id}`} onClick={() => deletePost(post.id)}>🗑️</button>
              </div>
            </div>
        ))}
    </div>
  ); 
}
