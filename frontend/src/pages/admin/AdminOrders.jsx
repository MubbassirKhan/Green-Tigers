import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AdminSidebar } from './AdminDashboard';
import { Menu } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS = {
  pending:   { bg: 'rgba(254,202,87,0.15)',  color: '#feca57' },
  confirmed: { bg: 'rgba(96,165,250,0.15)',  color: '#60a5fa' },
  shipped:   { bg: 'rgba(167,139,250,0.15)', color: '#a78bfa' },
  delivered: { bg: 'rgba(52,211,153,0.15)',  color: '#34d399' },
  cancelled: { bg: 'rgba(248,113,113,0.15)', color: '#f87171' },
};

const AdminOrders = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/');
      setOrders(res.data);
    } catch { } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success(`Order status updated to ${status}`);
      load();
    } catch { toast.error('Failed to update status'); }
  };

  const filtered = filter ? orders.filter((o) => o.status === filter) : orders;

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
          <div>
            <h1 className="text-lg sm:text-xl font-black" style={{ fontFamily: 'Poppins, sans-serif' }}>Orders</h1>
            <p className="text-xs text-white/35 hidden sm:block">{orders.length} total orders</p>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Status filter */}
          <div className="flex gap-2 flex-wrap mb-6">
            <button onClick={() => setFilter('')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                !filter ? 'text-gray-900' : 'glass text-white/55 hover:text-white'
              }`}
              style={!filter ? { background: 'linear-gradient(135deg, #feca57, #ff9f43)' } : {}}>
              All
            </button>
            {STATUS_OPTIONS.map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${
                  filter === s ? 'font-bold' : 'glass text-white/55 hover:text-white'
                }`}
                style={filter === s ? { background: STATUS_COLORS[s]?.bg, color: STATUS_COLORS[s]?.color, border: `1px solid ${STATUS_COLORS[s]?.color}40` } : {}}>
                {s}
              </button>
            ))}
          </div>

          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Items</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}><td colSpan={7}><div className="h-8 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} /></td></tr>
                    ))
                  ) : filtered.map((order) => {
                    const sc = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
                    return (
                      <tr key={order.id}>
                        <td className="font-mono text-xs text-white/60">{order.id?.slice(0, 8)}...</td>
                        <td>
                          <div>
                            <p className="text-sm font-semibold">{order.profiles?.full_name || 'Unknown'}</p>
                            <p className="text-xs text-white/40">{order.profiles?.email}</p>
                          </div>
                        </td>
                        <td className="font-bold text-yellow-400">Rs. {order.total_amount?.toLocaleString()}</td>
                        <td className="text-sm text-white/60">{order.order_items?.length || 0} items</td>
                        <td>
                          <span className="badge text-xs px-2 py-0.5 capitalize" style={{ background: sc.bg, color: sc.color }}>
                            {order.status}
                          </span>
                        </td>
                        <td className="text-xs text-white/50">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td>
                          <select value={order.status}
                            onChange={(e) => updateStatus(order.id, e.target.value)}
                            className="text-xs rounded-lg px-2 py-1.5 outline-none transition-all"
                            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}>
                            {STATUS_OPTIONS.map((s) => <option key={s} value={s} style={{ background: '#1a4731' }}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminOrders;
