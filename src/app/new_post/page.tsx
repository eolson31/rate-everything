"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function newPost() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", { rating, review });
    router.push("/home");
    // Here you would usually send to your server
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
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl ${
                  star <= rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
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