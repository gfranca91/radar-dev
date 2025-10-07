import { supabase } from "../../../lib/supabaseClient";
import PostCard from "../../../components/PostCard";
import type { Post } from "../../../types";

type PageProps = {
  params: {
    tag: string;
  };
};

async function getPostsByTag(tag: string): Promise<Post[]> {
  const decodedTag = decodeURIComponent(tag);

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .contains("tags", [decodedTag])
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar posts por tag:", error);
  }

  return data || [];
}

export default async function TagPage({ params }: PageProps) {
  const posts = await getPostsByTag(params.tag);
  const tagName = decodeURIComponent(params.tag);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Posts com a tag: <span className="text-blue-600">#{tagName}</span>
      </h1>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      ) : (
        <p>Nenhum post encontrado com esta tag.</p>
      )}
    </div>
  );
}
