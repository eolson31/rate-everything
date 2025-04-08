"use client";

export default function PostFeed({posts}: {posts: any[]}) {
  return (
    <div>
        {posts.map((post) => (
            <div key={`post-container-${post.id}`} style={{border: "1px solid black"}}>
                <p key={`title-${post.id}`} style={{fontSize: "40px"}}>{post.title}</p>
                <p key={`post-${post.id}`}>{`By: ${post.author}`}</p>
                <p key={`timestamp-${post.id}`}>{`Posted on: ${post.createdAt.toUTCString()}`}</p>
                <p key={`rating-${post.id}`}>{`Rating: ${post.rating}/5`}</p>
            </div>
        ))}
    </div>
  ); 
}
