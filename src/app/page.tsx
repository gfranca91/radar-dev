import { supabase } from "../lib/supabaseClient";
import PostCard from "../components/PostCard";
import FeaturedPostsGrid from "../components/FeaturedPostsGrid";

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
      <FeaturedPostsGrid mainPost={mainPost} secondaryPosts={secondaryPosts} />

      <h2 className="text-2xl font-bold border-b-2 border-gray-800 pb-2 mb-6">
        Últimos Posts
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {latestPosts.map((post: Post) => (
          <PostCard
            key={post.id}
            title={post.title}
            image_url={post.image_url}
            slug={post.slug}
            tags={post.tags}
          />
        ))}
      </div>
    </>
  );
}
