import PostFeed from "./post_feed";
import { get_posts } from "./queries";

export default async function Home() {
    const posts = await get_posts();

  return (
    <div>
        <PostFeed posts={posts}/>
    </div>
  );
}
