import { supabase } from "../../../lib/supabaseClient";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import AuthorBio from "../../../components/AuthorBio";

type PageProps = {
  params: {
    slug: string;
  };
};

async function getPost(slug: string) {
  const { data, error } = await supabase
    .from("posts")
    .select(`*, authors (name, picture_url, bio)`)
    .eq("slug", slug)
    .single();

  if (error || !data) {
    notFound();
  }

  return data;
}

export default async function PostPage({ params }: PageProps) {
  const post: any = await getPost(params.slug);

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-gray-900 mb-4">
        {post.title}
      </h1>

      {post.authors && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <span>Por {post.authors.name}</span>
          <span>•</span>
          <time dateTime={post.created_at}>
            {format(new Date(post.created_at), "d 'de' MMMM 'de' yyyy", {
              locale: ptBR,
            })}
          </time>
        </div>
      )}

      {post.image_url && (
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full rounded-lg mb-8"
        />
      )}

      <div className="prose prose-lg max-w-none">
        {post.content && <ReactMarkdown>{post.content}</ReactMarkdown>}
      </div>

      {post.authors && <AuthorBio author={post.authors} />}
    </article>
  );
}
