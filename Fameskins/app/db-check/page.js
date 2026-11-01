
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DatabaseCheck() {
  const [status, setStatus] = useState("Проверяем подключение...");
  const [details, setDetails] = useState("");

  useEffect(() => {
    async function checkDatabase() {
      try {
        const { data, error } = await supabase
          .from("players")
          .select("id")
          .limit(1);

        if (error) {
          setStatus("Ошибка подключения");
          setDetails(error.message);
          return;
        }

        setStatus("База данных подключена!");
        setDetails(`Запрос выполнен. Получено записей: ${data.length}`);
      } catch (error) {
        setStatus("Ошибка подключения");
        setDetails(error.message);
      }
    }

    checkDatabase();
  }, []);

  return (
    <main style={{
      minHeight: "100vh",
      background: "#101010",
      color: "#fff",
      display: "grid",
      placeContent: "center",
      textAlign: "center",
      padding: "30px",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1>FAMESKINS DATABASE</h1>
      <h2>{status}</h2>
      <p style={{ color: "#999" }}>{details}</p>
    </main>
  );
}
