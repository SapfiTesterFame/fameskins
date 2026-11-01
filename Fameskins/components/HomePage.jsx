
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Menu,
  X,
  LogIn,
} from "lucide-react";

import { sets } from "../data/sets";

const filters = [
  { value: "ALL", label: "Все коллекции" },
  { value: "RIFLES", label: "Винтовки" },
  { value: "KNIVES", label: "Ножи" },
  { value: "GLOVES", label: "Перчатки" },
];

const categoryLabels = {
  RIFLES: "ВИНТОВКИ",
  KNIVES: "НОЖИ",
  GLOVES: "ПЕРЧАТКИ",
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredSets =
    activeFilter === "ALL"
      ? sets
      : sets.filter((set) => set.category === activeFilter);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      {/* ШАПКА */}

      <header className="site-header" id="top">
        <Link href="/" className="brand" onClick={closeMenu}>
          FAME<span>SKINS</span>
          <i>.</i>
        </Link>

        <nav className={menuOpen ? "nav-links nav-open" : "nav-links"}>
          <a href="#archive" onClick={closeMenu}>
            КОЛЛЕКЦИИ
          </a>
          <a href="#players" onClick={closeMenu}>
            ИГРОКИ
          </a>
          <a href="#media" onClick={closeMenu}>
            МЕДИА
          </a>
          <a href="#about" onClick={closeMenu}>
            О ПРОЕКТЕ
          </a>
        </nav>

        <div className="header-actions">
          <a href="#archive" className="header-cta">
            К КОЛЛЕКЦИЯМ
            <ArrowUpRight size={15} />
          </a>

          <Link href="/login" className="header-login">
            <LogIn size={15} />
            ВОЙТИ
          </Link>
        </div>

        <button
          className="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={menuOpen}
          type="button"
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </header>

      {/* ПЕРВЫЙ ЭКРАН */}

      <section className="hero" id="home">
        <div className="hero-content">
          <motion.div
            className="eyebrow"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <span className="status-dot" />
            АРХИВ ПРОФЕССИОНАЛЬНОЙ СЦЕНЫ
            <span className="eyebrow-year">2026</span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.1 }}
          >
            ИГРА.
            <br />
            ЕЁ <span>ЛЕГЕНДЫ.</span>
          </motion.h1>

          <motion.p
            className="hero-description"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.2 }}
          >
            Коллекции скинов профессиональных игроков CS2.
            Изучай предметы, узнавай истории их появления
            на про-сцене и находи вдохновение в деталях.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.3 }}
          >
            <a href="#archive" className="button-primary">
              СМОТРЕТЬ КОЛЛЕКЦИИ
              <ArrowUpRight size={17} />
            </a>

            <a href="#about" className="button-text">
              О ПРОЕКТЕ
              <ArrowDownRight size={16} />
            </a>
          </motion.div>

          <motion.div
            className="hero-bottom-info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <span>COUNTER-STRIKE 2</span>
            <span>ПРЕДМЕТЫ / ИГРОКИ / ИСТОРИЯ</span>
          </motion.div>
        </div>

        {/* ВИЗУАЛЬНЫЙ БЛОК */}

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="hero-visual-top">
            <span>01 / АРХИВ</span>
            <span>ПРЕДПРОСМОТР</span>
          </div>

          <div className="hero-art">
            <div className="art-grid" />
            <div className="art-glow" />
            <div className="art-ring ring-one" />
            <div className="art-ring ring-two" />

            <div className="weapon-visual">
              <span className="weapon-stock" />
              <span className="weapon-body" />
              <span className="weapon-barrel" />
              <span className="weapon-grip" />
              <span className="weapon-detail" />
            </div>

            <div className="art-watermark">FS</div>

            <span className="art-index">ЭКСПОНАТ 001</span>
            <span className="art-coordinate">FAMESKINS / 2026</span>
          </div>

          <div className="hero-visual-bottom">
            <div>
              <span className="mini-label">КОЛЛЕКЦИЯ FAMESKINS</span>
              <h3>БОЛЬШЕ, ЧЕМ ИГРА.</h3>
            </div>

            <div className="visual-arrow">
              <ArrowDownRight size={23} />
            </div>
          </div>
        </motion.div>
      </section>

      {/* БЕГУЩАЯ СТРОКА */}

      <div className="marquee">
        <div className="marquee-track">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="marquee-content" key={index}>
              <span>КОЛЛЕКЦИИ ПРО-ИГРОКОВ</span>
              <i>✳</i>
              <span>КУЛЬТУРА CS2</span>
              <i>✳</i>
              <span>ИСТОРИЯ КИБЕРСПОРТА</span>
              <i>✳</i>
            </div>
          ))}
        </div>
      </div>

      {/* КОЛЛЕКЦИИ */}

      <section className="archive-section section-wrap" id="archive">
        <motion.div
          className="section-heading"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <div>
            <span className="section-kicker">01 — КОЛЛЕКЦИЯ</span>
            <h2>
              НАШ <span>АРХИВ.</span>
            </h2>
          </div>

          <p>
            Не просто скины.
            <br />
            Часть истории профессиональной сцены.
          </p>
        </motion.div>

        <div className="archive-toolbar">
          <span className="toolbar-label">ВЫБЕРИ КАТЕГОРИЮ</span>

          <div className="filter-list">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={
                  activeFilter === filter.value
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() => setActiveFilter(filter.value)}
                aria-pressed={activeFilter === filter.value}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="sets-grid">
          <AnimatePresence mode="popLayout">
            {filteredSets.map((set, index) => (
              <motion.article
                layout
                key={set.id}
                className="set-card"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
              >
                <div className="set-card-link">
                  <div className={`set-art ${set.visual}`}>
                    <div className="set-art-grid" />
                    <div className="set-art-orbit" />

                    <div className="set-art-object">
                      <span>{set.code}</span>
                    </div>

                    <span className="set-art-type">
                      {categoryLabels[set.category] || set.category}
                    </span>

                    <span className="set-art-status">{set.status}</span>
                  </div>

                  <div className="set-info">
                    <div>
                      <span className="set-number">
                        КОЛЛЕКЦИЯ / {set.code}
                      </span>

                      <h3>{set.name}</h3>

                      <p>{set.description}</p>
                    </div>

                    <div className="set-card-arrow" aria-hidden="true">
                      <ArrowUpRight size={19} />
                    </div>
                  </div>

                  <div className="set-card-footer">
                    <span>{set.items}</span>
                    <span>СКОРО</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="archive-bottom">
          <span>КОЛЛЕКЦИЙ ПОКАЗАНО: {filteredSets.length}</span>
          <span>НОВЫЕ КОЛЛЕКЦИИ БУДУТ ДОБАВЛЯТЬСЯ</span>
        </div>
      </section>

      {/* МЕДИА */}

      <section className="media-section" id="media">
        <div className="media-inner section-wrap">
          <motion.div
            className="media-heading"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="section-kicker">02 — ЗА КАДРОМ</span>

            <h2>
              НЕ ТОЛЬКО
              <br />
              <span>ВНЕШНИЙ ВИД.</span>
            </h2>

            <p>
              За каждой известной коллекцией стоит своя история:
              игрок, матч и момент, который запомнили зрители.
              Здесь мы собираем всё воедино.
            </p>

            <a href="#players" className="button-outline">
              ИСТОРИИ ИГРОКОВ
              <ArrowUpRight size={16} />
            </a>
          </motion.div>

          <motion.div
            className="media-player"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="media-player-top">
              <span>FAMESKINS / МЕДИААРХИВ</span>
              <span>РАЗДЕЛ 001</span>
            </div>

            <div className="media-screen">
              <div className="media-screen-grid" />
              <div className="media-light" />

              <div className="media-placeholder">
                <span>ИСТОРИЯ КАЖДОГО ПРЕДМЕТА</span>
                <strong>ВАЖЕН КАЖДЫЙ МОМЕНТ.</strong>
              </div>

              <span className="media-screen-label">
                ВИДЕО И МАТЕРИАЛЫ ПОЯВЯТСЯ ПОЗЖЕ
              </span>
            </div>

            <div className="media-player-bottom">
              <span>CS2 / ПРОФЕССИОНАЛЬНАЯ СЦЕНА</span>
              <span>МЕДИААРХИВ</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ИГРОКИ */}

      <section className="players-section section-wrap" id="players">
        <motion.div
          className="players-content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <span className="section-kicker">03 — ЛЮДИ</span>

          <h2>
            ЗА НИМИ
            <br />
            <span>СТОЯТ ЛЕГЕНДЫ.</span>
          </h2>

          <p>
            За каждым узнаваемым сетом стоит игрок.
            Мы связываем предметы с профессионалами,
            матчами и турнирами, на которых они появлялись.
          </p>

          <div className="players-index">
            <div>
              <span>01</span>
              <strong>ПРОФИЛИ ИГРОКОВ</strong>
              <span>ИГРОКИ</span>
            </div>

            <div>
              <span>02</span>
              <strong>ИСТОРИЯ МАТЧЕЙ</strong>
              <span>ТУРНИРЫ</span>
            </div>

            <div>
              <span>03</span>
              <strong>ЗНАКОВЫЕ КОЛЛЕКЦИИ</strong>
              <span>ПРЕДМЕТЫ</span>
            </div>
          </div>
        </motion.div>

        <div className="players-visual">
          <div className="player-monogram">PRO</div>
          <div className="player-orbit player-orbit-one" />
          <div className="player-orbit player-orbit-two" />
          <span className="player-visual-label">ИСТОРИЯ ПРО-СЦЕНЫ</span>
          <span className="player-visual-number">03 / 03</span>
        </div>
      </section>

      {/* О ПРОЕКТЕ */}

      <section className="about-section" id="about">
        <div className="section-wrap about-inner">
          <span className="section-kicker">04 — НАША ИДЕЯ</span>

          <h2>
            НЕКОТОРЫЕ СКИНЫ —
            <br />
            <span>БОЛЬШЕ, ЧЕМ СКИНЫ.</span>
          </h2>

          <div className="about-bottom">
            <p>
              FAMESKINS — цифровой архив, посвящённый визуальной
              культуре профессионального Counter-Strike.
              Предметы, игроки и моменты, которые оставили
              свой след в истории киберспорта.
            </p>

            <a href="#top" className="back-to-top">
              НАВЕРХ
              <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
      </section>

      {/* ПОДВАЛ */}

      <footer className="site-footer">
        <Link href="/" className="footer-brand">
          FAME<span>SKINS</span>.
        </Link>

        <span>НЕЗАВИСИМЫЙ АРХИВ КУЛЬТУРЫ CS2</span>
        <span>© 2026 FAMESKINS</span>
      </footer>
    </main>
  );
}
