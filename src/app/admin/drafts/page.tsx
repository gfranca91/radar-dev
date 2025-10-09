"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import type { Post } from "../../../types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndDrafts = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("posts")
        .select("*, authors(*)")
        .eq("status", "draft")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar rascunhos:", error);
      } else if (data) {
        setDrafts(data);
      }

      setLoading(false);
    };

    fetchUserAndDrafts();
  }, [router]);

  if (loading) {
    return <p className="p-4 text-center">Carregando...</p>;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rascunhos Pendentes</h1>
        <span className="font-bold text-gray-500">
          {drafts.length} rascunho(s)
        </span>
      </div>
      {drafts.length === 0 ? (
        <p>Nenhum rascunho disponível. A automação rodará em breve!</p>
      ) : (
        <ul className="space-y-6">
          {drafts.map((post) => (
            <li
              key={post.id}
              className="border p-4 rounded-lg shadow-sm bg-white"
            >
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                <span>
                  Gerado em:{" "}
                  {format(new Date(post.created_at), "d/MM/yy 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </span>
                {post.authors && (
                  <>
                    <span>•</span>
                    <span>Autor Padrão: {post.authors.name}</span>
                  </>
                )}
              </div>
              <p className="mt-2 line-clamp-3 text-gray-700">{post.content}</p>
              <div className="mt-4">
                <Link
                  href={`/admin/preview/${post.slug}`}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Revisar e Publicar →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
