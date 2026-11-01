
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const DISCOUNTS = [5, 10, 15, 20];

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [prizes, setPrizes] = useState([]);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkAdmin() {
      try {
        const {
          data: { user },
          error: userError
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.replace("/login");
          return;
        }

        const { data: isAdmin, error: adminError } =
          await supabase.rpc("is_admin");

        if (adminError || isAdmin !== true) {
          router.replace("/login");
          return;
        }

        const { data, error } = await supabase
          .from("daily_wheel_prizes")
          .select("discount_percent, chance, enabled")
          .order("discount_percent");

        if (!mounted) return;

        if (error) {
          setMessage("Не удалось загрузить настройки колеса: " + error.message);
          return;
        }

        const formatted = DISCOUNTS.map((discount) => {
          const row = data?.find(
            (item) => item.discount_percent === discount
          );

          return {
            discount_percent: discount,
            chance: String(row?.chance ?? 0),
            enabled: row?.enabled ?? false
          };
        });

        setPrizes(formatted);
      } catch {
        if (mounted) {
          setMessage("Произошла ошибка при проверке доступа.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    checkAdmin();

    return () => {
      mounted = false;
    };
  }, [router]);

  const totalChance = Number(
    prizes
      .reduce(
        (total, prize) =>
          total + (prize.enabled ? Number(prize.chance || 0) : 0),
        0
      )
      .toFixed(2)
  );

  const valid =
    prizes.length === 4 &&
    totalChance === 100 &&
    prizes.every((prize) =>
      prize.enabled
        ? Number(prize.chance) > 0 && Number(prize.chance) <= 100
        : Number(prize.chance) === 0
    );

  function updateChance(discount, value) {
    setPrizes((current) =>
      current.map((prize) =>
        prize.discount_percent === discount
          ? { ...prize, chance: value }
          : prize
      )
    );
    setMessage("");
  }

  function togglePrize(discount, enabled) {
    setPrizes((current) =>
      current.map((prize) => {
        if (prize.discount_percent !== discount) return prize;

        return {
          ...prize,
          enabled,
          chance: enabled
            ? (Number(prize.chance) > 0 ? prize.chance : "5")
            : "0"
        };
      })
    );

    setMessage("");
  }

  async function savePrizes() {
    if (!valid || saving) return;

    setSaving(true);
    setMessage("");

    const payload = prizes.map((prize) => ({
      discount_percent: prize.discount_percent,
      chance: prize.enabled ? Number(prize.chance) : 0,
      enabled: prize.enabled
    }));

    const { error } = await supabase.rpc(
      "admin_update_daily_wheel_prizes",
      { p_prizes: payload }
    );

    if (error) {
      setMessage("Ошибка сохранения: " + error.message);
      setSuccess(false);
    } else {
      setMessage("Настройки колеса успешно сохранены!");
      setSuccess(true);
    }

    setSaving(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (loading) {
    return (
      <main style={styles.page}>
        Проверка доступа и загрузка настроек...
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.top}>
          <div>
            <span style={styles.kicker}>FAMESKINS / CONTROL PANEL</span>
            <h1 style={styles.title}>ADMIN PANEL</h1>
            <p style={styles.muted}>Управление архивом и ежедневными наградами.</p>
          </div>

          <button style={styles.logout} onClick={logout}>
            Выйти
          </button>
        </div>

        <section style={styles.card}>
          <span style={styles.kicker}>DAILY REWARDS / CONFIGURATION</span>
          <h2 style={styles.heading}>Шансы колеса удачи</h2>

          <p style={styles.muted}>
            Установи вероятность выпадения каждой скидки.
            Сумма активных наград должна составлять 100%.
          </p>

          <div style={styles.prizes}>
            {prizes.map((prize) => (
              <div key={prize.discount_percent} style={styles.prize}>
                <div style={styles.prizeInfo}>
                  <strong style={styles.discount}>
                    Скидка {prize.discount_percent}%
                  </strong>
                  <span style={styles.muted}>
                    {prize.enabled ? "Награда активна" : "Награда отключена"}
                  </span>
                </div>

                <label style={styles.chanceLabel}>
                  Шанс, %
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={prize.chance}
                    disabled={!prize.enabled}
                    onChange={(event) =>
                      updateChance(
                        prize.discount_percent,
                        event.target.value
                      )
                    }
                    style={styles.input}
                  />
                </label>

                <label style={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={prize.enabled}
                    onChange={(event) =>
                      togglePrize(
                        prize.discount_percent,
                        event.target.checked
                      )
                    }
                  />
                  Включена
                </label>
              </div>
            ))}
          </div>

          <div style={styles.total}>
            <div>
              <span style={styles.muted}>Сумма шансов</span>
              <strong style={styles.totalValue}>{totalChance}%</strong>
            </div>

            <span
              style={{
                ...styles.status,
                color: valid ? "#74dc9b" : "#ff8d8d"
              }}
            >
              {valid ? "ГОТОВО К СОХРАНЕНИЮ" : "СУММА ДОЛЖНА БЫТЬ 100%"}
            </span>
          </div>

          <button
            onClick={savePrizes}
            disabled={!valid || saving}
            style={{
              ...styles.save,
              opacity: !valid || saving ? 0.45 : 1,
              cursor: !valid || saving ? "not-allowed" : "pointer"
            }}
          >
            {saving ? "СОХРАНЕНИЕ..." : "СОХРАНИТЬ НАСТРОЙКИ"}
          </button>

          {message && (
            <p
              role="status"
              style={{
                ...styles.message,
                color: success ? "#74dc9b" : "#ff8d8d"
              }}
            >
              {message}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#101010",
    color: "#fff",
    padding: "40px 20px",
    fontFamily: "Arial, sans-serif"
  },
  container: {
    maxWidth: 900,
    margin: "0 auto"
  },
  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    flexWrap: "wrap",
    marginBottom: 40
  },
  kicker: {
    color: "#b99a6b",
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: 700
  },
  title: {
    fontSize: 36,
    margin: "12px 0"
  },
  heading: {
    fontSize: 25,
    margin: "16px 0 8px"
  },
  muted: {
    color: "#969696",
    fontSize: 14,
    lineHeight: 1.6
  },
  card: {
    background: "#191919",
    border: "1px solid #333",
    borderRadius: 14,
    padding: 28
  },
  prizes: {
    marginTop: 28
  },
  prize: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    flexWrap: "wrap",
    padding: "20px 0",
    borderBottom: "1px solid #333"
  },
  prizeInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 7,
    minWidth: 130
  },
  discount: {
    fontSize: 17
  },
  chanceLabel: {
    color: "#aaa",
    fontSize: 12,
    display: "flex",
    alignItems: "center",
    gap: 10
  },
  input: {
    width: 100,
    padding: "11px",
    background: "#252525",
    border: "1px solid #444",
    borderRadius: 7,
    color: "#fff",
    fontSize: 16
  },
  toggle: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#aaa",
    fontSize: 13
  },
  total: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 15,
    padding: "22px 0"
  },
  totalValue: {
    display: "block",
    fontSize: 30,
    marginTop: 5
  },
  status: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1
  },
  save: {
    width: "100%",
    padding: 16,
    border: 0,
    borderRadius: 8,
    background: "#b99a6b",
    color: "#111",
    fontWeight: 800,
    letterSpacing: 1,
    fontSize: 13
  },
  message: {
    fontSize: 13,
    marginTop: 18
  },
  logout: {
    padding: "11px 18px",
    background: "transparent",
    border: "1px solid #444",
    borderRadius: 7,
    color: "#fff",
    cursor: "pointer"
  }
};
