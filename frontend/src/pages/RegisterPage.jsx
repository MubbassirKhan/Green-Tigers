import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap, ArrowRight, User, Phone, Mail, Lock } from 'lucide-react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const FIELD_CONFIG = [
  {
    key: 'full_name', label: 'Full Name', type: 'text',
    icon: User, placeholder: 'Ali Hassan', required: true, id: 'register-name',
  },
  {
    key: 'email', label: 'Email Address', type: 'email',
    icon: Mail, placeholder: 'you@example.com', required: true, id: 'register-email',
  },
  {
    key: 'phone', label: 'Phone (Optional)', type: 'tel',
    icon: Phone, placeholder: '+92 300 1234567', required: false, id: 'register-phone',
  },
];

const RegisterPage = () => {
  const [form, setForm]     = useState({ full_name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const navigate     = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const user = await register(form.email, form.password, form.full_name, form.phone);
      toast.success(`Welcome to Green Tiger, ${user.full_name?.split(' ')[0]}! 🌿`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-14 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            'radial-gradient(ellipse 55% 50% at 25% 35%, rgba(233,69,96,0.13) 0%, transparent 60%)',
            'radial-gradient(ellipse 45% 45% at 75% 65%, rgba(102,126,234,0.1) 0%, transparent 55%)',
          ].join(', '),
        }}
      />

      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl pointer-events-none"
          style={{
            width:  `${100 + i * 60}px`,
            height: `${100 + i * 60}px`,
            background: i % 2 === 0 ? 'rgba(233,69,96,0.07)' : 'rgba(102,126,234,0.06)',
            top:  `${10 + i * 28}%`,
            left: i % 2 === 0 ? `${5 + i * 10}%` : `${65 + i * 8}%`,
          }}
          animate={{ scale: [1, 1.18, 1], y: [0, -18, 0] }}
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
            Create Account
          </h1>
          <p className="text-white/45 text-sm mt-1.5">Join thousands of happy shoppers today</p>
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
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Standard fields */}
            {FIELD_CONFIG.map(({ key, label, type, icon: Icon, placeholder, required, id }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-white/55 mb-2 uppercase tracking-wider">
                  {label}
                </label>
                <div className="relative">
                  <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" />
                  <input
                    type={type}
                    id={id}
                    required={required}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="input-field pl-10"
                    placeholder={placeholder}
                  />
                </div>
              </div>
            ))}

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-white/55 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" />
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  id="register-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field pl-10 pr-12"
                  placeholder="Min 6 characters"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-white/55 mb-2 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" />
                <input
                  type="password"
                  required
                  id="register-confirm"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  className="input-field pl-10"
                  placeholder="Repeat your password"
                />
              </div>
            </div>

            {/* Password match indicator */}
            {form.confirm && form.password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`text-xs px-3 py-2 rounded-lg font-medium ${
                  form.password === form.confirm
                    ? 'text-emerald-400 bg-emerald-400/10'
                    : 'text-red-400 bg-red-400/10'
                }`}
              >
                {form.password === form.confirm ? '✓ Passwords match' : '✗ Passwords do not match'}
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              id="register-submit-btn"
              className="btn-gold w-full justify-center py-3.5 text-base font-bold mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Creating Account…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Create Account <ArrowRight size={17} />
                </span>
              )}
            </motion.button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-white/30 font-medium">ALREADY A MEMBER?</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <p className="text-center text-sm">
            <Link to="/login" className="text-red-400 hover:text-red-300 font-semibold transition-colors">
              Sign in to your account →
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
