import { supabase } from "@/lib/supabaseClient";
import PostListItem from "@/components/PostListItem";
import Link from "next/link";

interface Props {
  params: {
    page: string;
  };
}

export default async function PostsPage({ params }: Props) {
  const currentPage = parseInt(params.page, 10) || 1;
  const postsPerPage = 10;
  const from = (currentPage - 1) * postsPerPage;
  const to = from + postsPerPage - 1;

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error || !posts || posts.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-4">Posts</h1>
        <p>Nenhum post encontrado nesta página.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Todos os Posts</h1>

      <div className="flex flex-col gap-8">
        {posts.map((post) => (
          <PostListItem key={post.id} {...post} />
        ))}
      </div>

      <div className="flex justify-between items-center mt-12">
        {currentPage > 1 ? (
          <Link
            href={`/posts/page/${currentPage - 1}`}
            className="text-blue-600 hover:underline"
          >
            ← Página anterior
          </Link>
        ) : (
          <div />
        )}

        {posts.length === postsPerPage && (
          <Link
            href={`/posts/page/${currentPage + 1}`}
            className="text-blue-600 hover:underline"
          >
            Próxima página →
          </Link>
        )}
      </div>
    </div>
  );
}
