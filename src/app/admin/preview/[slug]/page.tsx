"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { supabase } from "../../../../lib/supabaseClient";
import type { Post } from "../../../../types";
import AuthorBio from "../../../../components/AuthorBio";

export default function PreviewPostPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const router = useRouter();
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("posts")
        .select(`*, authors (name, picture_url, bio)`)
        .eq("slug", slug)
        .single();

      if (error || !data) {
        console.error("Post não encontrado:", error);
        setLoading(false);
        router.push("/admin/drafts");
        return;
      }

      setPost(data as Post);
      setLoading(false);
    };

    fetchPost();
  }, [slug, router]);

  const handlePublish = async () => {
    if (!post) return;
    setMessage("Publicando...");

    const { error } = await supabase
      .from("posts")
      .update({ status: "published" })
      .eq("id", post.id);

    if (error) {
      setMessage(`Erro ao publicar: ${error.message}`);
    } else {
      setMessage("Post publicado com sucesso! Redirecionando...");
      setTimeout(() => {
        router.push("/admin/drafts");
      }, 2000);
    }
  };

  const handleImageUrlSubmit = async () => {
    if (!post || !imageUrlInput) return;
    setUploading(true);

    const { error } = await supabase
      .from("posts")
      .update({ image_url: imageUrlInput })
      .eq("id", post.id);

    if (error) {
      setMessage(`Erro ao atualizar imagem: ${error.message}`);
    } else {
      setMessage("Imagem atualizada com sucesso!");
      setPost({ ...post, image_url: imageUrlInput });
    }

    setUploading(false);
  };

  const handleFileUpload = async () => {
    if (!post || !file) return;
    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${post.slug}-${Date.now()}.${fileExt}`;
    const filePath = `posts/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      setMessage(`Erro ao fazer upload: ${uploadError.message}`);
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("post-images").getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from("posts")
      .update({ image_url: publicUrl })
      .eq("id", post.id);

    if (updateError) {
      setMessage(`Erro ao atualizar imagem: ${updateError.message}`);
    } else {
      setMessage("Imagem atualizada com sucesso!");
      setPost({ ...post, image_url: publicUrl });
    }

    setUploading(false);
  };

  if (loading) {
    return <p className="p-4 text-center">Carregando preview...</p>;
  }

  if (!post) {
    return (
      <p className="p-4 text-center">
        Post não encontrado ou você não tem permissão.
      </p>
    );
  }

  return (
    <div>
      <div className="bg-yellow-400 text-yellow-900 text-center p-2 font-semibold">
        MODO PREVIEW -{" "}
        <Link href="/admin/drafts" className="underline">
          Voltar para a lista de Rascunhos
        </Link>
      </div>

      <div className="text-center my-4 space-x-4">
        <button
          onClick={handlePublish}
          disabled={post.status === "published" || !!message}
          className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
        >
          {post.status === "published" ? "Já Publicado" : "Publicar Post"}
        </button>
      </div>

      {message && (
        <p className="text-center font-semibold my-4 text-blue-600">
          {message}
        </p>
      )}

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
          <Image
            src={post.image_url}
            alt={post.title}
            width={1200}
            height={600}
            className="w-full h-auto rounded-lg mb-8"
            unoptimized
          />
        )}

        <div className="mb-8 space-y-4">
          <h2 className="text-xl font-bold">Atualizar imagem do post</h2>

          <div>
            <label className="block font-semibold">URL externa:</label>
            <input
              type="text"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              className="border p-2 w-full"
              placeholder="https://exemplo.com/imagem.jpg"
            />
            <button
              onClick={handleImageUrlSubmit}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
              disabled={uploading}
            >
              Usar esta URL
            </button>
          </div>

          <div>
            <label className="block font-semibold mt-4">
              Ou envie uma imagem:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <button
              onClick={handleFileUpload}
              className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
              disabled={uploading}
            >
              Fazer upload
            </button>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          {post.content && <ReactMarkdown>{post.content}</ReactMarkdown>}
        </div>
        {post.authors && post.authors.bio && (
          <AuthorBio author={post.authors} />
        )}
      </article>
    </div>
  );
}
