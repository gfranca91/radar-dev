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
  urlToImage?: string;
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
      `https://newsapi.org/v2/everything?q=tecnologia&language=pt&sortBy=publishedAt&pageSize=10&apiKey=${newsApiKey}`
    );

    if (!newsResponse.ok) throw new Error("Falha ao buscar notícias.");
    const newsData = await newsResponse.json();

    const articles = newsData.articles as NewsArticle[];

    if (articles.length === 0) {
      return NextResponse.json({
        message: "Nenhuma notícia encontrada para processar.",
      });
    }

    const articleToProcess =
      articles[Math.floor(Math.random() * articles.length)];

    const imageUrl = articleToProcess.urlToImage || "";

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const prompt = `
      Você é um redator para o blog de tecnologia "Radar Dev".
      Crie um post de blog a partir da seguinte notícia.
      
      Notícia:
      - Título: ${articleToProcess.title}
      - Descrição: ${articleToProcess.description}
      - Fonte: ${articleToProcess.source.name}
      - URL da Imagem: ${imageUrl || "sem imagem disponível"}
      
      Regras:
      1. Crie um título novo e chamativo.
      2. Escreva um artigo de 4-5 parágrafos em português.
      3. Crie um slug para a URL (ex: 'nova-versao-do-react').
      4. Sugira um array com 4 tags relevantes.
      5. Inclua a URL da imagem da notícia no campo 'image_url' (pode ser vazio).
      
      Sua resposta deve ser APENAS um objeto JSON válido, sem nenhum texto antes ou depois. Use a seguinte estrutura:
      {
        "title": "...",
        "content": "...",
        "slug": "...",
        "tags": ["...", "..."],
        "image_url": "${imageUrl}"
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const match = responseText.match(/\{[\s\S]*?\}/);
    if (!match) {
      throw new Error(
        "Nenhum objeto JSON válido encontrado na resposta do Gemini."
      );
    }

    let generatedPost: GeneratedPost;
    try {
      generatedPost = JSON.parse(match[0]);
    } catch (err) {
      throw new Error("Falha ao fazer parse do JSON gerado pelo Gemini.");
    }

    const { data: authors, error: authorsError } = await supabaseAdmin
      .from("authors")
      .select("id");

    if (authorsError || !authors || authors.length === 0) {
      throw new Error("Não foi possível buscar autores.");
    }

    const randomAuthorId =
      authors[Math.floor(Math.random() * authors.length)].id;

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
          author_id: randomAuthorId,
        },
      ])
      .select();

    if (error) {
      throw new Error(`Erro ao salvar no Supabase: ${error.message}`);
    }

    if (data) {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      const message = `
🚀 *Novo Rascunho Gerado!* 🚀

*Título:* ${data[0].title}

👉 [Revisar e publicar](https://radar-dev-drab.vercel.app/admin/drafts)
      `;

      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

      try {
        await fetch(telegramUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "Markdown",
            disable_web_page_preview: true,
          }),
        });
      } catch (err) {
        console.error("Erro ao enviar notificação para o Telegram:", err);
      }
    }

    return NextResponse.json({
      message: "Novo rascunho de post criado e notificação enviada!",
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
