import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingCart, Star, ArrowLeft, Minus, Plus,
  Package, Truck, RefreshCw, Shield, Heart, Share2
} from 'lucide-react';
import api from '../api/client';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const FALLBACK = 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=700&q=80';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct]       = useState(null);
  const [reviews, setReviews]       = useState([]);
  const [qty, setQty]               = useState(1);
  const [loading, setLoading]       = useState(true);
  const [wishlisted, setWishlisted] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const { addToCart, openCart }     = useCartStore();
  const { isAuthenticated }         = useAuthStore();

  useEffect(() => {
    (async () => {
      try {
        const [pRes, rRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/feedback/product/${id}`),
        ]);
        setProduct(pRes.data);
        setReviews(rRes.data);
      } catch {}
      finally { setLoading(false); }
    })();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) return toast.error('Please login first');
    await addToCart(product.id, qty);
    toast.success('Added to cart! 🌿');
    openCart();
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please login to leave a review');
    setSubmitting(true);
    try {
      await api.post('/feedback/', { product_id: id, rating: reviewForm.rating, comment: reviewForm.comment });
      toast.success('Review submitted! ⭐');
      const rRes = await api.get(`/feedback/product/${id}`);
      setReviews(rRes.data);
      setReviewForm({ rating: 5, comment: '' });
    } catch { toast.error('Failed to submit review'); }
    finally { setSubmitting(false); }
  };

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

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center gap-4 px-4">
      <Package size={64} className="text-white/15" />
      <p className="text-white/40 text-xl">Product not found</p>
      <Link to="/shop" className="btn-primary">← Back to Shop</Link>
    </div>
  );

  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;
  const inStock   = product.stock > 0;

  return (
    <div className="min-h-screen page-wrapper">
      <div className="container">

        {/* Back link */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors text-sm group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
            Back to Shop
          </Link>
        </motion.div>

        {/* Product details grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 mb-16">

          {/* ── Image ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div
              className="rounded-3xl overflow-hidden relative group"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <img
                src={product.image_url || FALLBACK}
                alt={product.name}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ height: 'clamp(300px, 45vw, 520px)' }}
                onError={(e) => { e.target.src = FALLBACK; }}
              />
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(8,7,20,0.35) 0%, transparent 50%)' }} />
            </div>

            {/* Wishlist fab */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setWishlisted(!wishlisted)}
              className="absolute top-4 right-4 w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm transition-colors"
              style={{
                background: wishlisted ? 'rgba(254,202,87,0.9)' : 'rgba(14,12,32,0.7)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <Heart size={18} style={{ color: wishlisted ? '#0e0c20' : 'white' }} fill={wishlisted ? '#0e0c20' : 'none'} />
            </motion.button>
          </motion.div>

          {/* ── Info ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col"
          >
            {/* Category tag */}
            {product.categories?.name && (
              <span className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">
                {product.categories.name}
              </span>
            )}

            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 leading-tight"
              style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.02em' }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={17}
                    style={{ color: s <= Math.round(avgRating) ? '#facc15' : 'rgba(255,255,255,0.18)' }}
                    fill={s <= Math.round(avgRating) ? '#facc15' : 'none'} />
                ))}
              </div>
              <span className="text-sm text-white/45">
                {avgRating > 0 ? avgRating.toFixed(1) : '—'} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
              </span>
            </div>

            {/* Description */}
            <p className="text-white/55 leading-relaxed mb-6 text-sm sm:text-base">
              {product.description || 'Premium quality product from Green Tiger.'}
            </p>

            {/* Price */}
            <div
              className="text-3xl sm:text-4xl font-black gradient-text mb-4"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Rs. {product.price?.toLocaleString()}
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2 mb-7">
              <span
                className={`w-2 h-2 rounded-full ${inStock ? 'bg-emerald-400' : 'bg-red-400'}`}
                style={{ boxShadow: inStock ? '0 0 6px rgba(52,211,153,0.6)' : '0 0 6px rgba(248,113,113,0.6)' }}
              />
              <span className={`text-sm font-semibold ${inStock ? 'text-emerald-400' : 'text-red-400'}`}>
                {inStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity + Add to cart */}
            <div className="flex items-stretch gap-3 mb-6">
              {/* Qty picker */}
              <div
                className="flex items-center rounded-xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-3.5 text-white/60 hover:text-white hover:bg-white/8 transition-all"
                >
                  <Minus size={15} />
                </button>
                <span className="px-4 font-black text-white min-w-[2.5rem] text-center">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  disabled={!inStock}
                  className="px-4 py-3.5 text-white/60 hover:text-white hover:bg-white/8 transition-all disabled:opacity-40"
                >
                  <Plus size={15} />
                </button>
              </div>

              {/* Add to cart */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleAddToCart}
                disabled={!inStock}
                className="btn-gold flex-1 py-3.5 font-bold justify-center disabled:opacity-50 text-sm sm:text-base"
              >
                <ShoppingCart size={17} /> Add to Cart
              </motion.button>

              {/* Share */}
              <button
                onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success('Link copied!'); }}
                className="w-12 flex items-center justify-center rounded-xl text-white/40 hover:text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <Share2 size={16} />
              </button>
            </div>

            {/* Feature badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck,    label: 'Fast Delivery',    color: '#48dbfb' },
                { icon: Package,  label: 'Secure Pack',       color: '#feca57' },
                { icon: RefreshCw,label: '14-day Returns',   color: '#ff9f43' },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-2xl text-center"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <Icon size={17} style={{ color }} />
                  <p className="text-[10px] sm:text-xs text-white/45 leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Reviews ───────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Write review */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="glass-card p-6 sm:p-8"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Write a Review
            </h2>
            <form onSubmit={submitReview} className="space-y-5">
              <div>
                <label className="block text-xs text-white/50 mb-2.5 font-semibold uppercase tracking-wider">
                  Your Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <motion.button
                      key={s}
                      type="button"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setReviewForm((f) => ({ ...f, rating: s }))}
                    >
                      <Star
                        size={28}
                        style={{ color: s <= reviewForm.rating ? '#facc15' : 'rgba(255,255,255,0.2)' }}
                        fill={s <= reviewForm.rating ? '#facc15' : 'none'}
                        className="transition-colors"
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-2 font-semibold uppercase tracking-wider">
                  Your Comment
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                  className="input-field resize-none"
                  rows={4}
                  placeholder="Share your experience with this product…"
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={submitting}
                className="btn-primary w-full justify-center py-3"
              >
                {submitting ? 'Submitting…' : 'Submit Review'}
              </motion.button>
            </form>
          </motion.div>

          {/* Reviews list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Customer Reviews
              <span className="text-white/30 text-base ml-2 font-medium">({reviews.length})</span>
            </h2>

            <div className="space-y-4 max-h-[26rem] overflow-y-auto pr-1 custom-scroll">
              {reviews.length === 0 ? (
                <div className="text-center py-10 glass rounded-2xl">
                  <Star size={36} className="mx-auto mb-3 text-white/15" />
                  <p className="text-white/35 text-sm">No reviews yet. Be the first!</p>
                </div>
              ) : (
                reviews.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass rounded-2xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black"
                          style={{ background: 'rgba(233,69,96,0.2)', color: '#e94560' }}
                        >
                          {r.profiles?.full_name?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{r.profiles?.full_name || 'User'}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={12}
                            style={{ color: s <= r.rating ? '#facc15' : 'rgba(255,255,255,0.18)' }}
                            fill={s <= r.rating ? '#facc15' : 'none'} />
                        ))}
                      </div>
                    </div>
                    {r.comment && <p className="text-sm text-white/50 leading-relaxed">{r.comment}</p>}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
