// app/page.tsx
import { get_all_posts_from_database } from "../queries";
import PostFeedClient from "../home/PostFeedClient";

export default async function Home() {
  const posts = await get_all_posts_from_database();

  return (
    <div>
      <PostFeedClient posts={posts} />
    </div>
  );
}
