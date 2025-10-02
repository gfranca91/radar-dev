import { supabase } from "../lib/supabaseClient";

export default async function Home() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published");

  console.log(JSON.stringify(posts, null, 2));

  return (
    <main>
      <h1>Radar Dev</h1>
      <p>Bem-vindo ao blog de notícias para desenvolvedores.</p>
    </main>
  );
}
