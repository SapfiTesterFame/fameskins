"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Check,
  Copy,
  Edit3,
  Heart,
  LogOut,
  Mail,
  Save,
  ShieldCheck,
  Sparkles,
  TicketPercent,
  X,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [promos, setPromos] = useState([]);
  const [promoError, setPromoError] = useState("");
  const [notice, setNotice] = useState("");
  const [copiedCode, setCopiedCode] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const { data, error } = await supabase.auth.getUser();
      if (!active) return;

      if (error || !data.user) {
        router.replace("/login");
        return;
      }

      const currentUser = data.user;
      setUser(currentUser);
      setName(
        currentUser.user_metadata?.display_name ||
          currentUser.email?.split("@")[0] || ""
      );

      const { data: promoRows, error: promosLoadError } = await supabase
        .from("user_promo_codes")
        .select("id, code, discount_percent, created_at, status, source")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (!active) return;
      if (promosLoadError) {
        setPromoError("Не удалось загрузить промокоды. Проверь SQL-настройку и политики доступа.");
      } else {
        setPromos(promoRows || []);
      }
      setLoading(false);
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, [router]);

  const displayName = useMemo(
    () => name || user?.email?.split("@")[0] || "Участник",
    [name, user]
  );

  async function saveName() {
    const cleanName = name.trim().replace(/\s+/g, " ");
    if (cleanName.length < 2 || cleanName.length > 30) {
      setNotice("Имя должно содержать от 2 до 30 символов.");
      return;
    }

    setSaving(true);
    setNotice("");
    const { data, error } = await supabase.auth.updateUser({
      data: { display_name: cleanName },
    });
    setSaving(false);

    if (error) {
      setNotice(error.message || "Не удалось сохранить имя.");
      return;
    }

    if (data.user) setUser(data.user);
    setName(cleanName);
    setEditing(false);
    setNotice("Имя профиля обновлено.");
  }

  async function copyPromo(code) {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      window.setTimeout(() => setCopiedCode(""), 1800);
    } catch {
      setNotice("Не удалось скопировать код. Выдели его вручную.");
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (loading) {
    return (
      <main className="profile-loading">
        <span className="profile-loading-mark">FAME<span>SKINS</span>.</span>
        <p>ЗАГРУЖАЕМ ТВОЙ ПРОФИЛЬ...</p>
      </main>
    );
  }

  if (!user) return null;

  const confirmed = Boolean(user.email_confirmed_at || user.confirmed_at);

  return (
    <main className="profile-page">
      <header className="profile-header">
        <a href="/" className="profile-brand">FAME<span>SKINS</span><i>.</i></a>
        <div className="profile-header-right">
          <a href="/" className="profile-back-link"><ArrowLeft size={15} /> НА ГЛАВНУЮ</a>
          <button className="profile-logout" onClick={logout}><LogOut size={15} /> ВЫЙТИ</button>
        </div>
      </header>

      <section className="profile-main">
        <div className="profile-intro">
          <div>
            <span className="profile-kicker"><span /> ACCOUNT / PERSONAL SPACE</span>
            <h1>МОЙ <span>ПРОФИЛЬ.</span></h1>
            <p>Твоё пространство в FAMESKINS. Данные аккаунта и все собранные награды — здесь.</p>
          </div>
          <div className="profile-intro-index">MEMBER AREA <strong>001</strong></div>
        </div>

        <div className="profile-layout">
          <section className="profile-card profile-identity-card">
            <div className="profile-card-topline"><span>01 / ACCOUNT</span><span>FAMESKINS MEMBER</span></div>
            <div className="profile-identity">
              <div className="profile-avatar">{displayName.slice(0, 1).toUpperCase()}</div>
              <div className="profile-identity-copy">
                <span className="profile-small-label">ТВОЙ НИКНЕЙМ</span>
                <h2>{displayName}</h2>
                <div className={confirmed ? "profile-status is-confirmed" : "profile-status"}>
                  {confirmed ? <BadgeCheck size={14} /> : <Mail size={14} />}
                  {confirmed ? "ПОЧТА ПОДТВЕРЖДЕНА" : "ПОЧТА НЕ ПОДТВЕРЖДЕНА"}
                </div>
              </div>
            </div>

            <div className="profile-divider" />
            <div className="profile-details">
              <div className="profile-detail-row">
                <span><Mail size={15} /> ЭЛЕКТРОННАЯ ПОЧТА</span>
                <strong>{user.email}</strong>
              </div>
              <div className="profile-detail-row">
                <span><CalendarDays size={15} /> С НАМИ С</span>
                <strong>{formatDate(user.created_at)}</strong>
              </div>
              <div className="profile-detail-row">
                <span><ShieldCheck size={15} /> СТАТУС АККАУНТА</span>
                <strong>{confirmed ? "Активен" : "Ожидает подтверждения"}</strong>
              </div>
            </div>
          </section>

          <section className="profile-card profile-edit-card">
            <div className="profile-card-topline"><span>02 / PERSONAL DATA</span><span>EDIT PROFILE</span></div>
            <div className="profile-section-heading">
              <div>
                <span className="profile-small-label">ПЕРСОНАЛИЗАЦИЯ</span>
                <h2>Имя профиля</h2>
              </div>
              {!editing && <button className="profile-edit-trigger" onClick={() => { setNotice(""); setEditing(true); }}><Edit3 size={15} /> ИЗМЕНИТЬ</button>}
            </div>

            {editing ? (
              <div className="profile-name-editor">
                <label htmlFor="display-name">ОТОБРАЖАЕМОЕ ИМЯ</label>
                <input id="display-name" value={name} maxLength={30} onChange={(event) => setName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") saveName(); }} />
                <div className="profile-editor-actions">
                  <button className="profile-save-button" onClick={saveName} disabled={saving}><Save size={15} /> {saving ? "СОХРАНЯЕМ..." : "СОХРАНИТЬ"}</button>
                  <button className="profile-cancel-button" onClick={() => { setName(user.user_metadata?.display_name || user.email?.split("@")[0] || ""); setEditing(false); }}><X size={15} /> ОТМЕНА</button>
                </div>
              </div>
            ) : (
              <div className="profile-name-value"><span>{displayName}</span><small>Это имя отображается в твоём личном кабинете.</small></div>
            )}
            {notice && <p className="profile-notice" role="status">{notice}</p>}
          </section>

          <section className="profile-card profile-promos-card" id="my-promocodes">
            <div className="profile-card-topline"><span>03 / REWARDS</span><span>{promos.length.toString().padStart(2, "0")} CODES</span></div>
            <div className="profile-section-heading">
              <div>
                <span className="profile-small-label">ТВОИ НАГРАДЫ</span>
                <h2>Мои промокоды<span>.</span></h2>
              </div>
              <div className="profile-promo-icon"><TicketPercent size={22} /></div>
            </div>

            {promoError ? (
              <div className="profile-empty-state"><Sparkles size={22} /><p>{promoError}</p></div>
            ) : promos.length === 0 ? (
              <div className="profile-empty-state"><TicketPercent size={25} /><strong>Пока пусто</strong><p>Прокрути колесо удачи на главной странице — первые награды появятся здесь.</p><a href="/#daily-wheel">К КОЛЕСУ УДАЧИ <ArrowLeft size={14} /></a></div>
            ) : (
              <div className="profile-promo-list">
                {promos.map((promo) => (
                  <article className="profile-promo-item" key={promo.id}>
                    <div className="profile-promo-percent">{promo.discount_percent}<span>%</span></div>
                    <div className="profile-promo-info">
                      <strong>{promo.code}</strong>
                      <span>СКИДКА · ПОЛУЧЕН {formatDate(promo.created_at).toUpperCase()}</span>
                      <em>{promo.status === "active" ? "АКТИВЕН" : promo.status}</em>
                    </div>
                    <button className="profile-copy-button" onClick={() => copyPromo(promo.code)} aria-label={`Скопировать ${promo.code}`}>
                      {copiedCode === promo.code ? <Check size={17} /> : <Copy size={17} />}
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="profile-card profile-shortcuts-card">
            <div className="profile-card-topline"><span>04 / COLLECTION</span><span>YOUR SPACE</span></div>
            <div className="profile-section-heading">
              <div>
                <span className="profile-small-label">ТВОЯ КОЛЛЕКЦИЯ</span>
                <h2>Быстрый доступ</h2>
              </div>
            </div>
            <a className="profile-shortcut" href="/#archive"><span><Sparkles size={17} /> Архив сетов</span><ArrowLeft size={15} /></a>
            <a className="profile-shortcut" href="/#players"><span><Heart size={17} /> Игроки CS2</span><ArrowLeft size={15} /></a>
          </section>
        </div>
        <footer className="profile-footer"><span>FAMESKINS / PERSONAL ACCOUNT</span><span>© 2026 FAMESKINS</span></footer>
      </section>
    </main>
  );
}
