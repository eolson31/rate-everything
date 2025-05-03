"use client";

import { useRouter } from "next/navigation";
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
  votes: number;
};

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
  const [count, setCount] = useState(0);
  const [voted, setVoted] = useState(false);

  const handleVoteClick = () => {
    setCount((prev) => (voted ? prev - 1 : prev + 1));
    setVoted(!voted);
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        let starChar = "★";  // Full star
        let starColor = "text-gray-300";  // Empty star color

        // Determine if it's a full or half-star or empty
        if (rating >= star) {
          starColor = "text-yellow-400";  // Full star color
        } else if (rating >= star - 0.5) {
          starChar = "⯨";  // Half star
          starColor = "text-yellow-400";  // Half star color
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
      <button
        onClick={handleVoteClick}
        className={`flex items-center px-2 py-1 text-sm rounded-full border ${
          voted ? "bg-blue-200 text-blue-800" : "bg-gray-100"
        } hover:bg-blue-300`}
      >
        👍 {count}
      </button>
    </div>
  );
}

export default function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postRatings, setPostRatings] = useState<{ [postId: number]: number }>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const router = useRouter();
  
    const handlePost = () => {
      router.push("/new_post");
    };

  // Fetch posts from the database
  const fetchPosts = async () => {
    setLoading(true);
    const results = await fetch("/api/posts");
    const data = await results.json();
    const postsWithParsedDates = data.posts.map((post: Post) => ({
      ...post,
      createdAt: new Date(post.createdAt),
    }));
    setPosts(postsWithParsedDates);
    setPostRatings(Object.fromEntries(postsWithParsedDates.map((p: {id: any; rating: any}) => [p.id, p.rating])));
    setLoading(false);
  };  

  useEffect(() => {
    fetchPosts();
  }, []);

  // Listen for events from the server (e.g., new posts, deleted posts)
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

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.description.toLowerCase().includes(search.toLowerCase()) ||
    post.author.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="flex flex-col items-center p-6 space-y-6">

      <input
        // onKeyUp={console.log("typing")}
        placeholder="Search"
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 px-2 py-1 border rounded"
      />

      <button 
        onClick={handlePost}
        className="mb-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow"
      >
        Rate Something
      </button>
  
      {loading ? (
        // Skeleton loading cards (3 placeholders)
        Array.from({ length: 3 }).map((_, i) => (
          <div
            key={`skeleton-${i}`}
            className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-4 animate-pulse"
          >
            <div className="h-6 bg-gray-300 rounded w-1/2" />
            <div className="h-4 bg-gray-300 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-8 bg-gray-300 rounded w-full mt-4" />
          </div>
        ))
      ) : (
        filteredPosts.map((post) => (
          <div
            key={`post-container-${post.id}`}
            className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-md p-6 flex flex-col space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{post.title}</h2>
                <p className="text-lg text-gray-700">{post.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  By: <span className="font-medium">{post.author.name}</span>
                </p>
                <p className="text-sm text-gray-400">
                  Posted on {post.createdAt.toLocaleDateString()} at{" "}
                  {post.createdAt.toLocaleTimeString()}
                </p>
              </div>
              <button
                id={`delete-${post.id}`}
                onClick={() => deletePost(post.id)}
                className="text-gray-400 hover:text-red-500 transition"
                title="Delete Post"
              >
                🗑️
              </button>
            </div>
  
            <div key={`rating-${post.id}`} className="pt-2">
              <StarRatingButton
                rating={postRatings[post.id] ?? post.rating}
                onChange={(newRating) => {
                  setPostRatings((prev) => ({ ...prev, [post.id]: newRating }));
                  console.log(`Updated rating for post ${post.id}: ${newRating}`);
                }}
              />
            </div>
          </div>
        ))
      )}
    </main>
  );
  
  
}