import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, SlidersHorizontal, Package } from 'lucide-react';
import api from '../api/client';
import ProductCard from '../components/shop/ProductCard';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState(searchParams.get('search') || '');
  const [selectedCat, setSelectedCat] = useState(searchParams.get('category_slug') || '');
  const [minPrice, setMinPrice]   = useState('');
  const [maxPrice, setMaxPrice]   = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    api.get('/categories/').then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (minPrice) params.set('min_price', minPrice);
      if (maxPrice) params.set('max_price', maxPrice);
      if (searchParams.get('featured')) params.set('featured', 'true');
      params.set('limit', '50');

      const res = await api.get(`/products/?${params}`);
      let data = res.data;
      if (selectedCat) data = data.filter((p) => p.categories?.slug === selectedCat);
      setProducts(data);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }, [search, selectedCat, minPrice, maxPrice, searchParams]);

  useEffect(() => {
    const t = setTimeout(fetchProducts, 380);
    return () => clearTimeout(t);
  }, [fetchProducts]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCat('');
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
  };

  const hasFilters = search || selectedCat || minPrice || maxPrice;

  return (
    <div className="min-h-screen page-wrapper">
      <div className="container">

        {/* ── Page header ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.02em' }}>
            Our <span className="gradient-text">Collection</span>
          </h1>
          <p className="text-white/45 mt-2 text-sm">
            {loading ? 'Loading products...' : `${products.length} product${products.length !== 1 ? 's' : ''} available`}
          </p>
        </motion.div>

        {/* ── Search + filter row ─────────────────────── */}
        <div className="flex gap-3 mb-6 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 min-w-0">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="input-field pl-10 pr-4"
              id="shop-search-input"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-outline flex items-center gap-2 px-4 flex-shrink-0 ${showFilters ? 'border-red-400 text-red-400' : ''}`}
          >
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">Filters</span>
          </button>

          <AnimatePresence>
            {hasFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-sm text-red-400 border border-red-400/25 hover:bg-red-400/10 transition-all flex-shrink-0"
              >
                <X size={14} /> Clear
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* ── Category quick filters ─────────────────── */}
        <div className="flex gap-2.5 flex-wrap mb-8">
          <button
            onClick={() => setSelectedCat('')}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              !selectedCat
                ? 'text-gray-900'
                : 'glass text-white/55 hover:text-white'
            }`}
            style={!selectedCat ? { background: 'linear-gradient(135deg, #feca57, #ff9f43)' } : {}}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.slug)}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                selectedCat === cat.slug
                  ? 'text-gray-900'
                  : 'glass text-white/55 hover:text-white'
              }`}
              style={selectedCat === cat.slug ? { background: 'linear-gradient(135deg, #feca57, #ff9f43)' } : {}}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* ── Main grid with optional sidebar ─────────── */}
        <div className="flex gap-7 lg:gap-10 items-start">

          {/* Sidebar filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                key="sidebar"
                initial={{ opacity: 0, width: 0, x: -20 }}
                animate={{ opacity: 1, width: 220, x: 0 }}
                exit={{ opacity: 0, width: 0, x: -20 }}
                transition={{ duration: 0.28, ease: 'easeInOut' }}
                className="flex-shrink-0 overflow-hidden hidden md:block"
              >
                <div style={{ width: 220 }} className="space-y-4">
                  {/* Categories filter */}
                  <div className="glass rounded-2xl p-5">
                    <h3 className="font-bold mb-3.5 text-xs text-red-400 uppercase tracking-widest">
                      Categories
                    </h3>
                    <div className="space-y-1">
                      <button
                        onClick={() => setSelectedCat('')}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all ${
                          !selectedCat ? 'bg-red-500/15 text-red-400 font-semibold' : 'text-white/55 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        All Products
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCat(cat.slug)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all ${
                            selectedCat === cat.slug ? 'bg-red-500/15 text-red-400 font-semibold' : 'text-white/55 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price filter */}
                  <div className="glass rounded-2xl p-5">
                    <h3 className="font-bold mb-3.5 text-xs text-red-400 uppercase tracking-widest">
                      Price Range
                    </h3>
                    <div className="space-y-2.5">
                      <input
                        type="number"
                        placeholder="Min (Rs.)"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="input-field text-xs py-2.5"
                      />
                      <input
                        type="number"
                        placeholder="Max (Rs.)"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="input-field text-xs py-2.5"
                      />
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Products grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="product-grid">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="skeleton rounded-2xl h-72" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 flex flex-col items-center gap-4"
              >
                <Package size={56} className="text-white/15" />
                <p className="text-white/40 text-lg font-medium">No products found</p>
                <p className="text-white/25 text-sm">Try adjusting your filters</p>
                <button onClick={clearFilters} className="btn-outline text-sm py-2 mt-2">
                  Clear All Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.05 } },
                }}
                className="product-grid"
              >
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
