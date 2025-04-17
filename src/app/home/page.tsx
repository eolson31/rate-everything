// app/page.tsx
import { get_posts } from "../queries";
import PostFeedClient from "../home/PostFeedClient";

export default async function Home() {
  const posts = await get_posts();

  return (
    <div>
      <PostFeedClient posts={posts} />
    </div>
  );
}
