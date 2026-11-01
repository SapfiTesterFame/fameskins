
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Menu,
  X,
  Play,
} from "lucide-react";

import { sets } from "../data/sets";
import DailyWheel from "./DailyWheel";
import { supabase } from "../lib/supabase";

const filters = ["ALL", "RIFLES", "KNIVES", "GLOVES"];

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Проверяем авторизацию и отслеживаем вход/выход
  useEffect(() => {
    let mounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
      }
    });

    async function loadUser() {
      const { data, error } = await supabase.auth.getSession();

      if (mounted && !error) {
        setUser(data.session?.user ?? null);
      }
    }

    loadUser();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const filteredSets =
    activeFilter === "ALL"
      ? sets
      : sets.filter((set) => set.category === activeFilter);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      {/* NAVIGATION */}

      <header className="site-header">
        <a href="#top" className="brand" onClick={closeMenu}>
          FAME<span>SKINS</span>
          <i>.</i>
        </a>

        <nav className={menuOpen ? "nav-links nav-open" : "nav-links"}>
          <a href="#archive" onClick={closeMenu}>ARCHIVE</a>
          <a href="#players" onClick={closeMenu}>PLAYERS</a>
          <a href="#media" onClick={closeMenu}>MEDIA</a>
          <a href="#about" onClick={closeMenu}>ABOUT</a>
        </nav>

        <div className="header-actions">
          <a href="#archive" className="header-cta">
            EXPLORE ARCHIVE
            <ArrowUpRight size={15} />
          </a>

          <a
            href={user ? "/profile" : "/login"}
            className="header-login"
            onClick={closeMenu}
          >
            {user ? "PROFILE" : "LOG IN"}
            <span>↗</span>
          </a>
        </div>

        <button
          className="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </header>

      {/* HERO */}

      <section className="hero" id="top">
        <div className="hero-noise" />

        <div className="hero-content">
          <motion.div
            className="eyebrow"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <span className="status-dot" />
            THE PRO SCENE ARCHIVE
            <span className="eyebrow-year">EST. 2026</span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.12 }}
          >
            THE GAME
            <br />
            HAS ITS <span>ICONS.</span>
          </motion.h1>

          <motion.p
            className="hero-description"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.23 }}
          >
            Explore the loadouts behind the legends.
            Discover iconic CS2 skins, professional players
            and the moments that made them unforgettable.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.34 }}
          >
            <a href="#archive" className="button-primary">
              DISCOVER THE ARCHIVE
              <ArrowUpRight size={17} />
            </a>

            <a href="#about" className="button-text">
              OUR CONCEPT
              <ArrowDownRight size={16} />
            </a>
          </motion.div>

          <motion.div
            className="hero-bottom-info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
          >
            <span>COUNTER-STRIKE 2</span>
            <span>LOADOUTS / PLAYERS / HISTORY</span>
          </motion.div>
        </div>

        {/* HERO VISUAL */}

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, x: 45, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.25 }}
        >
          <div className="hero-visual-top">
            <span>01 / VISUAL ARCHIVE</span>
            <span>PREVIEW MODULE</span>
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

            <span className="art-index">FIG. 001</span>
            <span className="art-coordinate">48° / 02° / 26</span>
          </div>

          <div className="hero-visual-bottom">
            <div>
              <span className="mini-label">THE COLLECTION</span>
              <h3>BEYOND THE GAME.</h3>
            </div>

            <div className="visual-arrow">
              <ArrowDownRight size={23} />
            </div>
          </div>
        </motion.div>

        <div className="hero-side-label">FAMESKINS / VOL. 001</div>
      </section>

      {/* MARQUEE */}

      <div className="marquee">
        <div className="marquee-track">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="marquee-content" key={index}>
              <span>PRO PLAYER LOADOUTS</span>
              <i>✳</i>
              <span>ESPORTS CULTURE</span>
              <i>✳</i>
              <span>ICONIC MOMENTS</span>
              <i>✳</i>
            </div>
          ))}
        </div>
      </div>

      {/* DAILY REWARDS WHEEL */}

      <DailyWheel />

      {/* ARCHIVE */}

      <section className="archive-section section-wrap" id="archive">
        <motion.div
          className="section-heading"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <div>
            <span className="section-kicker">01 — THE COLLECTION</span>
            <h2>
              THE <span>ARCHIVE.</span>
            </h2>
          </div>

          <p>
            Not just skins.
            <br />
            A part of competitive history.
          </p>
        </motion.div>

        <div className="archive-toolbar">
          <span className="toolbar-label">BROWSE BY CATEGORY</span>

          <div className="filter-list">
            {filters.map((filter) => (
              <button
                key={filter}
                className={
                  activeFilter === filter
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
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
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
              >
                <a className="set-card-link" href="#media">
                  <div className={`set-art ${set.visual}`}>
                    <div className="set-art-grid" />
                    <div className="set-art-orbit" />

                    <div className="set-art-object">
                      <span>{set.code}</span>
                    </div>

                    <span className="set-art-type">
                      {set.category}
                    </span>

                    <span className="set-art-status">
                      {set.status}
                    </span>
                  </div>

                  <div className="set-info">
                    <div>
                      <span className="set-number">
                        ENTRY / {set.code}
                      </span>
                      <h3>{set.name}</h3>
                      <p>{set.description}</p>
                    </div>

                    <div className="set-card-arrow">
                      <ArrowUpRight size={19} />
                    </div>
                  </div>

                  <div className="set-card-footer">
                    <span>{set.items}</span>
                    <span>EXPLORE ENTRY ↗</span>
                  </div>
                </a>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="archive-bottom">
          <span>SHOWING {filteredSets.length} DESIGN ENTRIES</span>
          <span>MORE STORIES TO COME</span>
        </div>
      </section>

      {/* MEDIA */}

      <section className="media-section" id="media">
        <div className="media-inner section-wrap">
          <motion.div
            className="media-heading"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="section-kicker">02 — BEHIND THE MOMENT</span>
            <h2>
              NOT JUST
              <br />
              <span>THE LOOK.</span>
            </h2>

            <p>
              Every legendary loadout has a story.
              The match, the player, the moment.
              Experience it beyond a static screenshot.
            </p>

            <a href="#players" className="button-outline">
              DISCOVER THE STORIES
              <ArrowUpRight size={16} />
            </a>
          </motion.div>

          <motion.div
            className="media-player"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="media-player-top">
              <span>FAMESKINS / MEDIA ARCHIVE</span>
              <span>VIDEO MODULE 001</span>
            </div>

            <div className="media-screen">
              <div className="media-screen-grid" />
              <div className="media-light" />

              <div className="media-placeholder">
                <span>THE MOMENT</span>
                <strong>IS EVERYTHING.</strong>
                <div className="media-play">
                  <Play size={19} fill="currentColor" />
                </div>
              </div>

              <span className="media-screen-label">
                GAMEPLAY FOOTAGE / COMING SOON
              </span>
            </div>

            <div className="media-player-bottom">
              <span>CS2 / COMPETITIVE ARCHIVE</span>
              <span>MEDIA SLOT 001</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PLAYERS */}

      <section className="players-section section-wrap" id="players">
        <motion.div
          className="players-content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <span className="section-kicker">03 — THE PEOPLE</span>
          <h2>
            MADE BY
            <br />
            <span>LEGENDS.</span>
          </h2>

          <p>
            Behind every iconic set is a player.
            We connect the skins, the people and the
            moments from the professional stage.
          </p>

          <div className="players-index">
            <div>
              <span>01</span>
              <strong>PLAYER PROFILES</strong>
              <span>PLAYER ARCHIVE</span>
            </div>

            <div>
              <span>02</span>
              <strong>MATCH HISTORY</strong>
              <span>EVENT REFERENCES</span>
            </div>

            <div>
              <span>03</span>
              <strong>ICONIC LOADOUTS</strong>
              <span>SET COLLECTIONS</span>
            </div>
          </div>
        </motion.div>

        <div className="players-visual">
          <div className="player-monogram">PRO</div>
          <div className="player-orbit player-orbit-one" />
          <div className="player-orbit player-orbit-two" />
          <span className="player-visual-label">THE STAGE IS YOURS.</span>
          <span className="player-visual-number">03 / 03</span>
        </div>
      </section>

      {/* ABOUT */}

      <section className="about-section" id="about">
        <div className="section-wrap about-inner">
          <span className="section-kicker">04 — OUR PHILOSOPHY</span>

          <h2>
            SOME SKINS ARE
            <br />
            <span>MORE THAN SKINS.</span>
          </h2>

          <div className="about-bottom">
            <p>
              FAMESKINS is a digital archive celebrating the
              visual identity of competitive Counter-Strike.
              The equipment, the players and the moments
              that define esports culture.
            </p>

            <a href="#top" className="back-to-top">
              BACK TO TOP
              <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="site-footer">
        <a href="#top" className="footer-brand">
          FAME<span>SKINS</span>.
        </a>

        <span>INDEPENDENT CS2 CULTURE ARCHIVE</span>
        <span>© 2026 FAMESKINS</span>
      </footer>
    </main>
  );
}
