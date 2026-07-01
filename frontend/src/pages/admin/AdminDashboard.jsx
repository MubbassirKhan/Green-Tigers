import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingBag, Users, MessageSquare,
  Zap, TrendingUp, DollarSign, Clock, ChevronRight, Menu, X,
  ArrowUpRight, Store
} from 'lucide-react';
import api from '../../api/client';

const NAV_ITEMS = [
  { to: '/admin',          icon: LayoutDashboard, label: 'Dashboard',  color: '#e94560' },
  { to: '/admin/products', icon: Package,         label: 'Products',   color: '#48dbfb' },
  { to: '/admin/orders',   icon: ShoppingBag,     label: 'Orders',     color: '#feca57' },
  { to: '/admin/users',    icon: Users,           label: 'Users',      color: '#a29bfe' },
  { to: '/admin/feedback', icon: MessageSquare,   label: 'Reviews',    color: '#ff9f43' },
];

/* ─── Sidebar ─────────────────────────────── */
export const AdminSidebar = ({ mobileOpen, onClose }) => {
  const location = useLocation();

  const content = (
    <div className="flex flex-col h-full p-4">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 mb-8 px-2 py-2 group" onClick={onClose}>
        <motion.div
          whileHover={{ rotate: 15, scale: 1.08 }}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #e94560, #feca57)' }}
        >
          <Zap size={18} color="white" fill="white" />
        </motion.div>
        <div>
          <p className="font-black text-sm gradient-text" style={{ fontFamily: 'Poppins, sans-serif' }}>Green tigers</p>
          <p className="text-[10px] text-white/35 uppercase tracking-widest">Admin Panel</p>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label, color }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className={`sidebar-link ${active ? 'active' : ''}`}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: active ? `${color}20` : 'rgba(255,255,255,0.05)' }}
              >
                <Icon size={16} style={{ color: active ? color : 'rgba(255,255,255,0.5)' }} />
              </div>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Back to store */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} className="pt-4 mt-4">
        <Link
          to="/"
          onClick={onClose}
          className="sidebar-link text-white/35"
        >
          <Store size={16} /> Back to Store
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="w-60 min-h-screen flex-shrink-0 hidden lg:block"
        style={{
          background: 'rgba(255,255,255,0.03)',
          borderRight: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {content}
      </aside>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
            />
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed left-0 top-0 h-full w-64 z-50 lg:hidden"
              style={{
                background: 'linear-gradient(180deg, #0e0c20 0%, #080714 100%)',
                borderRight: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-all"
              >
                <X size={16} />
              </button>
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

/* ─── Stat card ───────────────────────────── */
const StatCard = ({ icon: Icon, label, value, sub, color, trend }) => (
  <motion.div
    whileHover={{ y: -4 }}
    transition={{ duration: 0.2 }}
    className="glass-card p-5 sm:p-6 flex flex-col gap-4"
  >
    <div className="flex items-start justify-between">
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center"
        style={{ background: `${color}1a` }}
      >
        <Icon size={20} style={{ color }} />
      </div>
      {trend !== undefined && (
        <span
          className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
          style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399' }}
        >
          <ArrowUpRight size={10} /> {trend}
        </span>
      )}
    </div>
    <div>
      <p className="text-2xl sm:text-3xl font-black mb-0.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {value}
      </p>
      <p className="text-sm text-white/55 font-medium">{label}</p>
      {sub && <p className="text-xs text-white/30 mt-0.5">{sub}</p>}
    </div>
  </motion.div>
);

/* ─── Admin Dashboard Page ───────────────── */
const AdminDashboard = () => {
  const [stats, setStats]           = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/orders/'),
    ]).then(([sRes, oRes]) => {
      setStats(sRes.data);
      setRecentOrders(oRes.data.slice(0, 6));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const STATUS_COLOR = {
    delivered: { bg: 'rgba(52,211,153,0.15)',  color: '#34d399' },
    cancelled: { bg: 'rgba(248,113,113,0.15)', color: '#f87171' },
    shipped:   { bg: 'rgba(96,165,250,0.15)',  color: '#60a5fa' },
    confirmed: { bg: 'rgba(162,155,254,0.15)', color: '#a29bfe' },
    pending:   { bg: 'rgba(254,202,87,0.15)',  color: '#feca57' },
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="flex-1 min-w-0 overflow-auto">
        {/* Top bar */}
        <div
          className="sticky top-0 z-30 flex items-center gap-3 px-4 sm:px-6 py-4"
          style={{
            background: 'rgba(8,7,20,0.85)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/8 transition-all"
          >
            <Menu size={18} />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-black" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Dashboard
            </h1>
            <p className="text-xs text-white/35 hidden sm:block">Welcome back, Admin!</p>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 space-y-8">

          {/* Stats grid */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton rounded-2xl h-36" />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <StatCard icon={DollarSign} label="Total Revenue" color="#feca57" trend="+12%"
                value={`Rs. ${(stats?.total_revenue || 0).toLocaleString()}`}
                sub="All time" />
              <StatCard icon={ShoppingBag} label="Total Orders" color="#e94560" trend="+8%"
                value={stats?.total_orders || 0}
                sub={`${stats?.pending_orders || 0} pending`} />
              <StatCard icon={Package} label="Products" color="#48dbfb"
                value={stats?.total_products || 0}
                sub="In inventory" />
              <StatCard icon={Users} label="Customers" color="#a29bfe" trend="+5%"
                value={stats?.total_users || 0}
                sub="Registered users" />
            </motion.div>
          )}

          {/* Recent orders table */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/8">
              <h2 className="font-bold text-base sm:text-lg flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                <Clock size={16} className="text-red-400" />
                Recent Orders
              </h2>
              <Link
                to="/admin/orders"
                className="text-red-400 text-xs sm:text-sm hover:text-red-300 flex items-center gap-1 font-semibold transition-colors"
              >
                View all <ChevronRight size={14} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th className="hidden sm:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-white/30">
                        No orders yet
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => {
                      const sc = STATUS_COLOR[order.status] || STATUS_COLOR.pending;
                      return (
                        <tr key={order.id}>
                          <td>
                            <span className="font-mono text-xs text-white/55 bg-white/5 px-2 py-1 rounded-lg">
                              {order.id?.slice(0, 8).toUpperCase()}
                            </span>
                          </td>
                          <td className="text-sm font-medium">{order.profiles?.full_name || 'Unknown'}</td>
                          <td>
                            <span className="font-bold text-yellow-400">
                              Rs. {order.total_amount?.toLocaleString()}
                            </span>
                          </td>
                          <td>
                            <span
                              className="badge text-xs capitalize"
                              style={{ background: sc.bg, color: sc.color }}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="hidden sm:table-cell text-xs text-white/40">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {NAV_ITEMS.filter((n) => n.to !== '/admin').map(({ to, icon: Icon, label, color }) => (
              <Link
                key={to}
                to={to}
                className="glass-card p-5 sm:p-6 flex flex-col items-center gap-3 text-center card-hover"
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{ background: `${color}1a` }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <span className="text-sm font-semibold text-white/70">{label}</span>
              </Link>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
