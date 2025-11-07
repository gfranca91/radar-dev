# Radar Dev 🚀

[English](#radar-dev-english) | [Português](#radar-dev--português)

## Radar Dev (English)

### Overview

**Radar Dev** is a full-stack, semi-automated technology blog built with a modern Next.js and TypeScript stack. Its core feature is an intelligent content pipeline that runs on an automated schedule. This system fetches the latest technology news from external APIs, processes it using the Google Gemini 2.5 Pro AI to write a unique article, and saves it as a draft in a PostgreSQL database.

This project features a secure, human-in-the-loop workflow: a custom-built admin panel, protected by Supabase Authentication, allows an administrator to review, edit, and publish the AI-generated drafts with a single click, ensuring content quality and adherence to monetization guidelines like Google AdSense.

### Live Demo

You can view the live deployed project on Vercel:
**[https://radar-dev-drab.vercel.app/](https://radar-dev-drab.vercel.app/)**

### Key Features

- **🤖 Automated Content Pipeline:** A server-side Cron Job (Vercel Cron) runs daily, triggering an API route that:

  1.  Fetches real-time tech news from the **NewsAPI.org**.
  2.  Provides the news data to the **Google Gemini 2.5 Pro API** with a detailed prompt.
  3.  Receives a unique, structured JSON object containing a full article, title, slug, tags, and image URL.
  4.  Saves the complete post as a `draft` in the **Supabase** database.

- **🔒 Secure Admin & CMS Panel:**

  - A fully secure admin section built from scratch.
  - **Authentication:** Uses Supabase Auth (Email/Password) to protect all admin routes.
  - **Draft Review:** A private page (`/admin/drafts`) that lists all AI-generated posts with a `draft` status.
  - **Secure Preview & Publish:** A dynamic route (`/admin/preview/[slug]`) allows the admin to read the full post, modify the featured image, and publish it with a single click.

- **🚀 Dynamic Front-End:**
  - Built with **Next.js 14+ (App Router)** and **TypeScript** for performance and type safety.
  - Fully responsive UI built with **Tailwind CSS**.
  - **Dynamic Pages:** Server-side generation of individual post pages (`/post/[slug]`) and category pages (`/tags/[tag]`).
  - **Complex Layouts:** A modern, magazine-style homepage with a featured grid and a main/sidebar column layout.

### Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (with `@tailwindcss/typography`)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Backend Logic:** Next.js API Route Handlers
- **AI / Automation:**
  - Google Gemini 2.5 Pro API
  - NewsAPI.org
  - Vercel Cron Jobs
- **Deployment:** Vercel

---

### Key Technical Challenges & Solutions

This project was a deep dive into solving real-world development problems. Here are some of the key challenges I overcame:

1.  **Challenge:** **Secure Admin-Only Operations.** The automation needed to write to the database, but the public needed read-only access.

    - **Solution:** I implemented a robust security model differentiating between two Supabase clients. The front-end uses the public `anon` key, which is restricted by Row Level Security (RLS) policies (e.g., can only read posts where `status = 'published'`). The back-end API routes use the secret `service_role` key, which safely bypasses RLS to perform sensitive `INSERT` operations (like creating drafts).

2.  **Challenge:** **Reliable AI Data Generation.** The Gemini API is conversational and would often return text (e.g., "Sure, here is the JSON:") before or after the JSON payload, breaking the application's parser.

    - **Solution:** I engineered a highly specific prompt that instructed the AI to return _only_ a valid JSON object. To make the system resilient, I also implemented a server-side parser using `.match()` to find and extract the JSON block (`{...}`) from the AI's full-text response.

3.  **Challenge:** **Vercel Build Failures.** The production build process was much stricter than local development, failing due to type errors (`any`) and image optimization issues (`<img>` vs. `<Image>`, external SVG errors).
    - **Solution:** I systematically refactored the entire application to be 100% type-safe, creating a central `types/index.ts` file. I also migrated all `<img>` tags to the `next/image` component, configured `next.config.ts` to allow external image domains, and solved a critical bug by using the `unoptimized` prop for external SVGs. This ensured a successful and highly optimized production build.

---

---

## Radar Dev (Português)

### Visão Geral

O **Radar Dev** é um blog de tecnologia full-stack e semiautomatizado, construído com as mais modernas tecnologias do ecossistema JavaScript. Sua principal funcionalidade é um pipeline de conteúdo inteligente que é executado em um cronograma automatizado. Este sistema busca as últimas notícias de tecnologia de APIs externas, as processa usando a IA generativa do Google (Gemini 2.5 Pro) para escrever um artigo único e salva o resultado como um rascunho em um banco de dados PostgreSQL.

O projeto possui um fluxo de trabalho seguro com "curadoria humana": um painel de administração personalizado, protegido pelo Supabase Authentication, permite que um administrador revise, edite e publique os rascunhos gerados pela IA com um único clique, garantindo a qualidade do conteúdo e a conformidade com diretrizes de monetização como o Google AdSense.

### Demo Ao Vivo

Você pode ver o projeto publicado na Vercel:
**[https://radar-dev-drab.vercel.app/](https://radar-dev-drab.vercel.app/)**

### Principais Funcionalidades

- **🤖 Pipeline de Conteúdo Automatizado:** Uma tarefa agendada (Vercel Cron Job) executa uma rota de API que:

  1.  Busca notícias de tecnologia em tempo real da **NewsAPI.org**.
  2.  Envia os dados para a **API do Google Gemini 2.5 Pro** com um prompt detalhado.
  3.  Recebe um objeto JSON estruturado contendo um artigo completo, título, slug, tags e URL de imagem.
  4.  Salva o post completo como `draft` (rascunho) no banco de dados **Supabase**.

- **🔒 Painel de Admin Seguro (CMS):**

  - Uma seção de administração completa, construída do zero.
  - **Autenticação:** Usa o Supabase Auth (Email/Senha) para proteger todas as rotas de admin.
  - **Revisão de Rascunhos:** Uma página privada (`/admin/drafts`) que lista todos os posts gerados pela IA com status de `draft`.
  - **Preview Seguro e Publicação:** Uma rota dinâmica (`/admin/preview/[slug]`) que permite ao admin ler o post completo, alterar a imagem de destaque e publicá-lo com um único clique.

- **🚀 Front-End Dinâmico:**
  - Construído com **Next.js 14+ (App Router)** e **TypeScript** para performance e segurança de tipos.
  - Interface totalmente responsiva criada com **Tailwind CSS**.
  - **Páginas Dinâmicas:** Geração no lado do servidor de páginas de posts individuais (`/post/[slug]`) e páginas de categoria (`/tags/[tag]`).
  - **Layouts Complexos:** Uma página inicial moderna em estilo revista, com um grid de posts em destaque e um layout de duas colunas (conteúdo principal/sidebar).

### Stack de Tecnologias

- **Framework:** Next.js 14+ (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS (com `@tailwindcss/typography`)
- **Banco de Dados:** Supabase (PostgreSQL)
- **Autenticação:** Supabase Auth
- **Backend Logic:** Next.js API Route Handlers
- **IA / Automação:**
  - Google Gemini 2.5 Pro API
  - NewsAPI.org
  - Vercel Cron Jobs
- **Deployment:** Vercel

---

### Principais Desafios Técnicos e Soluções

Este projeto foi um mergulho profundo na resolução de problemas do mundo real. Aqui estão alguns dos principais desafios que superei:

1.  **Desafio:** **Proteger Operações de Admin.** A automação precisava escrever no banco de dados, mas o público deveria ter apenas acesso de leitura.

    - **Solução:** Implementei um modelo de segurança robusto que diferencia dois clientes Supabase. O front-end usa a chave pública `anon`, que é restrita por políticas de RLS (Row Level Security) (ex: só pode ler posts com `status = 'published'`). O back-end (rotas de API) usa a chave secreta `service_role`, que ignora as regras de RLS com segurança para realizar operações sensíveis de `INSERT` (como criar rascunhos).

2.  **Desafio:** **Garantir Confiabilidade na Resposta da IA.** A API do Gemini é conversacional e frequentemente retornava texto (ex: "Claro, aqui está o JSON:") junto com o JSON, quebrando o parser da aplicação.

    - **Solução:** Desenvolvi um prompt altamente específico para o Gemini 2.5 Pro, forçando uma saída estritamente em JSON. Para garantir a resiliência, implementei também uma lógica de parsing no servidor que usa `.match()` para encontrar e extrair o bloco JSON (`{...}`) da resposta de texto completa.

3.  **Desafio:** **Falhas de Build na Vercel.** O processo de build de produção era muito mais rigoroso que o de desenvolvimento local, falhando devido a erros de tipo (`any`) e problemas de otimização de imagem (`<img>` vs. `<Image>`, erros com SVGs externos).
    - **Solução:** Refatorei sistematicamente toda a aplicação para ser 100% type-safe, criando um arquivo `types/index.ts` central. Além disso, migrei todas as tags `<img>` para o componente `next/image`, configurei o `next.config.ts` para permitir domínios de imagens externas e resolvi um bug crítico usando a propriedade `unoptimized` para SVGs externos. Isso garantiu um build de produção bem-sucedido e altamente otimizado.
