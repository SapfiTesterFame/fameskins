
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase.rpc("is_admin");

      if (error || data !== true) {
        router.replace("/login");
        return;
      }

      setLoading(false);
    }

    checkAdmin();
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (loading) {
    return <main style={{ background: "#101010", color: "white", minHeight: "100vh", padding: 40 }}>Проверка доступа...</main>;
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#101010",
      color: "#fff",
      padding: 40,
      fontFamily: "Arial, sans-serif"
    }}>
      <h1>FAMESKINS / ADMIN</h1>
      <p style={{ color: "#999" }}>Панель управления архивом</p>

      <hr style={{ borderColor: "#333", margin: "30px 0" }} />

      <h2>Добро пожаловать, администратор!</h2>
      <p>Доступ к управлению базой данных подтверждён.</p>

      <button onClick={logout} style={{
        marginTop: 25,
        padding: "12px 20px",
        cursor: "pointer"
      }}>
        Выйти
      </button>
    </main>
  );
}
