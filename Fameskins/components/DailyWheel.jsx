"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Check, LockKeyhole, Sparkles, TicketPercent } from "lucide-react";
import { supabase } from "../lib/supabase";

const SEGMENTS = [5, 5, 5, 5, 10, 10, 15, 20];
const SPIN_MS = 5600;

function getTimeLeft(value) {
  if (!value) return 0;
  return Math.max(0, new Date(value).getTime() - Date.now());
}

function formatTime(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
}

export default function DailyWheel() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [nextSpinAt, setNextSpinAt] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [reward, setReward] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadStatus(currentUser) {
      if (!currentUser) {
        setNextSpinAt(null);
        return;
      }

      const { data, error } = await supabase
        .from("daily_wheel_state")
        .select("last_spun_at")
        .eq("user_id", currentUser.id)
        .maybeSingle();

      if (!mounted) return;
      if (error) {
        setMessage("Не удалось проверить доступность прокрутки. Попробуй обновить страницу.");
        return;
      }
      setNextSpinAt(data?.last_spun_at ? new Date(new Date(data.last_spun_at).getTime() + 24 * 60 * 60 * 1000).toISOString() : null);
    }

    async function init() {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(data.user || null);
      await loadStatus(data.user || null);
      if (mounted) setChecking(false);
    }

    init();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      loadStatus(session?.user || null);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!nextSpinAt) {
      setRemaining(0);
      return;
    }
    const update = () => setRemaining(getTimeLeft(nextSpinAt));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [nextSpinAt]);

  const canSpin = Boolean(user) && !checking && !spinning && remaining === 0;
  const statusText = useMemo(() => {
    if (checking) return "ПРОВЕРЯЕМ АККАУНТ...";
    if (!user) return "ВОЙДИ, ЧТОБЫ ПОЛУЧИТЬ ПОПЫТКУ";
    if (spinning) return "КОЛЕСО В ДВИЖЕНИИ...";
    if (remaining > 0) return `СЛЕДУЮЩАЯ ПОПЫТКА ЧЕРЕЗ ${formatTime(remaining)}`;
    return "ТВОЯ ЕЖЕДНЕВНАЯ ПОПЫТКА ДОСТУПНА";
  }, [checking, user, spinning, remaining]);

  async function spin() {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    if (!canSpin) return;

    setMessage("");
    setReward(null);
    setSpinning(true);

    const { data, error } = await supabase.rpc("spin_daily_wheel");
    if (error) {
      setSpinning(false);
      const { data: state } = await supabase
        .from("daily_wheel_state")
        .select("last_spun_at")
        .eq("user_id", user.id)
        .maybeSingle();
      if (state?.last_spun_at) {
        setNextSpinAt(new Date(new Date(state.last_spun_at).getTime() + 24 * 60 * 60 * 1000).toISOString());
        setMessage("Попытка уже использована. Таймер обновлён.");
      } else {
        setMessage(error.message || "Не удалось прокрутить колесо. Попробуй ещё раз.");
      }
      return;
    }

    const result = Array.isArray(data) ? data[0] : data;
    if (!result?.promo_code || !result?.discount_percent || !result?.next_spin_at) {
      setSpinning(false);
      setMessage("Сервер вернул неполный результат. Обнови страницу и проверь промокоды в профиле.");
      return;
    }

    const candidates = SEGMENTS.map((value, index) => value === Number(result.discount_percent) ? index : -1).filter((index) => index >= 0);
    const targetIndex = candidates[Math.floor(Math.random() * candidates.length)];
    const targetMod = (360 - (targetIndex * 45)) % 360;
    setRotation((current) => {
      const currentMod = ((current % 360) + 360) % 360;
      const delta = ((targetMod - currentMod + 360) % 360) + 5 * 360;
      return current + delta;
    });
    setNextSpinAt(result.next_spin_at);

    window.setTimeout(() => {
      setReward(result);
      setSpinning(false);
    }, SPIN_MS);
  }

  return (
    <section className="daily-wheel-section" id="daily-wheel">
      <div className="daily-wheel-wrap">
        <div className="daily-wheel-copy">
          <span className="daily-wheel-kicker"><span /> FAMESKINS / DAILY REWARDS</span>
          <h2>YOUR DAILY<br /><span>LUCK.</span></h2>
          <p>Один шанс раз в 24 часа. Крути колесо, забирай персональный промокод и используй свою скидку.</p>
          <div className="daily-wheel-perks">
            <div><TicketPercent size={17} /><span>Персональные промокоды</span></div>
            <div><LockKeyhole size={17} /><span>Только для авторизованных</span></div>
            <div><Sparkles size={17} /><span>Новая попытка через 24 часа</span></div>
          </div>
        </div>

        <div className="daily-wheel-card">
          <div className="daily-wheel-card-top"><span>DAILY SPIN / 001</span><span>5 — 20% DISCOUNT</span></div>
          <div className="daily-wheel-stage">
            <div className="daily-wheel-pointer" />
            <div className={`daily-wheel-disc${spinning ? " is-spinning" : ""}`} style={{ transform: `rotate(${rotation}deg)` }}>
              {SEGMENTS.map((discount, index) => (
                <span className="daily-wheel-label" key={`${discount}-${index}`} style={{ transform: `translate(-50%, -50%) rotate(${index * 45}deg) translateY(-91px) rotate(${-index * 45}deg)` }}>
                  {discount}%
                </span>
              ))}
              <div className="daily-wheel-center"><span>F</span></div>
            </div>
          </div>
          <div className="daily-wheel-status">{statusText}</div>
          {user ? (
            <button className="daily-wheel-button" onClick={spin} disabled={!canSpin}>
              {spinning ? "КРУТИМ..." : remaining > 0 ? "ПОПЫТКА ИСПОЛЬЗОВАНА" : "КРУТИТЬ КОЛЕСО"}
              {!spinning && <ArrowUpRight size={17} />}
            </button>
          ) : (
            <a className="daily-wheel-button" href="/login">ВОЙТИ И КРУТИТЬ <ArrowUpRight size={17} /></a>
          )}
          {message && <p className="daily-wheel-message" role="status">{message}</p>}
          {reward && (
            <div className="daily-wheel-reward" role="status">
              <div className="daily-wheel-reward-icon"><Check size={19} /></div>
              <div><span>ТВОЙ ВЫИГРЫШ</span><strong>СКИДКА {reward.discount_percent}%</strong><code>{reward.promo_code}</code><small>Промокод уже сохранён в твоём профиле.</small></div>
              <a href="/profile#my-promocodes">ОТКРЫТЬ <ArrowUpRight size={13} /></a>
            </div>
          )}
          <div className="daily-wheel-card-bottom"><span>ONE SPIN / 24 HOURS</span><span>PLAY FAIR. GOOD LUCK.</span></div>
        </div>
      </div>
    </section>
  );
}
