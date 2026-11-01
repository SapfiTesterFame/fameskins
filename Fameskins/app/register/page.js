
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 8) {
      setError("Пароль должен содержать минимум 8 символов");
      return;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          display_name: name.trim(),
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      router.push("/profile");
      return;
    }

    setMessage("Регистрация создана! Проверь почту и перейди по ссылке подтверждения.");
  }

  return (
    <main style={styles.page}>
      <form onSubmit={handleRegister} style={styles.form}>
        <h1 style={styles.logo}>FAMESKINS</h1>
        <p style={styles.subtitle}>Создание аккаунта</p>

        <input
          style={styles.input}
          placeholder="Имя пользователя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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
          placeholder="Пароль (от 8 символов)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Повторите пароль"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {error && <p style={styles.error}>{error}</p>}
        {message && <p style={styles.message}>{message}</p>}

        <button disabled={loading} style={styles.button}>
          {loading ? "Создание аккаунта..." : "Зарегистрироваться"}
        </button>

        <p style={styles.footer}>
          Уже есть аккаунт? <Link href="/login">Войти</Link>
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
    maxWidth: 390,
    display: "grid",
    gap: 14,
  },
  logo: {
    fontSize: 30,
    letterSpacing: 3,
    margin: 0,
  },
  subtitle: {
    color: "#999",
    marginTop: 0,
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
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
  error: {
    color: "#ff7777",
  },
  message: {
    color: "#9bd6a5",
  },
  footer: {
    color: "#999",
    textAlign: "center",
  },
};
