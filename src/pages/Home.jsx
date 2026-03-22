import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import WhatsAppButton from "../components/WhatsAppButton"
import Footer from "../components/Footer"
import Trustbar from "../components/Trustbar"
import Promosection from "../components/Promosection"
import HowWeWork from "../components/HowWeWork"
import Testimonials from "../components/Testimonials"
import SideStrips from "../components/SideStrips"
import { supabase } from "@/lib/supabase"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

const FALLBACK_IMAGES = {
  "Custom Apparel":                      "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=800",
  "Drinkware":                           "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800",
  "Visiting Cards & ID Cards":           "https://images.unsplash.com/photo-1586769852044-692d6e3703f0?q=80&w=800",
  "Stationery, Letterheads & Notebooks": "https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=800",
  "Labels, Stickers & Carry Bags":       "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?q=80&w=800",
}
const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=800"

/* ─── Reusable carousel that works on both mobile + desktop ─────────────────
   Props:
     services  – enriched array
     current   – active index
     setCurrent
     total
     prev / next
     isMobile  – switches sizing only, logic is identical
   ──────────────────────────────────────────────────────────────────────────── */
function ServiceCarousel({ services, current, setCurrent, total, prev, next, isMobile }) {
  // Card dimensions — mobile uses smaller sizes but same 5-card fan layout
  const CARD_H  = isMobile ? 300  : 420
  const cw      = isMobile ? 240  : 460   // center card width
  const aw      = isMobile ? 110  : 220   // adjacent card width
  const fw      = isMobile ? 65   : 140   // far card width
  const gap     = isMobile ? 10   : 14

  return (
    <div>
      {/* ── Fan stage ── */}
      <div
        className="relative flex items-center justify-center w-full select-none overflow-hidden"
        style={{ height: CARD_H }}
      >
        {[-2, -1, 0, 1, 2].map((offset) => {
          const service    = services[(current + offset + total) % total]
          const isCenter   = offset === 0
          const isAdjacent = Math.abs(offset) === 1
          const isFar      = Math.abs(offset) === 2

          const translateX =
            offset === 0  ? 0 :
            offset === -1 ? -(cw / 2 + aw / 2 + gap) :
            offset ===  1 ?  (cw / 2 + aw / 2 + gap) :
            offset === -2 ? -(cw / 2 + aw + fw / 2 + gap * 2) :
                             (cw / 2 + aw + fw / 2 + gap * 2)

          return (
            <div
              key={service.id + "-" + offset}
              onClick={() => { if (offset < 0) prev(); else if (offset > 0) next() }}
              className="absolute rounded-2xl overflow-hidden transition-all duration-500 ease-out"
              style={{
                width:     isCenter ? cw : isAdjacent ? aw : fw,
                height:    CARD_H,
                opacity:   isFar ? 0.35 : isAdjacent ? 0.7 : 1,
                cursor:    isCenter ? "default" : "pointer",
                zIndex:    isCenter ? 10 : isAdjacent ? 5 : 1,
                transform: `translateX(${translateX}px) scale(${isCenter ? 1 : isAdjacent ? 0.95 : 0.88})`,
              }}
            >
              <img
                src={service.image}
                alt={service.title}
                draggable={false}
                className="w-full h-full object-cover"
              />

              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(6,89,153,0.85) 0%, rgba(6,89,153,0.1) 50%, transparent 100%)" }}
              />

              {/* Center card label + CTA */}
              {isCenter && (
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between"
                  style={{ padding: isMobile ? "14px 16px" : "24px" }}>
                  <div>
                    <h3
                      className="text-white font-bold leading-tight"
                      style={{ fontSize: isMobile ? "15px" : "24px" }}
                    >
                      {service.title}
                    </h3>
                  </div>
                  <Link
                    to={service.path}
                    onClick={e => e.stopPropagation()}
                    className="flex-shrink-0 font-semibold rounded-full transition-colors"
                    style={{
                      backgroundColor: "#5fc7f4",
                      color: "#065999",
                      fontSize: isMobile ? "11px" : "14px",
                      padding: isMobile ? "6px 14px" : "10px 20px",
                      marginLeft: isMobile ? "8px" : "16px",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#fff" }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#5fc7f4" }}
                  >
                    Explore →
                  </Link>
                </div>
              )}
            </div>
          )
        })}
      </div>


    </div>
  )
}

/* ─── Home page ──────────────────────────────────────────────────────────── */
export default function Home() {
  const [services,   setServices]   = useState([])
  const [loadingSvc, setLoadingSvc] = useState(true)
  const [current,    setCurrent]    = useState(0)
  const [isMobile,   setIsMobile]   = useState(false)

  /* Detect mobile */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const handler = (e) => setIsMobile(e.matches)
    setIsMobile(mq.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  useEffect(() => {
    async function fetchServices() {
      const { data: cats } = await supabase.from("Categories").select("id, name").order("name")
      if (!cats?.length) { setLoadingSvc(false); return }

      const enriched = await Promise.all(cats.map(async (cat) => {
        const { data: subs } = await supabase.from("Subcategories").select("id").eq("category_id", cat.id).limit(3)
        let image = null
        if (subs?.length) {
          const { data: items } = await supabase.from("Items").select("name").in("subcategory_id", subs.map(s => s.id)).limit(5)
          if (items?.length) {
            const { data: products } = await supabase.from("Products").select("image_url")
              .in("name", items.map(i => i.name)).not("image_url", "is", null).eq("is_active", true).limit(1)
            image = products?.[0]?.image_url || null
          }
        }
        return {
          id:    cat.id,
          title: cat.name,
          image: image || FALLBACK_IMAGES[cat.name] || DEFAULT_FALLBACK,
          path:  `/category/${cat.id}`,
        }
      }))

      setServices(enriched)
      setLoadingSvc(false)
    }
    fetchServices()
  }, [])

  const total = services.length
  const prev  = () => setCurrent(c => (c - 1 + total) % total)
  const next  = () => setCurrent(c => (c + 1) % total)

  /* Auto-advance */
  useEffect(() => {
    if (total < 2) return
    const t = setInterval(next, 4000)
    return () => clearInterval(t)
  }, [current, total])

  return (
    <>
      <SideStrips />
      <Navbar />
      <Hero />
      <Trustbar />

      {/* ── Services Section ── */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">

          {/* Header row */}
          <div className="flex items-end justify-between mb-8 md:mb-12">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: "#5fc7f4" }}>
                What We Offer
              </p>
              <h2 className="text-2xl md:text-4xl font-bold" style={{ color: "#065999" }}>
                Our Services
              </h2>
              <p className="text-zinc-500 mt-2 text-sm max-w-md hidden md:block">
                High-quality custom printing solutions tailored for individuals, brands, and businesses.
              </p>
            </div>
            {/* Prev/Next arrows — visible on all sizes */}
            {total > 1 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={prev}
                  className="w-9 h-9 md:w-11 md:h-11 rounded-full border-2 flex items-center justify-center transition-all"
                  style={{ borderColor: "#5fc7f4", color: "#065999" }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#065999"; e.currentTarget.style.borderColor = "#065999"; e.currentTarget.style.color = "#fff" }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "#5fc7f4"; e.currentTarget.style.color = "#065999" }}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={next}
                  className="w-9 h-9 md:w-11 md:h-11 rounded-full border-2 flex items-center justify-center transition-all"
                  style={{ borderColor: "#5fc7f4", color: "#065999" }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#065999"; e.currentTarget.style.borderColor = "#065999"; e.currentTarget.style.color = "#fff" }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "#5fc7f4"; e.currentTarget.style.color = "#065999" }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Body */}
          {loadingSvc ? (
            <div className="flex items-center justify-center h-48 md:h-80">
              <Loader2 size={28} className="animate-spin" style={{ color: "#5fc7f4" }} />
            </div>
          ) : services.length === 0 ? (
            <div className="flex items-center justify-center text-sm text-zinc-400 h-40">
              No categories yet.
            </div>
          ) : (
            /* ── Single carousel for BOTH mobile and desktop ── */
            <ServiceCarousel
              services={services}
              current={current}
              setCurrent={setCurrent}
              total={total}
              prev={prev}
              next={next}
              isMobile={isMobile}
            />
          )}
        </div>
      </section>

      {/* ── Corporate Gifting Promo ── */}
      <Promosection
        tag="Corporate Solutions"
        heading="Corporate Gifting for Every Occasion"
        description="Build lasting impressions with premium branded merchandise. From onboarding kits to festive hampers — crafted for teams of all sizes. Order in bulk or single pieces."
        ctaText="Explore Corporate Gifts"
        ctaPath="/corporate-giftings"
        heroImage="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200"
        tiles={[
          { label: "Branded Merchandise",    image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=800", path: "/corporate-giftings" },
          { label: "Office Stationery Kits", image: "https://images.unsplash.com/photo-1586769852044-692d6e3703f0?q=80&w=800", path: "/corporate-giftings" },
          { label: "Custom Drinkware",       image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800", path: "/corporate-giftings" },
          { label: "Festive Hampers",        image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=800", path: "/corporate-giftings" },
        ]}
      />

      <HowWeWork />
      <Testimonials />
      <WhatsAppButton />
      <Footer />
    </>
  )
}