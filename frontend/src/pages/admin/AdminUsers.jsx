import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, UserCheck, UserX } from 'lucide-react';
import { AdminSidebar } from './AdminDashboard';
import api from '../../api/client';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch { } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change ${user.full_name}'s role to ${newRole}?`)) return;
    try {
      await api.put(`/admin/users/${user.id}/role?role=${newRole}`);
      toast.success(`Role updated to ${newRole}`);
      load();
    } catch { toast.error('Failed to update role'); }
  };

  const deleteUser = async (user) => {
    if (!window.confirm(`Delete user "${user.full_name}"? This action cannot be undone.`)) return;
    try {
      await api.delete(`/admin/users/${user.id}`);
      toast.success('User deleted');
      load();
    } catch { toast.error('Failed to delete user'); }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Users</h1>
          <p className="text-white/50 text-sm mb-8">{users.length} registered users</p>

          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}><td colSpan={6}><div className="h-8 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} /></td></tr>
                    ))
                  ) : users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                            style={{ background: 'rgba(233,69,96,0.2)', color: '#e94560' }}>
                            {user.full_name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <span className="text-sm font-semibold">{user.full_name}</span>
                        </div>
                      </td>
                      <td className="text-sm text-white/60">{user.email}</td>
                      <td className="text-sm text-white/60">{user.phone || '—'}</td>
                      <td>
                        <span className="badge text-xs px-2 py-0.5"
                          style={{ background: user.role === 'admin' ? 'rgba(254,202,87,0.2)' : 'rgba(233,69,96,0.2)', color: user.role === 'admin' ? '#feca57' : '#e94560' }}>
                          {user.role}
                        </span>
                      </td>
                      <td className="text-xs text-white/50">{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="flex gap-2">
                          <button onClick={() => toggleRole(user)}
                            className="p-2 rounded-lg hover:bg-yellow-400/10 transition-all" title="Toggle role"
                            style={{ color: '#d4a843' }}>
                            {user.role === 'admin' ? <UserX size={15} /> : <UserCheck size={15} />}
                          </button>
                          <button onClick={() => deleteUser(user)}
                            className="p-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-all" title="Delete user">
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
      </main>
    </div>
  );
};

export default AdminUsers;
