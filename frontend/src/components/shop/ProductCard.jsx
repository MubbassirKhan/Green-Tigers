import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Eye, Zap } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const FALLBACK = {
  clothing:       'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=440&q=80',
  sports:         'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=440&q=80',
  'home-kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=440&q=80',
  beauty:         'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=440&q=80',
  electronics:    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=440&q=80',
  books:          'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=440&q=80',
  default:        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=440&q=80',
};

const CAT_COLOR = {
  clothing:       '#e94560',
  sports:         '#feca57',
  'home-kitchen': '#667eea',
  beauty:         '#ff6b6b',
  electronics:    '#48dbfb',
  books:          '#ff9f43',
};

const ProductCard = ({ product }) => {
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding]         = useState(false);
  const { addToCart, openCart }     = useCartStore();
  const { isAuthenticated }         = useAuthStore();

  const slug     = product.categories?.slug;
  const fallback = FALLBACK[slug] || FALLBACK.default;
  const catColor = CAT_COLOR[slug] || '#e94560';
  const rating   = product.avg_rating || parseFloat((3.8 + Math.random() * 1.2).toFixed(1));
  const inStock  = product.stock > 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    setAdding(true);
    try {
      await addToCart(product.id, 1);
      toast.success(`Added to cart! 🛍️`);
      openCart();
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
      }}
    >
      {/* ── Image ─────────────────────────── */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden" style={{ height: '13rem' }}>
        <img
          src={product.image_url || fallback}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
          onError={(e) => { e.target.src = fallback; }}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{ background: 'linear-gradient(to top, rgba(8,7,20,0.7) 0%, transparent 60%)' }}
        />

        {/* Hover actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            disabled={adding || !inStock}
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm disabled:opacity-50"
            style={{ background: '#e94560' }}
          >
            <ShoppingCart size={15} className="text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm"
            style={{ background: wishlisted ? '#feca57' : 'rgba(255,255,255,0.18)' }}
          >
            <Heart size={15} className="text-white" fill={wishlisted ? 'white' : 'none'} />
          </motion.button>
          <motion.div whileHover={{ scale: 1.12 }}>
            <Link
              to={`/product/${product.id}`}
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm"
              style={{ background: 'rgba(255,255,255,0.18)' }}
            >
              <Eye size={15} className="text-white" />
            </Link>
          </motion.div>
        </div>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.is_featured && (
            <span
              className="badge text-[10px] sm:text-xs"
              style={{ background: 'rgba(233,69,96,0.9)', color: 'white', backdropFilter: 'blur(4px)' }}
            >
              <Zap size={9} /> Featured
            </span>
          )}
          {!inStock && (
            <span
              className="badge text-[10px] sm:text-xs"
              style={{ background: 'rgba(0,0,0,0.75)', color: '#f87171', backdropFilter: 'blur(4px)' }}
            >
              Sold Out
            </span>
          )}
        </div>

        {/* Category badge */}
        {product.categories?.name && (
          <span
            className="absolute top-2.5 right-2.5 badge text-[10px] sm:text-xs"
            style={{ background: 'rgba(8,7,20,0.8)', color: catColor, backdropFilter: 'blur(6px)', border: `1px solid ${catColor}40` }}
          >
            {product.categories.name}
          </span>
        )}
      </Link>

      {/* ── Info ──────────────────────────── */}
      <div className="p-3.5 sm:p-4 flex flex-col gap-2 flex-1">
        <Link to={`/product/${product.id}`}>
          <h3
            className="font-semibold text-white text-sm leading-snug line-clamp-1 hover:text-red-400 transition-colors"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs text-white/40 line-clamp-1 leading-relaxed">{product.description}</p>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={11}
                style={{ color: s <= Math.round(rating) ? '#facc15' : 'rgba(255,255,255,0.18)' }}
                fill={s <= Math.round(rating) ? '#facc15' : 'none'}
              />
            ))}
          </div>
          <span className="text-[11px] text-white/35">{rating.toFixed(1)}</span>
        </div>

        {/* Price + cart */}
        <div className="flex items-center justify-between pt-1 mt-auto">
          <span
            className="text-base sm:text-lg font-black gradient-text"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Rs. {product.price?.toLocaleString()}
          </span>
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={handleAddToCart}
            disabled={adding || !inStock}
            className="btn-primary text-xs py-1.5 px-3 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ borderRadius: '8px' }}
          >
            {adding ? '...' : !inStock ? 'Sold Out' : 'Add to Cart'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
