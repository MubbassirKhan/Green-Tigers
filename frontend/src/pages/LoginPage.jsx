import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap, ArrowRight, Mail, Lock } from 'lucide-react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login }   = useAuthStore();
  const navigate    = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.full_name?.split(' ')[0]}! 🌿`);
      if (user.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            'radial-gradient(ellipse 60% 50% at 30% 40%, rgba(233,69,96,0.13) 0%, transparent 60%)',
            'radial-gradient(ellipse 40% 40% at 70% 60%, rgba(162,155,254,0.1) 0%, transparent 55%)',
          ].join(', '),
        }}
      />

      {/* Floating blobs */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl pointer-events-none"
          style={{
            width:  `${120 + i * 60}px`,
            height: `${120 + i * 60}px`,
            background: i % 2 === 0 ? 'rgba(233,69,96,0.07)' : 'rgba(162,155,254,0.06)',
            top:  `${15 + i * 25}%`,
            left: i % 2 === 0 ? `${5 + i * 15}%` : `${60 + i * 10}%`,
          }}
          animate={{ scale: [1, 1.2, 1], y: [0, -20, 0] }}
          transition={{ duration: 7 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.08 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg pulse-glow"
              style={{ background: 'linear-gradient(135deg, #e94560, #feca57)' }}
            >
              <Zap size={28} color="white" fill="white" />
            </motion.div>
            <span className="text-2xl font-black gradient-text" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Green Tiger
            </span>
          </Link>
          <h1 className="mt-5 text-3xl font-black text-white" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.02em' }}>
            Welcome Back
          </h1>
          <p className="text-white/45 text-sm mt-1.5">Sign in to your Green Tiger account</p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-7 sm:p-8"
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" />
                <input
                  type="email"
                  required
                  id="login-email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" />
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  id="login-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field pl-10 pr-12"
                  placeholder="Your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white transition-colors"
                >
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="btn-gold w-full justify-center py-3.5 text-base font-bold mt-1"
              id="login-submit-btn"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Signing In…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight size={17} />
                </span>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-white/30 font-medium">OR</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <p className="text-center text-white/45 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-red-400 hover:text-red-300 font-semibold transition-colors">
              Create one free →
            </Link>
          </p>

          {/* Admin hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 p-3 rounded-xl text-xs text-center"
            style={{
              background: 'rgba(233,69,96,0.08)',
              border: '1px solid rgba(233,69,96,0.18)',
              color: '#e94560',
            }}
          >
            💡 Admin? Use your admin credentials to access the dashboard.
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
