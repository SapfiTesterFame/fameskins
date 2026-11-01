
import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";

export const metadata = {
  title: "Вход — FAMESKINS",
  description: "Личный кабинет FAMESKINS",
};

export default function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-card">
        <Link href="/" className="login-back">
          <ArrowLeft size={16} />
          НА ГЛАВНУЮ
        </Link>

        <Link href="/" className="login-brand">
          FAME<span>SKINS</span>.
        </Link>

        <div className="login-icon">
          <LockKeyhole size={23} />
        </div>

        <span className="login-kicker">ЛИЧНЫЙ КАБИНЕТ</span>

        <h1>
          ДОБРО
          <br />
          ПОЖАЛОВАТЬ.
        </h1>

        <p className="login-description">
          Вход в аккаунт FAMESKINS появится после подключения
          системы пользователей. Мы готовим личный кабинет,
          в котором будут доступны ваши настройки и сохранённые
          коллекции.
        </p>

        <div className="login-status">
          <span className="status-dot" />
          АВТОРИЗАЦИЯ ГОТОВИТСЯ К ЗАПУСКУ
        </div>

        <Link href="/" className="login-home-button">
          ВЕРНУТЬСЯ НА САЙТ
          <ArrowLeft size={16} />
        </Link>

        <span className="login-footer">FAMESKINS / 2026</span>
      </div>
    </main>
  );
}
