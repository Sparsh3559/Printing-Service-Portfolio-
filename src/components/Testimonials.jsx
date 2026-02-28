// Testimonials.jsx
// Replace the `testimonials` array with real customer reviews.

import { useState, useEffect, useRef } from "react"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Marketing Manager, TechCorp",
    avatar: "RS",
    rating: 5,
    text: "Print Hub delivered 200 custom polo shirts for our company event in just 5 days. The quality was exceptional — stitching, print clarity, fabric feel — all top notch. Will definitely order again.",
    product: "Custom Polo T-Shirts",
  },
  {
    name: "Priya Mehta",
    role: "Founder, Bloom Café",
    avatar: "PM",
    rating: 5,
    text: "Ordered branded mugs and bottles for our café merchandise. Every single piece looked exactly like the design mockup. The magic mugs were a huge hit with our customers!",
    product: "Ceramic Mugs & Bottles",
  },
  {
    name: "Arjun Nair",
    role: "HR Head, InnovateTech",
    avatar: "AN",
    rating: 5,
    text: "We placed a bulk order for employee onboarding kits — t-shirts, water bottles, ID card holders, and tote bags. Everything arrived on time, well-packaged, and perfectly printed.",
    product: "Corporate Gifting Kit",
  },
  {
    name: "Sneha Patel",
    role: "Event Coordinator",
    avatar: "SP",
    rating: 5,
    text: "The customized caps and jerseys for our sports day were a massive hit. Quick turnaround, great pricing, and the team was super responsive throughout the process.",
    product: "Sports Apparel",
  },
  {
    name: "Vikram Joshi",
    role: "Owner, The Merch Store",
    avatar: "VJ",
    rating: 5,
    text: "I run a merchandise store and Print Hub has been my go-to for over a year. Consistent quality, no color bleeding, and they handle single orders without any fuss.",
    product: "Custom Merchandise",
  },
  {
    name: "Divya Krishnan",
    role: "Brand Manager",
    avatar: "DK",
    rating: 5,
    text: "Ordered premium stainless steel bottles with our company logo for a client gifting campaign. The engraving and print were flawless. Clients loved them!",
    product: "Premium Steel Bottles",
  },
]

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < count ? "fill-amber-400 text-amber-400" : "text-zinc-200"}
        />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = testimonials.length

  // Auto advance
  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setCurrent((c) => (c + 1) % total), 4500)
    return () => clearInterval(t)
  }, [paused])

  // Visible: show 3 cards at a time
  const getVisible = () => {
    return [0, 1, 2].map((offset) => ({
      ...testimonials[(current + offset) % total],
      key: (current + offset) % total,
    }))
  }

  return (
    <section className="py-20 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400 mb-3">
            Customer Stories
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-3">
            What Our Clients Say
          </h2>
          <p className="text-zinc-500 text-sm max-w-md mx-auto">
            Trusted by startups, corporates, and creators across India.
          </p>

          {/* Aggregate rating */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm font-semibold text-zinc-900">5.0</span>
            <span className="text-sm text-zinc-400">· 200+ reviews</span>
          </div>
        </div>

        {/* Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {getVisible().map((t, i) => (
            <div
              key={t.key}
              className={`bg-white rounded-2xl p-6 border transition-all duration-500 flex flex-col ${
                i === 1
                  ? "border-zinc-900 shadow-lg scale-[1.02]"
                  : "border-zinc-100 shadow-sm"
              }`}
            >
              {/* Quote icon */}
              <Quote size={24} className="text-zinc-200 mb-4 flex-shrink-0" />

              {/* Review text */}
              <p className="text-sm text-zinc-600 leading-relaxed flex-1 mb-5">
                "{t.text}"
              </p>

              {/* Product tag */}
              <div className="mb-4">
                <span className="text-[11px] bg-zinc-100 text-zinc-500 px-2.5 py-1 rounded-full font-medium">
                  {t.product}
                </span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-zinc-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{t.name}</p>
                    <p className="text-xs text-zinc-400">{t.role}</p>
                  </div>
                </div>
                <StarRating count={t.rating} />
              </div>
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-8 h-2 bg-zinc-900"
                  : "w-2 h-2 bg-zinc-300 hover:bg-zinc-500"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}