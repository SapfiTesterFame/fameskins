"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function ConfirmPage() {
  const [message, setMessage] = useState("Подтверждаем вашу почту...");
  const [error, setError] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    async function confirmEmail() {
      try {
        const params = new URLSearchParams(window.location.search);

        const tokenHash = params.get("token_hash");
        const type = params.get("type");

        if (!tokenHash || type !== "signup") {
          throw new Error("Ссылка подтверждения некорректна.");
        }

        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "signup",
        });

        if (error) throw error;

        if (!data.session) {
          throw new Error("Не удалось создать пользовательскую сессию.");
        }

        setMessage("Почта подтверждена! Перенаправляем в профиль...");

        window.location.replace("/profile");
      } catch (err) {
        console.error("Email confirmation error:", err);
        setError(true);
        setMessage(err.message || "Не удалось подтвердить почту.");
      }
    }

    confirmEmail();
  }, []);

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#08080d",
      color: "white",
      fontFamily: "Arial, sans-serif",
      padding: "24px",
    }}>
      <div style={{ textAlign: "center", maxWidth: "420px" }}>
        <h1>FAMESKINS</h1>
        <p>{message}</p>
        {error && (
          <a href="/login" style={{ color: "#aaa" }}>
            Перейти ко входу
          </a>
        )}
      </div>
    </main>
  );
}