import { supabase } from "../../../lib/supabaseClient";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type PageProps = {
  params: {
    slug: string;
  };
};

async function getPost(slug: string) {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      authors (
        name,
        picture_url
      )
    `
    )
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
    <article>
      <div className="prose lg:prose-xl mx-auto">
        {post.image_url && (
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full rounded-lg mb-4"
          />
        )}

        <h1>{post.title}</h1>

        {post.authors && (
          <div className="not-prose flex items-center space-x-4 my-8">
            <img
              src={post.authors.picture_url || "https://i.pravatar.cc/150"}
              alt={post.authors.name}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <p className="font-bold text-lg leading-none">
                {post.authors.name}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                {format(new Date(post.created_at), "d 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </p>
            </div>
          </div>
        )}

        {post.content && <ReactMarkdown>{post.content}</ReactMarkdown>}
      </div>
    </article>
  );
}
