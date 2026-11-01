
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Неверная почта или пароль");
      setLoading(false);
      return;
    }

    const { data, error: adminError } =
      await supabase.rpc("is_admin");

    router.replace(
      !adminError && data === true ? "/admin" : "/profile"
    );
  }

  return (
    <main style={styles.page}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h1>FAMESKINS</h1>
        <p style={{ color: "#999" }}>Вход в аккаунт</p>

        <input
          style={styles.input}
          type="email"
          placeholder="Электронная почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p style={{ color: "#ff7777" }}>{error}</p>}

        <button disabled={loading} style={styles.button}>
          {loading ? "Вход..." : "Войти"}
        </button>

        <p style={{ color: "#999", textAlign: "center" }}>
          Нет аккаунта? <Link href="/register">Регистрация</Link>
        </p>
      </form>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#101010",
    color: "#fff",
    display: "grid",
    placeItems: "center",
    padding: 24,
    fontFamily: "Arial, sans-serif",
  },
  form: {
    width: "100%",
    maxWidth: 380,
    display: "grid",
    gap: 16,
  },
  input: {
    padding: 15,
    background: "#1c1c1c",
    color: "#fff",
    border: "1px solid #333",
    borderRadius: 8,
    fontSize: 15,
  },
  button: {
    padding: 15,
    background: "#dedede",
    color: "#111",
    border: 0,
    borderRadius: 8,
    fontWeight: 600,
    cursor: "pointer",
  },
};
