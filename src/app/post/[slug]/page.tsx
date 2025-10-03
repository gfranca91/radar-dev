import { supabase } from "../../../lib/supabaseClient";
import { notFound } from "next/navigation";

type PageProps = {
  params: {
    slug: string;
  };
};

async function getPost(slug: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    notFound();
  }

  return data;
}

export default async function PostPage({ params }: PageProps) {
  const post = await getPost(params.slug);

  return (
    <article className="container mx-auto p-4">
      <h1 className="text-4xl font-bold my-8">{post.title}</h1>

      <div className="prose lg:prose-xl">
        <p>{post.content}</p>
      </div>
    </article>
  );
}
