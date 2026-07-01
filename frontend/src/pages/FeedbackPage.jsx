import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, MessageSquare, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const FeedbackPage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [prodRes, feedbackRes] = await Promise.all([
          api.get('/products/?limit=100'),
          api.get('/feedback/user'),
        ]);
        setProducts(prodRes.data);
        setFeedback(feedbackRes.data);
        setSelectedProductId(prodRes.data[0]?.id || '');
      } catch (err) {
        toast.error('Failed to load feedback data.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const submitFeedback = async (e) => {
    e.preventDefault();
    if (!selectedProductId) {
      toast.error('Please choose a product.');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please enter a comment.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/feedback/', {
        product_id: selectedProductId,
        rating,
        comment,
      });
      toast.success('Feedback submitted. Thank you!');
      setComment('');
      setRating(5);
      const feedbackRes = await api.get('/feedback/user');
      setFeedback(feedbackRes.data);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen page-wrapper pt-24 pb-20">
      <div className="container">
        <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm mb-8">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-3xl p-8 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-3xl flex items-center justify-center bg-gradient-to-br from-red-500 to-yellow-300 text-black">
                <MessageSquare size={24} />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-red-300">Feedback</p>
                <h1 className="text-3xl sm:text-4xl font-black mt-2">We Value Your Voice</h1>
              </div>
            </div>
            <p className="text-white/60 leading-relaxed mb-6">
              Share your experience with Green Tiger. We read every message and use your feedback to improve our products, service, and user experience.
            </p>

            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase text-white/40 tracking-[0.24em]">Signed in as</p>
                <p className="text-sm text-white/80 mt-1">{user?.full_name || 'Guest User'}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-white/40 tracking-[0.24em]">Email</p>
                <p className="text-sm text-white/80 mt-1">{user?.email || 'Not logged in'}</p>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="lg:col-span-2 glass rounded-3xl p-8 border border-white/10"
          >
            <div className="flex items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-black">Submit Feedback</h2>
                <p className="text-sm text-white/50 mt-1">Help us improve with your thoughts.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-white/70">
                <Star size={16} className="text-yellow-300" /> {rating} / 5
              </div>
            </div>

            <form onSubmit={submitFeedback} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/80">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className={`w-11 h-11 rounded-2xl transition-colors ${value <= rating ? 'bg-red-500 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/80">Message</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={6}
                  className="input-field resize-none min-h-[180px]"
                  placeholder="Tell us what went well or what we can improve..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-gold inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold"
              >
                <Send size={18} />
                {submitting ? 'Sending...' : 'Send Feedback'}
              </button>
            </form>

            <div className="mt-10">
              <h3 className="text-lg font-bold mb-4">Recent Feedback</h3>
              {loading ? (
                <div className="grid gap-4">
                  {[...Array(3)].map((_, idx) => (
                    <div key={idx} className="h-24 rounded-3xl bg-white/5 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {feedback.length === 0 ? (
                    <div className="rounded-3xl bg-white/5 p-6 text-sm text-white/50">No feedback yet.</div>
                  ) : feedback.map((item) => (
                    <div key={item.id} className="rounded-3xl bg-white/5 p-6 border border-white/10">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div>
                          <p className="font-semibold text-white">{item.profiles?.full_name || 'Anonymous'}</p>
                          <p className="text-xs text-white/40">{new Date(item.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/15 px-3 py-1 text-sm text-yellow-200">
                          <Star size={14} /> {item.rating}
                        </span>
                      </div>
                      <p className="text-sm text-white/60 leading-relaxed">{item.comment || 'No comment'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
