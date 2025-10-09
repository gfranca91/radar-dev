import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export const maxDuration = 30;

interface GeneratedPost {
  title: string;
  content: string;
  slug: string;
  tags: string[];
  image_url: string;
}

interface NewsArticle {
  title: string;
  description: string;
  urlToImage: string;
  source: {
    name: string;
  };
}

export async function GET() {
  try {
    const geminiKey = process.env.GEMINI_API_KEY;
    const newsApiKey = process.env.NEWS_API_KEY;

    if (!geminiKey || !newsApiKey) {
      throw new Error("Chaves de API não configuradas.");
    }

    const newsResponse = await fetch(
      `https://newsapi.org/v2/top-headlines?country=br&category=technology&pageSize=10&apiKey=${newsApiKey}`
    );
    if (!newsResponse.ok) throw new Error("Falha ao buscar notícias.");
    const newsData = await newsResponse.json();

    const articlesWithImages = (newsData.articles as NewsArticle[]).filter(
      (article) => article.urlToImage
    );

    if (articlesWithImages.length === 0) {
      return NextResponse.json({
        message: "Nenhuma notícia com imagem encontrada para processar.",
      });
    }

    const articleToProcess =
      articlesWithImages[Math.floor(Math.random() * articlesWithImages.length)];

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const prompt = `
      Você é um redator para o blog de tecnologia "Radar Dev".
      Crie um post de blog a partir da seguinte notícia.
      
      Notícia:
      - Título: ${articleToProcess.title}
      - Descrição: ${articleToProcess.description}
      - Fonte: ${articleToProcess.source.name}
      - URL da Imagem: ${articleToProcess.urlToImage}
      
      Regras:
      1. Crie um título novo e chamativo.
      2. Escreva um artigo de 4-5 parágrafos em português.
      3. Crie um slug para a URL (ex: 'nova-versao-do-react').
      4. Sugira um array com 4 tags relevantes.
      5. Inclua a URL da imagem da notícia no campo 'image_url'.
      
      Sua resposta deve ser APENAS um objeto JSON válido, sem nenhum texto antes ou depois. Use a seguinte estrutura:
      {
        "title": "...",
        "content": "...",
        "slug": "...",
        "tags": ["...", "..."],
        "image_url": "${articleToProcess.urlToImage}"
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonStartIndex = responseText.indexOf("{");
    const jsonEndIndex = responseText.lastIndexOf("}");
    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      throw new Error(
        "Nenhum objeto JSON válido encontrado na resposta do Gemini."
      );
    }

    const jsonString = responseText.substring(jsonStartIndex, jsonEndIndex + 1);
    const generatedPost = JSON.parse(jsonString) as GeneratedPost;

    const { data, error } = await supabaseAdmin
      .from("posts")
      .insert([
        {
          title: generatedPost.title,
          content: generatedPost.content,
          slug: generatedPost.slug,
          tags: generatedPost.tags,
          image_url: generatedPost.image_url,
          status: "draft",
          author_id: 1,
        },
      ])
      .select();

    if (error) {
      throw new Error(`Erro ao salvar no Supabase: ${error.message}`);
    }

    return NextResponse.json({
      message: "Novo rascunho de post (com imagem) criado com sucesso!",
      post: data,
    });
  } catch (error: unknown) {
    let errorMessage = "Ocorreu um erro desconhecido.";
    if (error instanceof Error) {
      console.error("ERRO NA API ROUTE:", error);
      errorMessage = error.message;
    } else {
      console.error("ERRO NA API ROUTE:", String(error));
    }
    return NextResponse.json(
      { error: `Ocorreu um erro: ${errorMessage}` },
      { status: 500 }
    );
  }
}
