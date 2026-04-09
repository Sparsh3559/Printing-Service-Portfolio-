import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import SideStrips from "../components/SideStrips"
import { supabase } from "@/lib/supabase"
import { Star, Send, Check } from "lucide-react"

const DARK = "#065999"
const BRAND = "#5fc7f4"

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
    const [form, setForm] = useState({ name: "", mobile: "", product: "", review: "", rating: 0 })
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [reviews, setReviews] = useState([])

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

        if (!form.name.trim()) e.name = "Name is required"
        if (!form.review.trim()) e.review = "Please write your feedback"
        if (form.rating === 0) e.rating = "Please select a rating"

        // ✅ Indian mobile validation
        if (form.mobile.trim()) {
            const mobile = form.mobile.replace(/\D/g, "")

            if (mobile.length !== 10) {
                e.mobile = "Enter a valid 10-digit mobile number"
            } else if (!/^[6-9]\d{9}$/.test(mobile)) {
                e.mobile = "Enter a valid Indian mobile number"
            }
        }

        setErrors(e)
        return Object.keys(e).length === 0
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!validate()) return

        setSubmitting(true)

        const cleanedMobile = form.mobile.replace(/\D/g, "") || null

        const { error } = await supabase.from("Reviews").insert({
            name: form.name.trim(),
            mobile: cleanedMobile,
            product: form.product.trim() || null,
            review: form.review.trim(),
            rating: form.rating,
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

            <div className="py-10 md:py-12 px-5 text-white text-center"
                style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${BRAND} 100%)` }}>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">Share Your Experience</h1>
                <p className="text-white/70 text-sm">Your feedback helps us improve and helps others choose wisely.</p>
            </div>

            <div className="max-w-2xl mx-auto px-4 md:px-6 py-10 md:py-14">

                {submitted ? (
                    <div className="rounded-2xl border-2 p-10 text-center" style={{ borderColor: BRAND }}>
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                            style={{ backgroundColor: `${BRAND}20` }}>
                            <Check size={28} style={{ color: DARK }} />
                        </div>
                        <h2 className="text-xl font-bold mb-2" style={{ color: DARK }}>Thank You!</h2>

                        {/* ✅ CLEAN TEXT */}
                        <p className="text-zinc-500 text-sm leading-relaxed">
                            Your feedback has been successfully submitted and noted. We appreciate your input and value the time you took to share it with us.
                        </p>
                        <p className="text-zinc-500 text-sm leading-relaxed mt-2">
                            Our team will review it, and we will reach out if any further information is required.
                        </p>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-zinc-100 shadow-sm p-6 md:p-8 mb-12">
                        <h2 className="text-lg font-bold mb-6" style={{ color: DARK }}>Write a Review</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Name */}
                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 mb-1">Your Name *</label>
                                <input value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    className={`w-full border rounded-xl px-4 py-3 text-sm ${errors.name ? "border-red-400" : "border-zinc-200"}`} />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            {/* Mobile */}
                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 mb-1">Mobile Number</label>
                                <input
                                    value={form.mobile}
                                    onChange={e => {
                                        const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                                        setForm(f => ({ ...f, mobile: value }))
                                    }}
                                    placeholder="9876543210"
                                    className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm"
                                />
                                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 mb-2">Your Rating *</label>
                                <StarPicker value={form.rating} onChange={r => setForm(f => ({ ...f, rating: r }))} />
                                {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
                            </div>

                            {/* Review */}
                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 mb-1">Your Review *</label>
                                <textarea value={form.review}
                                    onChange={e => setForm(f => ({ ...f, review: e.target.value }))}
                                    rows={5}
                                    className={`w-full border rounded-xl px-4 py-3 text-sm ${errors.review ? "border-red-400" : "border-zinc-200"}`} />
                                {errors.review && <p className="text-red-500 text-xs mt-1">{errors.review}</p>}
                            </div>

                            <button type="submit" disabled={submitting}
                                className="w-full text-white py-3 rounded-xl"
                                style={{ backgroundColor: DARK }}>
                                {submitting ? "Submitting…" : "Submit Feedback"}
                            </button>
                        </form>
                    </div>
                )}
            </div>

            <Footer />
        </>
    )
}