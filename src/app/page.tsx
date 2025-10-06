import { supabase } from "../lib/supabaseClient";
import FeaturedPostsGrid from "../components/FeaturedPostsGrid";
import Sidebar from "../components/Sidebar";
import PostListItem from "../components/PostListItem";

type Post = {
  id: number;
  title: string;
  image_url: string | null;
  slug: string;
  tags: string[] | null;
};

export default async function Home() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (!posts || posts.length === 0) {
    return <p>Nenhum post publicado ainda.</p>;
  }

  const mainPost = posts[0];
  const secondaryPosts = posts.slice(1, 3);
  const latestPosts = posts.slice(3);

  return (
    <>
      {posts.length >= 3 && (
        <FeaturedPostsGrid
          mainPost={mainPost}
          secondaryPosts={secondaryPosts}
        />
      )}

      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-bold border-b-2 border-gray-800 pb-2 mb-6">
            Últimos Posts
          </h2>

          <div className="flex flex-col gap-8">
            {latestPosts.length > 0
              ? latestPosts.map((post: Post) => (
                  <PostListItem key={post.id} {...post} />
                ))
              : posts
                  .slice(0, 3)
                  .map((post: Post) => (
                    <PostListItem key={post.id} {...post} />
                  ))}
          </div>
        </div>

        <Sidebar posts={posts} />
      </div>
    </>
  );
}
