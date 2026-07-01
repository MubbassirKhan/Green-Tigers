import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Save, Search, Menu } from 'lucide-react';
import AdminDashboard, { AdminSidebar } from './AdminDashboard';
import api from '../../api/client';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', description: '', price: '', stock: '', category_id: '', image_url: '', is_featured: false };

const AdminProducts = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [pr, cr] = await Promise.all([api.get('/products/?limit=100'), api.get('/categories/')]);
      setProducts(pr.data); setCategories(cr.data);
    } catch { } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditProduct(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (p) => {
    setEditProduct(p);
    setForm({ name: p.name, description: p.description || '', price: p.price, stock: p.stock, category_id: p.category_id, image_url: p.image_url || '', is_featured: p.is_featured });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) };
      if (editProduct) await api.put(`/products/${editProduct.id}`, payload);
      else await api.post('/products/', payload);
      toast.success(editProduct ? 'Product updated!' : 'Product created! 🌿');
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to save product');
    } finally { setSaving(false); }
  };

  const handleDelete = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    try {
      await api.delete(`/products/${p.id}`);
      toast.success('Product deleted');
      load();
    } catch { toast.error('Failed to delete'); }
  };

  const filtered = products.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex min-h-screen">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <main className="flex-1 min-w-0 overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center gap-3 px-4 sm:px-6 py-4"
          style={{ background: 'rgba(8,7,20,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => setMobileOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/8 transition-all">
            <Menu size={18} />
          </button>
          <div className="flex-1 flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-xl font-black" style={{ fontFamily: 'Poppins, sans-serif' }}>Products</h1>
              <p className="text-xs text-white/35 hidden sm:block">{products.length} total products</p>
            </div>
            <button onClick={openAdd} className="btn-primary text-sm py-2 px-4" id="add-product-btn">
              <Plus size={15} /> <span className="hidden sm:inline">Add Product</span><span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Search */}
          <div className="relative mb-6 max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 text-sm" placeholder="Search products..." />
          </div>

          {/* Table */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}><td colSpan={7}><div className="h-8 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} /></td></tr>
                    ))
                  ) : filtered.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <img src={p.image_url || 'https://picsum.photos/seed/adminprod/60/60'}
                          alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                      </td>
                      <td className="font-semibold text-sm max-w-xs truncate">{p.name}</td>
                      <td>
                        <span className="badge text-xs px-2 py-0.5" style={{ background: 'rgba(254,202,87,0.15)', color: '#feca57' }}>
                          {p.categories?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="font-bold text-yellow-400">Rs. {p.price?.toLocaleString()}</td>
                      <td>
                        <span className={`badge text-xs px-2 py-0.5 ${p.stock > 0 ? '' : ''}`}
                          style={{ background: p.stock > 0 ? 'rgba(254,202,87,0.15)' : 'rgba(248,113,113,0.15)', color: p.stock > 0 ? '#feca57' : '#f87171' }}>
                          {p.stock}
                        </span>
                      </td>
                      <td>{p.is_featured ? '⭐' : '—'}</td>
                      <td>
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-blue-400 hover:bg-blue-400/10 transition-all" title="Edit">
                            <Edit2 size={15} />
                          </button>
                          <button onClick={() => handleDelete(p)} className="p-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-all" title="Delete">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
                className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} />
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto custom-scroll"
                  style={{ background: 'linear-gradient(180deg, #0e0c20, #080714)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {editProduct ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-white/10"><X size={18} /></button>
                  </div>
                  <form onSubmit={handleSave} className="space-y-4">
                    <div>
                      <label className="block text-sm text-white/60 mb-1">Name *</label>
                      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Product name" />
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 mb-1">Description</label>
                      <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" rows={3} placeholder="Product description" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-white/60 mb-1">Price (Rs.) *</label>
                        <input required type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" placeholder="500" />
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-1">Stock *</label>
                        <input required type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field" placeholder="50" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 mb-1">Category</label>
                      <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="input-field">
                        <option value="">Select category</option>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 mb-1">Image URL</label>
                      <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field" placeholder="https://..." />
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 rounded" />
                      <span className="text-sm text-white/70">Mark as Featured</span>
                    </label>
                    <button type="submit" disabled={saving} className="btn-gold w-full justify-center py-3 font-bold">
                      <Save size={16} /> {saving ? 'Saving...' : editProduct ? 'Update Product' : 'Create Product'}
                    </button>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminProducts;
