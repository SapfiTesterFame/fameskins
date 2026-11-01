
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        router.replace("/login");
        return;
      }

      setUser(data.user);
      setLoading(false);
    }

    loadProfile();
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (loading) {
    return (
      <main style={styles.page}>
        Загрузка личного кабинета...
      </main>
    );
  }

  const displayName =
    user.user_metadata?.display_name ||
    user.email?.split("@")[0];

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <h1>FAMESKINS</h1>
        <button onClick={logout} style={styles.button}>
          Выйти
        </button>
      </header>

      <section style={styles.content}>
        <p style={{ color: "#999" }}>ЛИЧНЫЙ КАБИНЕТ</p>

        <h2>Привет, {displayName}!</h2>

        <div style={styles.card}>
          <h3>Мой профиль</h3>
          <p>Имя: {displayName}</p>
          <p>Почта: {user.email}</p>
          <p style={{ color: "#888" }}>
            Аккаунт FAMESKINS
          </p>
        </div>

        <div style={styles.card}>
          <h3>Мои возможности</h3>
          <p>Избранные игроки — скоро</p>
          <p>Избранные сеты — скоро</p>
          <p>История просмотров — скоро</p>
          <p>Настройки профиля — скоро</p>
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#101010",
    color: "#fff",
    padding: 30,
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #333",
    paddingBottom: 20,
  },
  content: {
    maxWidth: 850,
    margin: "60px auto",
  },
  card: {
    background: "#191919",
    border: "1px solid #333",
    borderRadius: 12,
    padding: 24,
    marginTop: 20,
  },
  button: {
    padding: "11px 18px",
    background: "#ddd",
    color: "#111",
    border: 0,
    borderRadius: 7,
    cursor: "pointer",
  },
};
