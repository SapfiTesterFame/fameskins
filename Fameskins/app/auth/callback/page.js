
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    async function finishAuthentication() {
      const params = new URLSearchParams(window.location.search);
      const hash = new URLSearchParams(window.location.hash.slice(1));

      const authError =
        params.get("error_description") ||
        hash.get("error_description");

      if (authError) {
        setError(authError);
        return;
      }

      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setError(error.message);
        return;
      }

      if (data.session) {
        router.replace("/profile");
        return;
      }

      setError("Ссылка недействительна или срок её действия истёк.");
    }

    finishAuthentication();
  }, [router]);

  return (
    <main style={{
      minHeight: "100vh",
      background: "#101010",
      color: "#fff",
      display: "grid",
      placeContent: "center",
      textAlign: "center",
      padding: 24,
    }}>
      <h1>FAMESKINS</h1>
      <p>{error || "Подтверждаем аккаунт..."}</p>
      {error && <a href="/login" style={{ color: "#fff" }}>Перейти ко входу</a>}
    </main>
  );
}
