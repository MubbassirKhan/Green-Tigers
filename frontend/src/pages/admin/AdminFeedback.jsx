import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Star } from 'lucide-react';
import { AdminSidebar } from './AdminDashboard';
import api from '../../api/client';
import toast from 'react-hot-toast';

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/feedback/');
      setFeedback(res.data);
    } catch { } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const deleteFeedback = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/feedback/${id}`);
      toast.success('Review deleted');
      load();
    } catch { toast.error('Failed to delete review'); }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Customer Reviews</h1>
          <p className="text-white/50 text-sm mb-8">{feedback.length} total reviews</p>

          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}><td colSpan={6}><div className="h-8 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} /></td></tr>
                    ))
                  ) : feedback.map((f) => (
                    <tr key={f.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ background: 'rgba(91,186,132,0.2)', color: '#7bc67e' }}>
                            {f.profiles?.full_name?.[0] || 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{f.profiles?.full_name || 'Unknown'}</p>
                            <p className="text-xs text-white/40">{f.profiles?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-sm font-medium text-green-400">{f.products?.name}</td>
                      <td>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={12} fill={s <= f.rating ? '#facc15' : 'none'}
                              style={{ color: s <= f.rating ? '#facc15' : 'rgba(255,255,255,0.2)' }} />
                          ))}
                        </div>
                      </td>
                      <td className="text-sm text-white/60 max-w-xs">
                        <p className="truncate">{f.comment || '(no comment)'}</p>
                      </td>
                      <td className="text-xs text-white/50">{new Date(f.created_at).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => deleteFeedback(f.id)}
                          className="p-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-all">
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminFeedback;
