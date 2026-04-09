import { useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import SideStrips from "../components/SideStrips"
import { supabase } from "@/lib/supabase"
import { Star, Send, Check } from "lucide-react"

const DARK  = "#065999"
const BRAND = "#5fc7f4"

// Existing approved testimonials shown below the form
import { useEffect } from "react"

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110">
          <Star
            size={28}
            className={n <= (hovered || value)
              ? "fill-amber-400 text-amber-400"
              : "fill-zinc-200 text-zinc-200"} />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm font-medium text-zinc-600">
          {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][value]}
        </span>
      )}
    </div>
  )
}

export default function FeedbackPage() {
  const [form,       setForm]       = useState({ name: "", mobile: "", product: "", review: "", rating: 0 })
  const [errors,     setErrors]     = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)
  const [reviews,    setReviews]    = useState([])

  useEffect(() => {
    async function fetchApproved() {
      const { data } = await supabase
        .from("Reviews").select("*").eq("is_approved", true)
        .order("created_at", { ascending: false }).limit(20)
      if (data) setReviews(data)
    }
    fetchApproved()
  }, [submitted])

  function validate() {
    const e = {}
    if (!form.name.trim())   e.name   = "Name is required"
    if (!form.review.trim()) e.review = "Please write your feedback"
    if (form.rating === 0)   e.rating = "Please select a rating"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    const { error } = await supabase.from("Reviews").insert({
      name:    form.name.trim(),
      mobile:  form.mobile.trim() || null,
      product: form.product.trim() || null,
      review:  form.review.trim(),
      rating:  form.rating,
    })
    if (error) {
      alert("Something went wrong. Please try again.")
      setSubmitting(false)
      return
    }
    setSubmitted(true)
    setSubmitting(false)
    setForm({ name: "", mobile: "", product: "", review: "", rating: 0 })
  }

  return (
    <>
      <SideStrips />
      <Navbar />

      {/* Hero strip */}
      <div className="py-10 md:py-12 px-5 text-white text-center"
        style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${BRAND} 100%)` }}>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">Share Your Experience</h1>
        <p className="text-white/70 text-sm">Your feedback helps us improve and helps others choose wisely.</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-10 md:py-14">

        {/* ── Form ── */}
        {submitted ? (
          <div className="rounded-2xl border-2 p-10 text-center" style={{ borderColor: BRAND }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${BRAND}20` }}>
              <Check size={28} style={{ color: DARK }} />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: DARK }}>Thank You!</h2>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Your feedback has been submitted and is pending review. Once approved it will appear in our testimonials section.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-100 shadow-sm p-6 md:p-8 mb-12">
            <h2 className="text-lg font-bold mb-6" style={{ color: DARK }}>Write a Review</h2>
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">Your Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${errors.name ? "border-red-400" : "border-zinc-200 focus:border-[#5fc7f4]"}`} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Mobile + Product in 2 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">Mobile Number (optional)</label>
                  <input value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))}
                    placeholder="+91 9XXXXXXXXX" type="tel"
                    className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5fc7f4] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">Product Ordered (optional)</label>
                  <input value={form.product} onChange={e => setForm(f => ({ ...f, product: e.target.value }))}
                    placeholder="e.g. Custom T-Shirts"
                    className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5fc7f4] transition-colors" />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-2">Your Rating *</label>
                <StarPicker value={form.rating} onChange={r => setForm(f => ({ ...f, rating: r }))} />
                {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
              </div>

              {/* Review */}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">Your Review / Feedback *</label>
                <textarea value={form.review} onChange={e => setForm(f => ({ ...f, review: e.target.value }))}
                  rows={5} placeholder="Tell us about your experience with Mekal Enterprises..."
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors resize-none ${errors.review ? "border-red-400" : "border-zinc-200 focus:border-[#5fc7f4]"}`} />
                {errors.review && <p className="text-red-500 text-xs mt-1">{errors.review}</p>}
              </div>

              <p className="text-xs text-zinc-400">Your review will be visible after approval by our team.</p>

              <button type="submit" disabled={submitting}
                className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-2xl transition-all hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: DARK }}>
                {submitting ? "Submitting…" : <><Send size={16} /> Submit Feedback</>}
              </button>
            </form>
          </div>
        )}

        {/* ── Existing reviews ── */}
        {reviews.length > 0 && (
          <div>
            <h2 className="text-base font-bold mb-5" style={{ color: DARK }}>
              Customer Reviews ({reviews.length})
            </h2>
            <div className="space-y-4">
              {reviews.map(r => (
                <div key={r.id} className="border border-zinc-100 rounded-2xl p-4 bg-white">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: DARK }}>
                        {r.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-900">{r.name}</p>
                        {r.product && <p className="text-xs text-zinc-400">{r.product}</p>}
                      </div>
                    </div>
                    <div className="flex gap-0.5 flex-shrink-0">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className={i < r.rating ? "fill-amber-400 text-amber-400" : "fill-zinc-200 text-zinc-200"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-zinc-600 leading-relaxed">"{r.review}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}