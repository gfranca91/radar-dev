import { supabase } from "../lib/supabaseClient";
import FeaturedPostsGrid from "../components/FeaturedPostsGrid";
import Sidebar from "../components/Sidebar";
import PostListItem from "../components/PostListItem";
export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (!posts || posts.length === 0) {
    return <p>Nenhum post publicado ainda.</p>;
  }

  const featuredPosts = posts.slice(0, 3);
  const remainingPosts = posts.slice(3);

  return (
    <>
      {featuredPosts.length === 3 && (
        <FeaturedPostsGrid
          mainPost={featuredPosts[0]}
          secondaryPosts={featuredPosts.slice(1)}
        />
      )}

      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-bold border-b-2 border-gray-800 pb-2 mb-6">
            Últimos Posts
          </h2>

          <div className="flex flex-col gap-8">
            {remainingPosts.map((post) => (
              <PostListItem key={post.id} {...post} />
            ))}
          </div>
        </div>

        <Sidebar posts={posts} />
      </div>
    </>
  );
}
