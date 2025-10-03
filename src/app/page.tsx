import { supabase } from "../lib/supabaseClient";
import PostCard from "../components/PostCard";

type Post = {
  id: number;
  title: string;
  content: string;
  status: string;
  image_url: string | null;
  tags: string[] | null;
  slug: string;
};

export default async function Home() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published");

  if (!posts || posts.length === 0) {
    return (
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Radar Dev</h1>
        <p>Nenhum post publicado ainda.</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Radar Dev</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: Post) => (
          <PostCard
            key={post.id}
            title={post.title}
            image_url={post.image_url}
            tags={post.tags}
          />
        ))}
      </div>
    </main>
  );
}
