"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLoggedIn } from "../contexts";

export default function newPost() {
  const router = useRouter();
  const { user } = useLoggedIn();
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Check username
    if (!user) {
      alert("You must be logged in to submit a review.");
      return;
    }

    // Send POST request to server
    const result = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorID: user.id,
          title,
          description: review,
          rating: Number(rating * 2),
        }),
    });
    // Handle response
    if (result.ok) {
      const data = await result.json();
      console.log("Post created in database:", data);
      router.push("/home");
    } else {
      console.error("Failed to submit post");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6">
        
        {/* Title */}
        <div className="flex flex-col">
          <label htmlFor="title" className="mb-2 font-semibold text-gray-700">
            What you're rating:
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => {
              if (e.target.value.length <= 140) setTitle(e.target.value);
            }}
            type="text"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Enter title..."
            required
          />
        </div>

        {/* Review */}
        <div className="flex flex-col">
          <label htmlFor="review" className="mb-2 font-semibold text-gray-700">
            Your review:
          </label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => {
              if (e.target.value.length <= 140) setReview(e.target.value);
            }}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500 resize-none"
            placeholder="Write your thoughts (max 140 characters)..."
            rows={3}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {review.length}/140
          </div>
        </div>

        {/* Star Rating */}
        <div className="flex flex-col">
          <span className="mb-2 font-semibold text-gray-700">Your rating:</span>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
                const { left, width } = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - left;
                const clickedHalf = clickX < width / 2;
                const newRating = clickedHalf ? star - 0.5 : star;
                setRating(newRating);
              };

              let starChar = "★";
              let starColor = "text-gray-300";
              if (rating >= star) {
                starColor = "text-yellow-400"; // full star
              } else if (rating >= star - 0.5) {
                starChar = "⯨"; // visual fallback for half
                starColor = "text-yellow-400";
              }

              return (
                <button
                  key={star}
                  type="button"
                  onClick={handleClick}
                  className={`text-3xl ${starColor} cursor-pointer focus:outline-none`}
                >
                  {starChar}
                </button>
              );
            })}
            <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}/5</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}