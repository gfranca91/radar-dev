"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Processando...");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message === "Invalid login credentials") {
        setMessage("Usuário não encontrado. Tentando cadastrar...");
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) {
          setMessage(signUpError.message);
        } else {
          setMessage(
            "Cadastro realizado! Verifique seu email para confirmar e então tente fazer o login."
          );
          router.push("/admin/drafts");
        }
      } else {
        setMessage(error.message);
      }
    } else {
      setMessage("Login bem-sucedido! Redirecionando...");
      router.push("/admin/drafts");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <h1 className="text-2xl font-bold text-center mb-6">
        Login de Administrador
      </h1>
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 p-4 border rounded-lg"
      >
        <label htmlFor="email" className="font-semibold">
          Email:
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded"
        />
        <label htmlFor="password" className="font-semibold">
          Senha:
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Entrar / Cadastrar
        </button>
        {message && <p className="text-gray-600 mt-4 text-center">{message}</p>}
      </form>
    </div>
  );
}
