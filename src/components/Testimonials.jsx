import { useState, useEffect } from "react"
import { Star, Quote, MessageSquarePlus } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Link } from "react-router-dom"

const DARK  = "#065999"
const BRAND = "#5fc7f4"

// Fallback hardcoded reviews shown if DB has none yet
const FALLBACK = [
  { id: "f1", name: "Rahul Sharma",  role: "Marketing Manager", rating: 5, review: "Ordered 200 custom polo shirts for our company event. Delivered in 5 days — stitching, print clarity and fabric were all top notch. Will definitely order again.", product: "Custom Polo T-Shirts" },
  { id: "f2", name: "Priya Mehta",   role: "Café Owner",        rating: 4, review: "Branded mugs and bottles for our café merchandise looked exactly like the mockup. The magic mugs were a hit! Slight delay in dispatch but overall great experience.", product: "Ceramic Mugs & Bottles" },
  { id: "f3", name: "Arjun Nair",    role: "HR Head",           rating: 5, review: "Bulk order for employee onboarding kits — t-shirts, water bottles, ID holders and tote bags. Everything arrived on time, well-packaged and perfectly printed.", product: "Corporate Gifting Kit" },
  { id: "f4", name: "Sneha Patel",   role: "Event Coordinator", rating: 4, review: "Customized caps and jerseys for our sports day were a hit. Quick turnaround and great pricing. A couple of jerseys had minor colour variation but team resolved it fast.", product: "Sports Apparel" },
  { id: "f5", name: "Vikram Joshi",  role: "Merch Store Owner", rating: 5, review: "My go-to for over a year now. Consistent quality, no colour bleeding, and they handle single orders without any fuss. Highly recommended for small businesses.", product: "Custom Merchandise" },
  { id: "f6", name: "Divya Krishnan",role: "Brand Manager",     rating: 5, review: "Premium steel bottles with our logo for client gifting. The engraving was flawless and packaging was premium. Clients loved them — already planning a repeat order.", product: "Premium Steel Bottles" },
]

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13}
          className={i < count ? "fill-amber-400 text-amber-400" : "fill-zinc-200 text-zinc-200"} />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [reviews,  setReviews]  = useState([])
  const [current,  setCurrent]  = useState(0)
  const [paused,   setPaused]   = useState(false)

  useEffect(() => {
    async function fetchReviews() {
      const { data } = await supabase
        .from("Reviews")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false })

      if (data && data.length > 0) {
        setReviews(data.map(r => ({
          ...r,
          role: r.product || "Verified Customer",
        })))
      } else {
        setReviews(FALLBACK)
      }
    }
    fetchReviews()
  }, [])

  const total = reviews.length

  useEffect(() => {
    if (paused || total < 3) return
    const t = setInterval(() => setCurrent(c => (c + 1) % total), 4500)
    return () => clearInterval(t)
  }, [paused, total])

  const visible = total >= 3
    ? [0, 1, 2].map(offset => ({ ...reviews[(current + offset) % total], key: (current + offset) % total }))
    : reviews.map((r, i) => ({ ...r, key: i }))

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : "5.0"

  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: BRAND }}>
            Customer Stories
          </p>
          <h2 className="text-2xl md:text-4xl font-bold mb-3" style={{ color: DARK }}>
            What Our Clients Say
          </h2>
          <p className="text-zinc-500 text-sm max-w-md mx-auto">
            Trusted by startups, corporates and creators across India.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16}
                className={i < Math.round(parseFloat(avgRating)) ? "fill-amber-400 text-amber-400" : "fill-zinc-200 text-zinc-200"} />
            ))}
            <span className="text-sm font-semibold text-zinc-800 ml-1">{avgRating}</span>
            <span className="text-sm text-zinc-400">· {total} reviews</span>
          </div>
        </div>

        {/* Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}>
          {visible.map((t, i) => (
            <div key={t.key}
              className={`bg-white rounded-2xl p-6 border flex flex-col transition-all duration-500 ${
                i === 1 ? "shadow-lg scale-[1.02]" : "border-zinc-100 shadow-sm"
              }`}
              style={i === 1 ? { borderColor: BRAND } : {}}>
              <Quote size={20} className="mb-4 flex-shrink-0" style={{ color: BRAND }} />
              <p className="text-sm text-zinc-600 leading-relaxed flex-1 mb-5">"{t.review || t.text}"</p>
              {(t.product || t.role) && (
                <div className="mb-4">
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: `${BRAND}12`, color: DARK }}>
                    {t.product || t.role}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: DARK }}>
                    {(t.name || "U").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{t.name}</p>
                    <p className="text-xs text-zinc-400">{t.role}</p>
                  </div>
                </div>
                <StarRating count={t.rating || 5} />
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        {total > 3 && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {reviews.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className="rounded-full transition-all duration-300"
                style={{ width: i === current ? "2rem" : "0.5rem", height: "0.5rem", backgroundColor: i === current ? DARK : BRAND, opacity: i === current ? 1 : 0.4 }} />
            ))}
          </div>
        )}

        {/* Leave Feedback CTA */}
        <div className="flex justify-center">
          <Link to="/leave-feedback"
            className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-full border-2 transition-all hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
            style={{ borderColor: DARK, color: DARK }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = DARK; e.currentTarget.style.color = "#fff" }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = DARK }}>
            <MessageSquarePlus size={16} />
            Share Your Experience
          </Link>
        </div>

      </div>
    </section>
  )
}