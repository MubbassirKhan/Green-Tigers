import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Phone, Mail, MapPin, ArrowRight } from "lucide-react";

const CATEGORIES = [
  { label: "Clothing", slug: "clothing" },
  { label: "Sports", slug: "sports" },
  { label: "Home & Kitchen", slug: "home-kitchen" },
  { label: "Beauty", slug: "beauty" },
  { label: "Electronics", slug: "electronics" },
  { label: "Books", slug: "books" },
];

const ACCOUNT_LINKS = [
  { label: "Login", to: "/login" },
  { label: "Register", to: "/register" },
  { label: "My Orders", to: "/orders" },
  { label: "My Profile", to: "/profile" },
  { label: "Cart", to: "/shop" },
];

const Footer = () => (
  <footer
    className="mt-24 relative overflow-hidden"
    style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
  >
    {/* Ambient background */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(233,69,96,0.07) 0%, transparent 70%), rgba(0,0,0,0.45)",
      }}
    />

    <div className="relative z-10 container py-16 lg:py-20">
      <div className="footer-grid">
        {/* ── Brand ─────────────────── */}
        <div>
          <Link to="/" className="inline-flex items-center gap-2.5 mb-5 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.08 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #e94560, #feca57)",
              }}
            >
              <Zap size={20} color="white" fill="white" />
            </motion.div>
            <div>
              <p
                className="font-black text-lg gradient-text leading-tight"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Green tigers
              </p>
              <p className="text-xs text-white/30 tracking-widest uppercase">
                Shop Smart
              </p>
            </div>
          </Link>

          <p className="text-sm text-white/45 leading-relaxed mb-6 max-w-xs">
            Your one-stop online store for Clothing, Sports, Home &amp; Kitchen,
            Beauty, Electronics &amp; Books. Quality products, express delivery.
          </p>

          {/* Social icons */}
          <div className="flex gap-2.5">
            {[
              // { Icon: Twitter,   href: '#', label: 'Twitter' },
              // { Icon: Instagram, href: '#', label: 'Instagram' },
            ].map(({ Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                whileHover={{ scale: 1.12, y: -2 }}
                whileTap={{ scale: 0.92 }}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white/45 hover:text-white transition-colors"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <Icon size={15} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* ── Categories ──────────────── */}
        <div>
          <h4
            className="font-bold text-sm text-white mb-5 uppercase tracking-widest"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Categories
          </h4>
          <ul className="space-y-2.5">
            {CATEGORIES.map((item) => (
              <li key={item.label}>
                <Link
                  to={`/shop?category_slug=${item.slug}`}
                  className="text-sm text-white/45 hover:text-red-400 transition-colors flex items-center gap-1.5 group"
                >
                  <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-red-400 transition-colors" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Account ─────────────────── */}
        <div>
          <h4
            className="font-bold text-sm text-white mb-5 uppercase tracking-widest"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Account
          </h4>
          <ul className="space-y-2.5">
            {ACCOUNT_LINKS.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="text-sm text-white/45 hover:text-red-400 transition-colors flex items-center gap-1.5 group"
                >
                  <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-red-400 transition-colors" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Contact ─────────────────── */}
        <div>
          <h4
            className="font-bold text-sm text-white mb-5 uppercase tracking-widest"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Contact
          </h4>
          <ul className="space-y-3.5">
            {[
              { Icon: MapPin, text: "123 Commerce Street, Karachi" },
              { Icon: Phone, text: "+92 300 1234567" },
              { Icon: Mail, text: "hello@greentigers.pk" },
            ].map(({ Icon, text }) => (
              <li
                key={text}
                className="flex items-start gap-3 text-sm text-white/45"
              >
                <Icon size={14} className="text-red-400 shrink-0 mt-0.5" />
                {text}
              </li>
            ))}
          </ul>

          {/* Newsletter mini */}
          <div className="mt-6">
            <p className="text-xs text-white/35 mb-2 font-medium uppercase tracking-widest">
              Newsletter
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="input-field text-xs py-2.5 px-3 flex-1 min-w-0"
                style={{ borderRadius: "10px" }}
              />
              <button
                className="px-3 py-2.5 rounded-xl flex-shrink-0 transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #e94560, #c0392b)",
                }}
                aria-label="Subscribe"
              >
                <ArrowRight size={14} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="mt-14 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <p className="text-xs text-white/25 text-center sm:text-left">
          © {new Date().getFullYear()} Green tigers. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          {["Privacy Policy", "Terms of Service", "Support"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-xs text-white/25 hover:text-white/60 transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
        <p className="text-xs text-white/25">
          🛍️ Shop smart, shop Green tigers.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
