import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package, Clock, Truck, CheckCircle, XCircle,
  ShoppingBag, MapPin, ArrowLeft, Calendar, Hash
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client';

const STATUS = {
  pending:   { color: '#feca57', icon: Clock,       label: 'Pending',   bg: 'rgba(254,202,87,0.12)',  border: 'rgba(254,202,87,0.3)' },
  confirmed: { color: '#34d399', icon: CheckCircle, label: 'Confirmed', bg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.3)' },
  shipped:   { color: '#60a5fa', icon: Truck,       label: 'Shipped',   bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.3)' },
  delivered: { color: '#a78bfa', icon: CheckCircle, label: 'Delivered', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.3)' },
  cancelled: { color: '#f87171', icon: XCircle,     label: 'Cancelled', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.3)' },
};

const STEPS = ['pending', 'confirmed', 'shipped', 'delivered'];
const STEP_WIDTH = { pending: '8%', confirmed: '40%', shipped: '72%', delivered: '100%' };

const OrdersPage = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my')
      .then((r) => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 rounded-full"
        style={{ border: '3px solid rgba(233,69,96,0.2)', borderTopColor: '#e94560' }}
      />
    </div>
  );

  return (
    <div className="min-h-screen page-wrapper">
      <div className="container max-w-4xl">

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-10 transition-colors text-sm group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
            Continue Shopping
          </Link>
        </motion.div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-5 mb-10"
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(233,69,96,0.15)', border: '1px solid rgba(233,69,96,0.3)' }}
          >
            <ShoppingBag size={24} className="text-red-400" />
          </div>
          <div>
            <h1
              className="text-3xl sm:text-4xl font-black"
              style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.02em' }}
            >
              My Orders
            </h1>
            <p className="text-white/40 text-sm mt-1">
              {orders.length} order{orders.length !== 1 ? 's' : ''} placed
            </p>
          </div>
        </motion.div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-16 text-center flex flex-col items-center gap-5"
          >
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <Package size={40} className="text-white/20" />
            </div>
            <div>
              <p className="text-white/40 text-xl font-semibold">No orders yet</p>
              <p className="text-white/25 text-sm mt-2">Start shopping to place your first order!</p>
            </div>
            <Link to="/shop" className="btn-gold px-8 mt-2">Browse Products</Link>
          </motion.div>

        ) : (
          <div className="space-y-6">
            {orders.map((order, i) => {
              const status   = STATUS[order.status] || STATUS.pending;
              const Icon     = status.icon;
              const isCancelled = order.status === 'cancelled';

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="glass-card overflow-hidden"
                >
                  {/* ── Card Top Bar (status color accent) */}
                  <div
                    className="h-1 w-full"
                    style={{ background: `linear-gradient(90deg, ${status.color}, ${status.color}44)` }}
                  />

                  <div className="p-7 sm:p-8">

                    {/* ── Order Header ──────────────────── */}
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-7">
                      {/* ID + Date */}
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                        <div className="flex items-center gap-2.5">
                          <Hash size={14} className="text-white/30" />
                          <div>
                            <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-0.5">Order ID</p>
                            <p className="font-mono text-sm font-bold text-white">
                              {order.id?.slice(0, 8).toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <div
                          className="w-px h-8 hidden sm:block"
                          style={{ background: 'rgba(255,255,255,0.08)' }}
                        />
                        <div className="flex items-center gap-2.5">
                          <Calendar size={14} className="text-white/30" />
                          <div>
                            <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-0.5">Placed On</p>
                            <p className="text-sm text-white/70 font-medium">
                              {new Date(order.created_at).toLocaleDateString('en-PK', {
                                year: 'numeric', month: 'short', day: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold"
                        style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}
                      >
                        <Icon size={13} />
                        {status.label}
                      </div>
                    </div>

                    {/* ── Divider ──────────────────────── */}
                    <div className="h-px bg-white/6 mb-6" />

                    {/* ── Order Items ───────────────────── */}
                    <div className="space-y-4 mb-6">
                      {order.order_items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-4 rounded-2xl"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                        >
                          <img
                            src={item.products?.image_url || 'https://picsum.photos/seed/orderitem/80/80'}
                            alt={item.products?.name}
                            className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate mb-1">
                              {item.products?.name}
                            </p>
                            <p className="text-xs text-white/40">
                              Qty: <span className="text-white/60 font-medium">{item.quantity}</span>
                              &nbsp;×&nbsp;
                              Rs. <span className="text-white/60 font-medium">{item.unit_price?.toLocaleString()}</span>
                            </p>
                          </div>
                          <p className="text-sm font-black text-yellow-400 flex-shrink-0">
                            Rs. {(item.quantity * item.unit_price)?.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* ── Footer: Address + Total ────────── */}
                    <div
                      className="flex flex-wrap items-center justify-between gap-4 py-5 px-5 rounded-2xl mb-6"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <MapPin size={15} className="text-red-400 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-1">
                            Shipping To
                          </p>
                          <p className="text-sm text-white/60 truncate">{order.shipping_address}</p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-1">
                          Order Total
                        </p>
                        <p
                          className="text-xl font-black gradient-text"
                          style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                          Rs. {order.total_amount?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* ── Progress Tracker ───────────────── */}
                    {!isCancelled && (
                      <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-4">
                          Order Progress
                        </p>
                        {/* Step labels + dots */}
                        <div className="flex justify-between mb-3">
                          {STEPS.map((s, si) => {
                            const stepStatus = STATUS[s];
                            const currentIdx = STEPS.indexOf(order.status);
                            const isActive   = si <= currentIdx;
                            const isCurrent  = si === currentIdx;
                            return (
                              <div key={s} className="flex flex-col items-center gap-2 flex-1">
                                <motion.div
                                  className="w-3 h-3 rounded-full flex items-center justify-center"
                                  style={{
                                    background: isActive ? status.color : 'rgba(255,255,255,0.1)',
                                    boxShadow: isCurrent ? `0 0 8px ${status.color}80` : 'none',
                                  }}
                                  animate={isCurrent ? { scale: [1, 1.3, 1] } : {}}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                />
                                <span
                                  className="text-[10px] font-semibold capitalize hidden sm:block"
                                  style={{ color: isActive ? status.color : 'rgba(255,255,255,0.25)' }}
                                >
                                  {s}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        {/* Progress bar */}
                        <div
                          className="h-1.5 rounded-full overflow-hidden"
                          style={{ background: 'rgba(255,255,255,0.08)' }}
                        >
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(90deg, ${status.color}, ${status.color}88)` }}
                            initial={{ width: '0%' }}
                            animate={{ width: STEP_WIDTH[order.status] || '8%' }}
                            transition={{ duration: 0.9, ease: 'easeOut', delay: i * 0.07 + 0.2 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Cancelled message */}
                    {isCancelled && (
                      <div
                        className="flex items-center gap-3 px-4 py-3 rounded-xl"
                        style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}
                      >
                        <XCircle size={16} className="text-red-400 flex-shrink-0" />
                        <p className="text-sm text-red-400">This order has been cancelled.</p>
                      </div>
                    )}

                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
