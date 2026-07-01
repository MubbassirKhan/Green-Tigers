import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CreditCard, CheckCircle, Package, Truck, ShoppingBag } from 'lucide-react';
import useCartStore from '../store/cartStore';
import api from '../api/client';
import toast from 'react-hot-toast';

const STEPS = ['Cart Review', 'Shipping', 'Payment', 'Confirm'];

const CheckoutPage = () => {
  const { items, getTotal, clearCart } = useCartStore();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const total    = getTotal();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.trim()) return toast.error('Please enter a shipping address');
    if (items.length === 0) return toast.error('Your cart is empty');
    setLoading(true);
    try {
      const orderItems = items.map((i) => ({ product_id: i.product_id, quantity: i.quantity }));
      await api.post('/orders/', { shipping_address: address, items: orderItems });
      await clearCart();
      setSuccess(true);
      setTimeout(() => navigate('/orders'), 3500);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Order failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  /* Success screen */
  if (success) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center glass-card p-12 max-w-sm w-full"
      >
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 260 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(52,211,153,0.15)', border: '2px solid rgba(52,211,153,0.4)' }}
        >
          <CheckCircle size={40} className="text-emerald-400" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-black mb-3 text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Order Placed! 🎉
        </h2>
        <p className="text-white/50 text-sm leading-relaxed">
          Your order has been placed successfully. Redirecting to your orders…
        </p>
        <motion.div
          className="mt-6 h-1 rounded-full overflow-hidden"
          style={{ background: 'rgba(52,211,153,0.2)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #34d399, #10b981)' }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 3.5, ease: 'linear' }}
          />
        </motion.div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen page-wrapper">
      <div className="container max-w-5xl">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-black" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.02em' }}>
            Checkout
          </h1>
          <p className="text-white/40 text-sm mt-1">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start">

          {/* ── Form ───────────────────────────────── */}
          <form onSubmit={handlePlaceOrder} className="space-y-5">

            {/* Shipping address */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="glass-card p-6 sm:p-7"
            >
              <h2 className="font-bold text-lg mb-5 flex items-center gap-2.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(72,219,251,0.15)' }}>
                  <MapPin size={16} className="text-cyan-400" />
                </div>
                Shipping Address
              </h2>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="input-field resize-none"
                rows={4}
                required
                placeholder="Enter your full delivery address including street, house number, city and postal code…"
              />
              <p className="text-xs text-white/30 mt-2">Please provide a complete address for smooth delivery.</p>
            </motion.div>

            {/* Payment */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="glass-card p-6 sm:p-7"
            >
              <h2 className="font-bold text-lg mb-5 flex items-center gap-2.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(254,202,87,0.15)' }}>
                  <CreditCard size={16} className="text-yellow-400" />
                </div>
                Payment Method
              </h2>

              <div
                className="flex items-center gap-3 p-4 rounded-2xl cursor-pointer"
                style={{
                  background: 'rgba(254,202,87,0.08)',
                  border: '2px solid rgba(254,202,87,0.3)',
                }}
              >
                <div
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: '#feca57' }}
                >
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#feca57' }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-yellow-400">Cash on Delivery (COD)</p>
                  <p className="text-xs text-white/40 mt-0.5">Pay when you receive your order</p>
                </div>
              </div>
            </motion.div>

            {/* Delivery info */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="glass rounded-2xl p-4 flex flex-wrap gap-4"
            >
              {[
                { icon: Truck,    text: 'Free Delivery',    sub: 'On all orders',      color: '#48dbfb' },
                { icon: Package,  text: 'Secure Packaging', sub: 'Bubble-wrapped safe',color: '#feca57' },
                { icon: ShoppingBag, text: 'Easy Returns',  sub: '14-day hassle-free', color: '#ff9f43' },
              ].map(({ icon: Icon, text, sub, color }) => (
                <div key={text} className="flex items-center gap-2.5 flex-1 min-w-[140px]">
                  <Icon size={16} style={{ color }} />
                  <div>
                    <p className="text-xs font-semibold text-white">{text}</p>
                    <p className="text-[10px] text-white/35">{sub}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Place order btn */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading || items.length === 0}
              className="btn-gold w-full justify-center py-4 text-base font-bold"
              id="place-order-btn"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Placing Order…
                </span>
              ) : (
                `Place Order — Rs. ${total.toLocaleString()}`
              )}
            </motion.button>
          </form>

          {/* ── Order Summary ──────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="glass-card p-6 sticky top-24"
          >
            <h2 className="font-bold text-lg mb-5 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <ShoppingBag size={18} className="text-red-400" />
              Order Summary
            </h2>

            <div className="space-y-3.5 mb-5 max-h-60 overflow-y-auto pr-1 custom-scroll">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <img
                    src={item.products?.image_url || 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=80&q=80'}
                    alt={item.products?.name}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{item.products?.name}</p>
                    <p className="text-xs text-white/40 mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-red-400 flex-shrink-0">
                    Rs. {(item.products?.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Subtotal</span>
                <span className="text-white font-medium">Rs. {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Shipping</span>
                <span className="text-emerald-400 font-semibold">Free</span>
              </div>
              <div className="flex justify-between items-center pt-3 mt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="font-bold text-base text-white">Total</span>
                <span
                  className="text-2xl font-black gradient-text"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Rs. {total.toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
