
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError) {
      setError("Неверная почта или пароль");
      setLoading(false);
      return;
    }

    const { data, error: adminError } =
      await supabase.rpc("is_admin");

    if (adminError || data !== true) {
      await supabase.auth.signOut();
      setError("У этого аккаунта нет прав администратора");
      setLoading(false);
      return;
    }

    router.push("/admin");
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#101010",
      color: "#fff",
      display: "grid",
      placeItems: "center",
      padding: 24
    }}>
      <form onSubmit={handleLogin} style={{
        width: "100%",
        maxWidth: 380,
        display: "grid",
        gap: 16
      }}>
        <h1 style={{ fontSize: 28 }}>FAMESKINS</h1>
        <p style={{ color: "#999" }}>Вход для администратора</p>

        <input
          type="email"
          placeholder="Электронная почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        {error && <p style={{ color: "#ff7777" }}>{error}</p>}

        <button disabled={loading} style={buttonStyle}>
          {loading ? "Проверка..." : "Войти"}
        </button>
      </form>
    </main>
  );
}

const inputStyle = {
  padding: 15,
  background: "#1c1c1c",
  color: "#fff",
  border: "1px solid #333",
  borderRadius: 8,
  fontSize: 15
};

const buttonStyle = {
  padding: 15,
  background: "#d5d5d5",
  color: "#111",
  border: 0,
  borderRadius: 8,
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer"
};
