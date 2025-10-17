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

  const { count } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("status", "published");

  const totalPages = count ? Math.ceil(count / postsPerPage) : 1;

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

      <div className="flex flex-wrap justify-center gap-2 mt-12">
        {Array.from({ length: totalPages }, (_, i) => {
          const page = i + 1;
          const isActive = page === currentPage;

          return (
            <Link
              key={page}
              href={`/posts/page/${page}`}
              className={`px-4 py-2 rounded border ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
              }`}
            >
              {page}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
