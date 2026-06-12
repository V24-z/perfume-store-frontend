import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const NAV = {
  Learn: [
    { label: "Perfume Guide", to: "/learn/guide" },
    { label: "Fragrance Notes", to: "/learn/notes" },
    { label: "How to Choose", to: "/learn/choose" },
    { label: "Care Tips", to: "/learn/care" },
    { label: "Blog", to: "/blog" },
  ],
  About: [
    { label: "Our Story", to: "/about" },
    { label: "Ingredients", to: "/about/ingredients" },
    { label: "Sustainability", to: "/about/sustainability" },
  ],
  Support: [
    { label: "Contact Us", to: "/contact" },
    { label: "FAQs", to: "/faq" },
    { label: "Shipping & Returns", to: "/shipping" },
  ],
};

const SOCIALS = [
  { label: "IG", name: "Instagram" },
  { label: "FB", name: "Facebook" },
  { label: "PT", name: "Pinterest" },
  { label: "TW", name: "Twitter" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  function handleJoin(e) {
    e.preventDefault();
    if (email.trim()) setJoined(true);
  }

  return (
    <footer className={styles.footer}>

      {/* Gold shimmer line */}
      <div className={styles.shimmer} />

      <div className={styles.inner}>

        {/* ── Main grid ── */}
        <div className={styles.grid}>

          {/* Brand */}
          <div>
            <Link to="/" className={styles.brandLink}>
              <div className={styles.logoBox}>
                <span className={styles.logoIcon}>◈</span>
              </div>
              <div>
                <p className={styles.brandName}>LUMIÈRE</p>
                <p className={styles.brandSub}>PARFUM</p>
              </div>
            </Link>

            <p className={styles.tagline}>
              Crafting timeless fragrances that tell your story. Every bottle, a memory.
            </p>

            <div className={styles.socials}>
              {SOCIALS.map(({ label, name }) => (
                <a key={name} href="#" aria-label={name} className={styles.socialBtn}>
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Learn */}
          <div>
            <p className={styles.colHeading}>Learn</p>
            <ul className={styles.navList}>
              {NAV.Learn.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className={styles.navLink}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About + Support */}
          <div>
            <p className={styles.colHeading}>About</p>
            <ul className={styles.navList}>
              {NAV.About.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className={styles.navLink}>{label}</Link>
                </li>
              ))}
            </ul>

            <p className={styles.colHeading} style={{ marginTop: 28 }}>Support</p>
            <ul className={styles.navList}>
              {NAV.Support.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className={styles.navLink}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className={styles.colHeading}>Newsletter</p>
            <p className={styles.newsletterDesc}>
              Early access to new arrivals and exclusive offers.
            </p>

            {joined ? (
              <div className={styles.successBox}>✦ You're on the list.</div>
            ) : (
              <form onSubmit={handleJoin} className={styles.form}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={styles.emailInput}
                />
                <button type="submit" className={styles.joinBtn}>
                  Join
                </button>
                <p className={styles.spamNote}>No spam. Unsubscribe anytime.</p>
              </form>
            )}
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © 2026 Lumière Parfum. All rights reserved.
          </p>
          <div className={styles.legalLinks}>
            {[
              { label: "Privacy Policy", to: "/privacy" },
              { label: "Terms of Use", to: "/terms" },
            ].map(({ label, to }) => (
              <Link key={label} to={to} className={styles.legalLink}>
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}