import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Zap, Menu, X, User, LogOut,
  Settings, Package, ChevronDown, MessageCircle, Home
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/shop', label: 'Shop', icon: Package },
  { to: '/feedback', label: 'Feedback', icon: MessageCircle },
  { to: '/shop?category_slug=clothing', label: 'Clothing' },
  { to: '/shop?category_slug=electronics', label: 'Electronics' },
  { to: '/shop?category_slug=sports', label: 'Sports' },
];

const Navbar = () => {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const { user, isAuthenticated, logout, isAdmin } = useAuthStore();
  const { getCount, toggleCart } = useCartStore();
  const navigate  = useNavigate();
  const location  = useLocation();
  const cartCount = getCount();

  /* scroll listener */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* close menus on route change */
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  /* close user menu on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to.split('?')[0]);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[rgba(8,7,20,0.92)] backdrop-blur-2xl border-b border-white/8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
            : 'bg-transparent'
        }`}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 md:h-18">

            {/* ── Logo ────────────────────────── */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <motion.div
                whileHover={{ rotate: 18, scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="w-9 h-9 rounded-xl flex items-center justify-center pulse-glow"
                style={{ background: 'linear-gradient(135deg, #e94560, #feca57)' }}
              >
                <Zap size={18} color="white" fill="white" />
              </motion.div>
              <div className="flex flex-col leading-tight">
                <span className="font-black text-base gradient-text" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.02em' }}>
                  Green Tiger
                </span>
                <span className="text-[9px] text-white/30 font-medium tracking-widest uppercase hidden sm:block">Shop Smart</span>
              </div>
            </Link>

            {/* ── Desktop nav links ────────────── */}
            <div className="hidden lg:flex items-center gap-0.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isActive(link.to)
                      ? 'text-white'
                      : 'text-white/55 hover:text-white'
                  }`}
                >
                  {link.icon && (
                    <link.icon size={16} className="text-white/70" />
                  )}
                  {link.label}
                  {isActive(link.to) && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg -z-10"
                      style={{ background: 'rgba(233,69,96,0.15)', border: '1px solid rgba(233,69,96,0.25)' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* ── Right side ───────────────────── */}
            <div className="flex items-center gap-1 sm:gap-2">

              {/* Cart button (only for logged-in non-admin) */}
              {isAuthenticated && !isAdmin() && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleCart}
                  className="relative p-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/8 transition-all"
                  id="navbar-cart-btn"
                  data-tip="Your Cart"
                >
                  <ShoppingCart size={20} />
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.span
                        key="count"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center text-white"
                        style={{ background: 'linear-gradient(135deg, #e94560, #ff6b6b)' }}
                      >
                        {cartCount > 9 ? '9+' : cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              )}

              {/* User menu / auth buttons */}
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-white/8 transition-all"
                    id="user-menu-btn"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shadow-md"
                      style={{ background: 'linear-gradient(135deg, #e94560, #feca57)' }}
                    >
                      {user?.full_name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden md:block text-sm text-white/75 font-medium max-w-[80px] truncate">
                      {user?.full_name?.split(' ')[0]}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`hidden md:block text-white/40 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute right-0 mt-2 w-52 glass-light rounded-2xl overflow-hidden shadow-2xl z-50"
                        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        {/* User info header */}
                        <div className="px-4 py-3 border-b border-white/8">
                          <p className="text-sm font-semibold text-white truncate">{user?.full_name}</p>
                          <p className="text-xs text-white/40 truncate mt-0.5">{user?.email}</p>
                        </div>

                        <div className="p-1.5">
                          {isAdmin() ? (
                            <Link
                              to="/admin"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:bg-white/8 hover:text-white transition-all"
                            >
                              <Settings size={15} className="text-red-400" />
                              Admin Dashboard
                            </Link>
                          ) : (
                            <>
                              <Link
                                to="/profile"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:bg-white/8 hover:text-white transition-all"
                              >
                                <User size={15} className="text-violet-400" />
                                My Profile
                              </Link>
                              <Link
                                to="/orders"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:bg-white/8 hover:text-white transition-all"
                              >
                                <Package size={15} className="text-cyan-400" />
                                My Orders
                              </Link>
                            </>
                          )}

                          <div className="h-px bg-white/8 my-1.5 mx-2" />

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all"
                          >
                            <LogOut size={15} />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link
                    to="/login"
                    className="hidden sm:block px-3.5 py-2 text-sm font-medium text-white/65 hover:text-white transition-colors rounded-lg hover:bg-white/6"
                  >
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary text-sm py-2 px-4">
                    Sign Up Free
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/8 transition-all ml-1"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {mobileOpen ? (
                    <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <X size={20} />
                    </motion.span>
                  ) : (
                    <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu size={20} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile Menu ─────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-full w-72 max-w-full z-50 flex flex-col"
              style={{
                background: 'linear-gradient(180deg, #0e0c20 0%, #080714 100%)',
                borderLeft: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between p-5 border-b border-white/8">
                <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #e94560, #feca57)' }}>
                    <Zap size={16} color="white" fill="white" />
                  </div>
                  <span className="font-black text-sm gradient-text" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Green Tiger
                  </span>
                </Link>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl hover:bg-white/8 transition-all">
                  <X size={18} />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {NAV_LINKS.map((link, i) => {
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.1 }}
                    >
                      <Link
                        to={link.to}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          isActive(link.to)
                            ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                            : 'text-white/65 hover:text-white hover:bg-white/6'
                        }`}
                      >
                        {Icon && <Icon size={16} className="text-white/70" />}
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Divider */}
                <div className="h-px bg-white/8 my-3" />

                {!isAuthenticated ? (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/65 hover:text-white hover:bg-white/6 transition-all">
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)}
                      className="btn-gold w-full justify-center mt-2">
                      Sign Up Free
                    </Link>
                  </>
                ) : (
                  <>
                    {!isAdmin() && (
                      <>
                        <Link to="/orders" onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/65 hover:text-white hover:bg-white/6 transition-all">
                          <Package size={16} className="text-cyan-400" /> My Orders
                        </Link>
                      </>
                    )}
                    {isAdmin() && (
                      <Link to="/admin" onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/65 hover:text-white hover:bg-white/6 transition-all">
                        <Settings size={16} className="text-red-400" /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => { handleLogout(); setMobileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all mt-2"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
