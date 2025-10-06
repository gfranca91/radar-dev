import { NextResponse } from "next/server";

export async function GET() {
  const geminiKey = process.env.GEMINI_API_KEY;
  const newsApiKey = process.env.NEWS_API_KEY;

  if (!geminiKey || !newsApiKey) {
    return NextResponse.json(
      { error: "Chaves de API não configuradas no ambiente." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "API Route funcionando e chaves de API encontradas!",
    geminiKeyExists: !!geminiKey,
    newsApiKeyExists: !!newsApiKey,
  });
}
