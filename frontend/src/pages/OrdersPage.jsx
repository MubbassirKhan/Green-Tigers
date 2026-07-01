import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, Truck, CheckCircle, XCircle, ShoppingBag, MapPin } from 'lucide-react';
import api from '../api/client';

const STATUS = {
  pending:   { color: '#feca57', icon: Clock,        label: 'Pending',   bg: 'rgba(254,202,87,0.12)' },
  confirmed: { color: '#34d399', icon: CheckCircle,  label: 'Confirmed', bg: 'rgba(52,211,153,0.12)' },
  shipped:   { color: '#60a5fa', icon: Truck,        label: 'Shipped',   bg: 'rgba(96,165,250,0.12)' },
  delivered: { color: '#a78bfa', icon: CheckCircle,  label: 'Delivered', bg: 'rgba(167,139,250,0.12)' },
  cancelled: { color: '#f87171', icon: XCircle,      label: 'Cancelled', bg: 'rgba(248,113,113,0.12)' },
};

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
      <div className="container max-w-3xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center gap-3"
        >
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(233,69,96,0.15)', border: '1px solid rgba(233,69,96,0.25)' }}>
            <ShoppingBag size={20} className="text-red-400" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.02em' }}>
              My Orders
            </h1>
            <p className="text-white/40 text-sm mt-0.5">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
          </div>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 glass-card"
          >
            <Package size={64} className="mx-auto mb-5 text-white/12" />
            <p className="text-white/35 text-lg font-medium">No orders yet</p>
            <p className="text-white/22 text-sm mt-1 mb-6">Start shopping to place your first order!</p>
            <a href="/shop" className="btn-gold px-6">Browse Products</a>
          </motion.div>
        ) : (
          <div className="space-y-5">
            {orders.map((order, i) => {
              const status = STATUS[order.status] || STATUS.pending;
              const Icon   = status.icon;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="glass-card p-5 sm:p-6"
                >
                  {/* Order header */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                    <div>
                      <p className="text-[10px] text-white/35 uppercase tracking-widest font-semibold mb-1">Order ID</p>
                      <p className="font-mono text-sm text-white/75 font-semibold">{order.id?.slice(0, 8).toUpperCase()}…</p>
                      <p className="text-xs text-white/35 mt-1">
                        {new Date(order.created_at).toLocaleDateString('en-PK', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </p>
                    </div>

                    <div
                      className="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold"
                      style={{ background: status.bg, color: status.color, border: `1px solid ${status.color}40` }}
                    >
                      <Icon size={12} />
                      {status.label}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-3 mb-5">
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.products?.image_url || 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=60&q=80'}
                          alt={item.products?.name}
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{item.products?.name}</p>
                          <p className="text-xs text-white/40 mt-0.5">
                            {item.quantity} × Rs. {item.unit_price?.toLocaleString()}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-yellow-400 flex-shrink-0">
                          Rs. {(item.quantity * item.unit_price)?.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-start gap-1.5 text-xs text-white/35 max-w-[60%]">
                      <MapPin size={12} className="text-red-400 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{order.shipping_address}</span>
                    </div>
                    <span
                      className="text-lg font-black gradient-text flex-shrink-0"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      Rs. {order.total_amount?.toLocaleString()}
                    </span>
                  </div>

                  {/* Progress bar */}
                  {order.status !== 'cancelled' && (
                    <div className="mt-4">
                      <div className="flex justify-between mb-2">
                        {['pending', 'confirmed', 'shipped', 'delivered'].map((s, si) => {
                          const st = STATUS[s];
                          const steps = ['pending','confirmed','shipped','delivered'];
                          const currentIdx = steps.indexOf(order.status);
                          const isActive = si <= currentIdx;
                          return (
                            <div key={s} className="flex flex-col items-center gap-1">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ background: isActive ? status.color : 'rgba(255,255,255,0.15)' }}
                              />
                              <span className="text-[9px] text-white/30 hidden sm:block capitalize">{s}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: status.color }}
                          initial={{ width: '0%' }}
                          animate={{
                            width: {
                              pending: '10%', confirmed: '40%', shipped: '70%', delivered: '100%',
                            }[order.status] || '10%',
                          }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  )}
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
