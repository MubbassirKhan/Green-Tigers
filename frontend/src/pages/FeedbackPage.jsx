import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Send,
  MessageSquare,
  ArrowLeft,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/client";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

const FeedbackPage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [sentiment, setSentiment] = useState("");

  const hasProducts = products.length > 0;
  const selectedProductName =
    products.find((product) => product.id === selectedProductId)?.name ||
    "Selected product";

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [prodRes, feedbackRes] = await Promise.all([
          api.get("/products/?limit=100"),
          api.get("/feedback/user"),
        ]);

        const productList = Array.isArray(prodRes.data) ? prodRes.data : [];
        setProducts(productList);
        setFeedback(Array.isArray(feedbackRes.data) ? feedbackRes.data : []);
        if (!selectedProductId && productList.length > 0) {
          setSelectedProductId(productList[0].id);
        }
      } catch (err) {
        console.error("Failed to load feedback data:", err);
        toast.error("Failed to load feedback data.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const submitFeedback = async (e) => {
    e.preventDefault();
    if (!isAuthenticated)
      return toast.error("Please login to submit feedback.");
    if (!hasProducts) return toast.error("No products available for feedback.");
    if (!selectedProductId) return toast.error("Please choose a product.");
    if (!comment.trim()) return toast.error("Please enter a comment.");

    setSubmitting(true);
    try {
      await api.post("/feedback/", {
        product_id: selectedProductId,
        rating,
        comment,
      });

      const sentimentRes = await api.post("/sentiment/predict", {
        review: comment,
      });

      setSentiment(sentimentRes.data.sentiment || "Neutral");
      setShowResult(true);

      toast.success("Feedback submitted. Thank you! ⭐");
      setSubmitted(true);
      setComment("");
      setRating(5);
      const feedbackRes = await api.get("/feedback/user");
      setFeedback(Array.isArray(feedbackRes.data) ? feedbackRes.data : []);
      setTimeout(() => setSubmitted(false), 2500);
    } catch (err) {
      console.error("Feedback submission failed:", err);
      toast.error(err.response?.data?.detail || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <div className="min-h-screen page-wrapper">
      <div className="container max-w-6xl">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-10 transition-colors text-sm group"
          >
            <ArrowLeft
              size={15}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Home
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-[390px_1.1fr] gap-12 xl:gap-18 items-start">
          {/* ── Left Info Panel ─────────────────────── */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card p-10 sm:p-12 rounded-[32px] flex flex-col gap-9 sticky top-24 shadow-[0_24px_80px_rgba(0,0,0,0.16)]"
          >
            {/* Icon + Heading */}
            <div className="flex flex-col gap-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #e94560, #feca57)",
                }}
              >
                <MessageSquare size={26} color="white" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-400 mb-2">
                  Feedback
                </p>
                <h1
                  className="text-3xl sm:text-4xl font-black leading-tight"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    letterSpacing: "-0.02em",
                  }}
                >
                  We Value
                  <br />
                  <span className="gradient-text">Your Voice</span>
                </h1>
              </div>
            </div>

            {/* Description */}
            <p className="text-white/55 leading-relaxed text-sm">
              Share your experience with Green tigers. We read every message and
              use your feedback to improve our products, service, and user
              experience.
            </p>

            {/* Divider */}
            <div className="h-px bg-white/8" />

            {/* User info */}
            {isAuthenticated ? (
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/35 font-semibold mb-1.5">
                    Signed in as
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #e94560, #feca57)",
                      }}
                    >
                      {user?.full_name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {user?.full_name}
                      </p>
                      <p className="text-xs text-white/40 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="p-4 rounded-2xl text-sm text-center"
                style={{
                  background: "rgba(233,69,96,0.08)",
                  border: "1px solid rgba(233,69,96,0.2)",
                }}
              >
                <p className="text-red-400 font-semibold mb-2">
                  Login Required
                </p>
                <p className="text-white/50 text-xs mb-3">
                  Sign in to leave feedback
                </p>
                <Link to="/login" className="btn-primary text-xs py-2 px-4">
                  Sign In
                </Link>
              </div>
            )}

            {/* Stats */}
            <div
              className="rounded-2xl p-4 flex items-center justify-between"
              style={{
                background: "rgba(254,202,87,0.07)",
                border: "1px solid rgba(254,202,87,0.15)",
              }}
            >
              <div className="text-center px-3">
                <p
                  className="text-2xl font-black text-yellow-400"
                  style={{ fontFamily: "Poppins" }}
                >
                  {feedback.length}
                </p>
                <p className="text-xs text-white/40 mt-0.5">Your Reviews</p>
              </div>
              <div className="w-px h-8 bg-white/8" />
              <div className="text-center px-3">
                <p
                  className="text-2xl font-black text-yellow-400"
                  style={{ fontFamily: "Poppins" }}
                >
                  {feedback.length > 0
                    ? (
                        feedback.reduce((s, f) => s + f.rating, 0) /
                        feedback.length
                      ).toFixed(1)
                    : "—"}
                </p>
                <p className="text-xs text-white/40 mt-0.5">Avg Rating</p>
              </div>
              <div className="w-px h-8 bg-white/8" />
              <div className="text-center px-3">
                <p
                  className="text-2xl font-black text-yellow-400"
                  style={{ fontFamily: "Poppins" }}
                >
                  {products.length}
                </p>
                <p className="text-xs text-white/40 mt-0.5">Products</p>
              </div>
            </div>
          </motion.aside>

          {/* ── Right: Form + History ─────────────── */}
          <div className="space-y-12">
            {/* Submit Feedback Card */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.55,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="glass-card p-10 sm:p-12 rounded-[32px] shadow-[0_30px_80px_rgba(0,0,0,0.32)] border border-white/10"
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-10 border-b border-white/10 pb-6">
                <div>
                  <h2
                    className="text-3xl font-black"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Submit Feedback
                  </h2>
                  <p className="text-sm text-white/50 mt-1.5">
                    Help us improve with your honest thoughts.
                  </p>
                </div>
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                  style={{
                    background: "rgba(254,202,87,0.12)",
                    color: "#feca57",
                    border: "1px solid rgba(254,202,87,0.25)",
                  }}
                >
                  <Star size={15} fill="#feca57" />
                  {RATING_LABELS[rating]}
                </div>
              </div>

              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="flex items-center gap-3 p-4 rounded-2xl mb-6"
                    style={{
                      background: "rgba(52,211,153,0.1)",
                      border: "1px solid rgba(52,211,153,0.25)",
                    }}
                  >
                    <CheckCircle
                      size={18}
                      className="text-emerald-400 flex-shrink-0"
                    />
                    <p className="text-sm text-emerald-400 font-semibold">
                      Thank you! Your feedback has been submitted.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={submitFeedback} className="space-y-8">
                {/* Product Selector */}
                <div className="space-y-4">
                  <label className="block text-[11px] font-semibold text-white/60 uppercase tracking-[0.22em]">
                    Select Product
                  </label>
                  <div className="relative">
                    <select
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="input-field pr-10 appearance-none cursor-pointer"
                      required
                      aria-label="Select product for feedback"
                    >
                      <option value="" disabled>
                        {loading ? "Loading products…" : "Choose a product…"}
                      </option>
                      {products.map((p) => (
                        <option
                          key={p.id}
                          value={p.id}
                          style={{ background: "#0e0c20" }}
                        >
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={15}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none"
                    />
                  </div>
                  {hasProducts && (
                    <p className="text-xs text-white/40">
                      You are reviewing:{" "}
                      <span className="text-white">{selectedProductName}</span>
                    </p>
                  )}
                </div>

                {/* Star Rating */}
                <div className="space-y-4">
                  <label className="block text-[11px] font-semibold text-white/60 uppercase tracking-[0.22em]">
                    Your Rating
                  </label>
                  <div className="rounded-[28px] bg-white/5 p-4 border border-white/10">
                    <div className="flex flex-wrap items-center gap-3">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <motion.button
                          key={val}
                          type="button"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setRating(val)}
                          onMouseEnter={() => setHoveredRating(val)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="focus:outline-none"
                        >
                          <Star
                            size={32}
                            style={{
                              color:
                                val <= (hoveredRating || rating)
                                  ? "#facc15"
                                  : "rgba(255,255,255,0.18)",
                              filter:
                                val <= (hoveredRating || rating)
                                  ? "drop-shadow(0 0 6px rgba(250,204,21,0.5))"
                                  : "none",
                            }}
                            fill={
                              val <= (hoveredRating || rating)
                                ? "#facc15"
                                : "none"
                            }
                            className="transition-all duration-150"
                          />
                        </motion.button>
                      ))}
                      <span className="ml-3 text-sm text-white/50 font-medium">
                        {RATING_LABELS[hoveredRating || rating]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Comment */}
                <div className="space-y-4 pt-2">
                  <label className="block text-[11px] font-semibold text-white/60 uppercase tracking-[0.22em]">
                    Your Message
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={6}
                    maxLength={500}
                    className="input-field resize-none min-h-[170px]"
                    placeholder="Tell us what went well or what we can improve…"
                    required
                  />
                  <p className="text-right text-xs text-white/25">
                    {comment.length} / 500
                  </p>
                </div>

                {/* Submit */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={submitting || !hasProducts}
                  className={`btn-gold w-full justify-center py-4 text-base font-bold ${!hasProducts || submitting ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                      Sending…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={17} /> Send Feedback
                    </span>
                  )}
                </motion.button>

                {!hasProducts && !loading && (
                  <p className="text-center text-xs text-white/40 mt-2">
                    No products are available for feedback at the moment.
                  </p>
                )}
              </form>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="glass-card p-10 sm:p-12 rounded-[32px] shadow-[0_30px_80px_rgba(0,0,0,0.28)] border border-white/10"
            >
            </motion.section>

            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
                >
                  <motion.div
                    initial={{ scale: 0.85 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.85 }}
                    className="bg-[#15132b] rounded-3xl p-8 w-[420px] text-center border border-white/10"
                  >
                    <div className="text-6xl mb-4">
                      {sentiment === "Positive" ? "😊" : "😞"}
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-3">
                      Feedback Analysis
                    </h2>

                    <div
                      className={`text-2xl font-bold py-4 rounded-xl ${
                        sentiment === "Positive"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-rose-500/20 text-rose-400"
                      }`}
                    >
                      {sentiment === "Positive"
                        ? "Positive Feedback"
                        : "Negative Feedback"}
                    </div>

                    <button
                      onClick={() => setShowResult(false)}
                      className="btn-gold mt-8 w-full"
                    >
                      OK
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
