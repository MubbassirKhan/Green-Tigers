import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Zap, Shirt, Dumbbell, Home, Sparkles, Cpu, BookOpen,
  ShieldCheck, Truck, RefreshCw, Star, TrendingUp, Award, Users
} from 'lucide-react';
import api from '../api/client';
import ProductCard from '../components/shop/ProductCard';

const CATEGORY_CONFIG = {
  clothing:       { icon: Shirt,    color: '#e94560', bg: 'rgba(233,69,96,0.12)' },
  sports:         { icon: Dumbbell, color: '#feca57', bg: 'rgba(254,202,87,0.12)' },
  'home-kitchen': { icon: Home,     color: '#667eea', bg: 'rgba(102,126,234,0.12)' },
  beauty:         { icon: Sparkles, color: '#ff6b6b', bg: 'rgba(255,107,107,0.12)' },
  electronics:    { icon: Cpu,      color: '#48dbfb', bg: 'rgba(72,219,251,0.12)' },
  books:          { icon: BookOpen, color: '#ff9f43', bg: 'rgba(255,159,67,0.12)' },
};

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.08 } } },
  item: {
    hidden: { opacity: 0, y: 24 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  },
};

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 24 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const inView = (delay = 0) => ({
  initial:    { opacity: 0, y: 24 },
  whileInView:{ opacity: 1, y: 0 },
  viewport:   { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ═══════════════════════════════════════════════════════════ */

const HomePage = () => {
  const [featured, setFeatured]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products/?featured=true&limit=8'),
          api.get('/categories/'),
        ]);
        setFeatured(prodRes.data);
        setCategories(catRes.data);
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  const HERO_IMAGES = [
    { src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=360&q=80', label: 'Sports' },
    { src: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=360&q=80', label: 'Clothing' },
    { src: 'https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?w=360&q=80', label: 'Electronics' },
    { src: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=360&q=80', label: 'Books' },
  ];

  const WHY_US = [
    { icon: Award,       title: 'Top Brands',       desc: 'Authentic products from 500+ verified brands.',    color: '#feca57' },
    { icon: Truck,       title: 'Express Delivery',  desc: 'Same-day & next-day delivery across the city.',    color: '#e94560' },
    { icon: ShieldCheck, title: '100% Authentic',    desc: 'Every product verified before dispatch.',           color: '#48dbfb' },
    { icon: RefreshCw,   title: 'Easy Returns',      desc: '14-day hassle-free returns on all orders.',        color: '#ff9f43' },
  ];

  const STATS = [
    { icon: TrendingUp, value: '10,000+', label: 'Products' },
    { icon: Users,      value: '50K+',    label: 'Customers' },
    { icon: Star,       value: '4.8★',   label: 'Avg Rating' },
  ];

  const DEFAULT_CATS = [
    { name: 'Clothing',     slug: 'clothing' },
    { name: 'Sports',       slug: 'sports' },
    { name: 'Home & Kitchen', slug: 'home-kitchen' },
    { name: 'Beauty',       slug: 'beauty' },
    { name: 'Electronics',  slug: 'electronics' },
    { name: 'Books',        slug: 'books' },
  ];

  return (
    <div className="min-h-screen">

      {/* ════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════ */}
      <section className="relative flex items-center overflow-hidden hero-section">
        {/* Layered background */}
        <div className="absolute inset-0 -z-10"
          style={{
            background: [
              'radial-gradient(ellipse 70% 60% at 65% 40%, rgba(233,69,96,0.2) 0%, transparent 60%)',
              'radial-gradient(ellipse 50% 50% at 20% 70%, rgba(162,155,254,0.1) 0%, transparent 55%)',
              'radial-gradient(ellipse 40% 40% at 80% 80%, rgba(254,202,87,0.07) 0%, transparent 50%)',
            ].join(', '),
          }}
        />

        {/* Animated blobs */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl pointer-events-none -z-10"
            style={{
              width: `${180 + i * 80}px`,
              height: `${180 + i * 80}px`,
              background: i % 2 === 0 ? 'rgba(233,69,96,0.12)' : 'rgba(162,155,254,0.08)',
              top:  `${10 + i * 20}%`,
              left: `${-5 + i * 22}%`,
            }}
            animate={{ scale: [1, 1.2, 1], x: [0, 25, 0], y: [0, -15, 0] }}
            transition={{ duration: 8 + i * 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        <div className="container">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center py-12 lg:py-0" style={{ minHeight: 'calc(100svh - 5rem)' }}>

            {/* Left: Text */}
            <motion.div {...fadeUp(0)} className="flex flex-col">
              {/* Pill badge */}
              <motion.div
                {...fadeUp(0.15)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-6 self-start"
                style={{
                  background: 'rgba(233,69,96,0.12)',
                  border: '1px solid rgba(233,69,96,0.28)',
                  color: '#e94560',
                }}
              >
                <Zap size={13} />
                Pakistan's Fastest Growing Online Store
              </motion.div>

              <motion.h1
                {...fadeUp(0.2)}
                className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black leading-[1.05] mb-5"
                style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.03em' }}
              >
                Shop Smarter,<br />
                <span className="gradient-text">Live Better</span>
              </motion.h1>

              <motion.p {...fadeUp(0.3)} className="text-base sm:text-lg text-white/55 mb-8 max-w-md leading-relaxed">
                Discover thousands of products across Clothing, Electronics, Sports, Beauty,
                Home &amp; Kitchen, and Books — all in one place.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div {...fadeUp(0.4)} className="flex flex-wrap gap-3 mb-10">
                <Link to="/shop" className="btn-gold text-sm sm:text-base px-6 sm:px-8 py-3 font-bold">
                  Shop Now <ArrowRight size={16} />
                </Link>
                <Link to="/shop?featured=true" className="btn-outline text-sm sm:text-base px-6 sm:px-8 py-3">
                  Featured Deals
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div {...fadeUp(0.5)} className="grid grid-cols-3 gap-4 sm:gap-6">
                {STATS.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="text-center sm:text-left">
                    <p className="text-xl sm:text-2xl font-black gradient-text mb-0.5"
                      style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {value}
                    </p>
                    <p className="text-xs text-white/40 font-medium">{label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Hero grid (desktop only) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:grid grid-cols-2 gap-4"
            >
              {HERO_IMAGES.map((item, i) => (
                <motion.div
                  key={i}
                  className="relative rounded-2xl overflow-hidden group"
                  style={{
                    height: i % 2 === 0 ? 210 : 170,
                    border: '1px solid rgba(255,255,255,0.09)',
                    marginTop: i % 2 !== 0 ? '1.5rem' : 0,
                  }}
                  whileHover={{ scale: 1.03 }}
                  animate={{ y: [0, i % 2 === 0 ? -8 : 6, 0] }}
                  transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
                >
                  <img
                    src={item.src}
                    alt={item.label}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(8,7,20,0.75) 0%, rgba(8,7,20,0.1) 50%, transparent 100%)' }}
                  />
                  <span className="absolute bottom-3 left-3 text-xs font-bold text-white bg-white/10 backdrop-blur px-2.5 py-1 rounded-full">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full flex items-start justify-center pt-2"
            style={{ border: '2px solid rgba(255,255,255,0.2)' }}>
            <motion.div
              className="w-1.5 h-2.5 rounded-full"
              style={{ background: '#e94560' }}
              animate={{ y: [0, 6, 0], opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════
          CATEGORIES
      ════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <motion.div {...inView()} className="text-center mb-12">
            <span className="section-label">
              <Sparkles size={13} /> Browse By Category
            </span>
            <h2 className="section-title">What Are You Shopping For?</h2>
            <p className="section-sub mx-auto">
              Explore our curated range of products across all major categories.
            </p>
          </motion.div>

          <motion.div
            variants={stagger.container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="category-grid"
          >
            {(categories.length > 0 ? categories : DEFAULT_CATS).map((cat) => {
              const cfg  = CATEGORY_CONFIG[cat.slug] || CATEGORY_CONFIG.clothing;
              const Icon = cfg.icon;
              return (
                <motion.div key={cat.name} variants={stagger.item}>
                  <Link
                    to={`/shop?category_slug=${cat.slug}`}
                    className="flex flex-col items-center gap-3 glass rounded-2xl p-4 sm:p-5 text-center card-hover group"
                    style={{ borderColor: `${cfg.color}28` }}
                  >
                    <motion.div
                      whileHover={{ rotate: 8, scale: 1.12 }}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-300"
                      style={{ background: cfg.bg }}
                    >
                      <Icon size={22} style={{ color: cfg.color }} />
                    </motion.div>
                    <p className="font-bold text-white text-xs sm:text-sm leading-tight"
                      style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {cat.name}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FEATURED PRODUCTS
      ════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'rgba(0,0,0,0.22)', backdropFilter: 'blur(0px)' }}
        />
        <div className="container relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <motion.div {...inView()}>
              <span className="section-label"><TrendingUp size={13} /> Best Sellers</span>
              <h2 className="section-title">
                Featured <span className="gradient-text">Deals</span>
              </h2>
            </motion.div>
            <motion.div {...inView(0.1)}>
              <Link to="/shop" className="btn-outline text-sm py-2 px-5 self-start sm:self-auto">
                View All <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>

          {loading ? (
            <div className="product-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton rounded-2xl h-72" />
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="product-grid">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-5xl mb-5">🛍️</p>
              <p className="text-white/40 text-lg font-medium">No featured products yet.</p>
              <p className="text-white/25 text-sm mt-2">Add products via the admin panel.</p>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          WHY GREEN TIGER
      ════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <motion.div {...inView()} className="text-center mb-14">
            <span className="section-label"><Star size={13} /> Our Promise</span>
            <h2 className="section-title">
              Why <span className="gradient-text">Green Tiger?</span>
            </h2>
          </motion.div>

          <div className="info-grid">
            {WHY_US.map((f, i) => (
              <motion.div
                key={f.title}
                {...inView(i * 0.1)}
                className="glass-card p-6 sm:p-7 flex flex-col items-center text-center card-hover group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform"
                  style={{ background: `${f.color}1a` }}
                >
                  <f.icon size={26} style={{ color: f.color }} />
                </motion.div>
                <h3 className="font-bold text-white mb-2 text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {f.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CTA BANNER
      ════════════════════════════════════════════ */}
      <section className="py-16 px-4">
        <motion.div
          {...inView()}
          className="max-w-4xl mx-auto rounded-3xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #e94560 0%, #7c3aed 50%, #feca57 100%)',
            backgroundSize: '200% 200%',
          }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-black/10 pointer-events-none" />

          <div className="relative z-10 text-center px-6 py-14 sm:py-16 sm:px-12">
            <motion.h2
              {...inView(0.1)}
              className="text-3xl sm:text-4xl font-black text-white mb-4"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Start Shopping Today! 🛍️
            </motion.h2>
            <motion.p {...inView(0.2)} className="text-white/80 mb-8 max-w-md mx-auto text-sm sm:text-base">
              Join 50,000+ happy customers. Register now and get access to exclusive deals.
            </motion.p>
            <motion.div {...inView(0.3)} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/register"
                className="btn-gold px-8 py-3.5 font-bold text-sm sm:text-base justify-center"
                style={{ background: '#feca57', color: '#0e0c20' }}
              >
                Create Free Account
              </Link>
              <Link
                to="/shop"
                className="px-8 py-3.5 font-bold text-sm sm:text-base rounded-[10px] border-2 border-white/40 text-white hover:bg-white/15 transition-all flex items-center justify-center gap-2"
              >
                Browse All Products
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
