import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCartStore from '../../store/cartStore';

const FALLBACK = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&q=80';

const CartDrawer = () => {
  const { isOpen, closeCart, items, updateItem, removeItem, getTotal } = useCartStore();
  const total = getTotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={closeCart}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 h-full z-50 flex flex-col"
            style={{
              width: 'min(380px, 100vw)',
              background: 'linear-gradient(180deg, #0e0c20 0%, #080714 100%)',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '-16px 0 64px rgba(0,0,0,0.5)',
            }}
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
              <div className="flex items-center gap-2.5">
                <ShoppingCart size={20} className="text-red-400" />
                <h2 className="text-base font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Your Cart
                </h2>
                {items.length > 0 && (
                  <span
                    className="badge text-xs"
                    style={{ background: 'rgba(233,69,96,0.18)', color: '#e94560', border: '1px solid rgba(233,69,96,0.3)' }}
                  >
                    {items.length}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/8 transition-all"
              >
                <X size={17} />
              </button>
            </div>

            {/* ── Items ── */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scroll">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-64 text-center gap-3"
                >
                  <div
                    className="w-18 h-18 rounded-3xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.04)', width: 72, height: 72 }}
                  >
                    <ShoppingBag size={32} className="text-white/20" />
                  </div>
                  <p className="text-white/35 text-sm font-medium">Your cart is empty</p>
                  <button
                    onClick={closeCart}
                    className="btn-outline text-xs py-2 px-4 mt-1"
                  >
                    Continue Shopping
                  </button>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex gap-3 p-3 rounded-2xl"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      {/* Image */}
                      <img
                        src={item.products?.image_url || FALLBACK}
                        alt={item.products?.name}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                        onError={(e) => { e.target.src = FALLBACK; }}
                      />

                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <p className="text-sm font-semibold text-white leading-snug line-clamp-1">
                          {item.products?.name}
                        </p>
                        <p className="text-sm font-bold text-red-400">
                          Rs. {item.products?.price?.toLocaleString()}
                        </p>

                        <div className="flex items-center gap-2 mt-auto">
                          {/* Qty controls */}
                          <div
                            className="flex items-center rounded-lg overflow-hidden"
                            style={{ background: 'rgba(255,255,255,0.07)' }}
                          >
                            <button
                              onClick={() => updateItem(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="w-7 text-center text-sm font-bold text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateItem(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                            >
                              <Plus size={11} />
                            </button>
                          </div>

                          {/* Subtotal */}
                          <span className="text-xs text-white/35 flex-1 text-right">
                            Rs. {(item.products?.price * item.quantity)?.toLocaleString()}
                          </span>

                          {/* Remove */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* ── Footer ── */}
            {items.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 space-y-3"
                style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
              >
                {/* Free shipping notice */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
                  style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399' }}>
                  <Tag size={12} /> Free shipping on all orders!
                </div>

                {/* Total */}
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm text-white/55">Subtotal</span>
                  <span className="font-black text-xl gradient-text" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Rs. {total.toLocaleString()}
                  </span>
                </div>

                {/* CTA */}
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="btn-gold w-full justify-center font-bold py-3.5 text-sm"
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </Link>
                <button
                  onClick={closeCart}
                  className="w-full btn-outline text-sm py-2.5 justify-center"
                >
                  Continue Shopping
                </button>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
