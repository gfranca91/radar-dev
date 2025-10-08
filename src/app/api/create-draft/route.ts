import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export const maxDuration = 30;

export async function GET() {
  try {
    const geminiKey = process.env.GEMINI_API_KEY;
    const newsApiKey = process.env.NEWS_API_KEY;

    if (!geminiKey || !newsApiKey) {
      throw new Error("Chaves de API não configuradas.");
    }

    const newsResponse = await fetch(
      `https://newsapi.org/v2/top-headlines?country=br&category=technology&pageSize=5&apiKey=${newsApiKey}`
    );
    if (!newsResponse.ok) {
      throw new Error("Falha ao buscar notícias da NewsAPI.");
    }
    const newsData = await newsResponse.json();
    if (newsData.articles.length === 0) {
      return NextResponse.json({
        message: "Nenhuma notícia nova encontrada para processar.",
      });
    }
    const articleToProcess =
      newsData.articles[Math.floor(Math.random() * newsData.articles.length)];

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const prompt = `
      Você é um redator para o blog de tecnologia "Radar Dev".
      Crie um post de blog a partir da seguinte notícia.
      
      Notícia:
      - Título: ${articleToProcess.title}
      - Descrição: ${articleToProcess.description}
      - Fonte: ${articleToProcess.source.name}
      
      Regras:
      1. Crie um título novo e chamativo.
      2. Escreva um artigo de 4-5 parágrafos em português.
      3. Crie um slug para a URL.
      4. Sugira um array com 4 tags relevantes.
      
      Sua resposta deve ser APENAS um objeto JSON válido com a estrutura:
      {
        "title": "...",
        "content": "...",
        "slug": "...",
        "tags": ["...", "..."]
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanedResponse = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const generatedPost = JSON.parse(cleanedResponse);

    const { data, error: supabaseError } = await supabaseAdmin
      .from("posts")
      .insert([
        {
          title: generatedPost.title,
          content: generatedPost.content,
          slug: generatedPost.slug,
          tags: generatedPost.tags,
          status: "draft",
          author_id: 1,
        },
      ])
      .select();

    if (supabaseError) {
      throw new Error(`Erro ao salvar no Supabase: ${supabaseError.message}`);
    }

    return NextResponse.json({
      message:
        "Novo rascunho de post criado com sucesso a partir de notícias reais!",
      post: data,
    });
  } catch (error: any) {
    console.error("ERRO NA API ROUTE:", error);
    return NextResponse.json(
      { error: `Ocorreu um erro: ${error.message}` },
      { status: 500 }
    );
  }
}
