import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import WhatsAppButton from "../components/WhatsAppButton"
import Footer from "../components/Footer"
import Trustbar from "../components/Trustbar"
import PromoSection from "../components/PromoSection"
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

export default function Home() {
  const [services,   setServices]   = useState([])
  const [loadingSvc, setLoadingSvc] = useState(true)
  const [current,    setCurrent]    = useState(0)

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
            {total > 1 && (
              <div className="hidden md:flex items-center gap-3">
                <button onClick={prev}
                  className="w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all hover:text-white"
                  style={{ borderColor: "#5fc7f4", color: "#065999" }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#065999"; e.currentTarget.style.borderColor = "#065999"; e.currentTarget.style.color = "#fff" }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "#5fc7f4"; e.currentTarget.style.color = "#065999" }}>
                  <ChevronLeft size={18} />
                </button>
                <button onClick={next}
                  className="w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all"
                  style={{ borderColor: "#5fc7f4", color: "#065999" }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#065999"; e.currentTarget.style.borderColor = "#065999"; e.currentTarget.style.color = "#fff" }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "#5fc7f4"; e.currentTarget.style.color = "#065999" }}>
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>

          {loadingSvc ? (
            <div className="flex items-center justify-center h-48 md:h-80">
              <Loader2 size={28} className="animate-spin" style={{ color: "#5fc7f4" }} />
            </div>
          ) : services.length === 0 ? (
            <div className="flex items-center justify-center text-sm text-zinc-400 h-40">
              No categories yet.
            </div>
          ) : (
            <>
              {/* ── Mobile: 2-col grid ── */}
              <div className="grid grid-cols-2 gap-3 md:hidden">
                {services.map(service => (
                  <Link key={service.id} to={service.path}
                    className="relative rounded-2xl overflow-hidden group"
                    style={{ height: "200px" }}>
                    <img src={service.image} alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-active:scale-105" />
                    <div className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, rgba(6,89,153,0.85) 0%, rgba(6,89,153,0.15) 55%, transparent 100%)" }} />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white text-sm font-bold leading-tight">{service.title}</h3>
                      <p className="text-xs mt-0.5" style={{ color: "#5fc7f4" }}>Explore →</p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* ── Desktop: Equal-height carousel ── */}
              <div className="hidden md:block">
                <div className="relative flex items-center justify-center w-full select-none"
                  style={{ height: "420px" }}>
                  {[-2, -1, 0, 1, 2].map((offset) => {
                    const service    = services[(current + offset + total) % total]
                    const isCenter   = offset === 0
                    const isAdjacent = Math.abs(offset) === 1
                    const isFar      = Math.abs(offset) === 2

                    // All cards SAME HEIGHT — only width changes
                    const CARD_H = 420
                    const cw = 460; const aw = 220; const fw = 140; const gap = 14
                    const translateX =
                      offset === 0  ? 0 :
                      offset === -1 ? -(cw / 2 + aw / 2 + gap) :
                      offset ===  1 ?  (cw / 2 + aw / 2 + gap) :
                      offset === -2 ? -(cw / 2 + aw + fw / 2 + gap * 2) :
                                       (cw / 2 + aw + fw / 2 + gap * 2)

                    return (
                      <div key={service.id + "-" + offset}
                        onClick={() => { if (offset < 0) prev(); else if (offset > 0) next() }}
                        className="absolute rounded-2xl overflow-hidden transition-all duration-500 ease-out"
                        style={{
                          width:     isCenter ? cw : isAdjacent ? aw : fw,
                          height:    CARD_H, // ← same for all
                          opacity:   isFar ? 0.35 : isAdjacent ? 0.7 : 1,
                          cursor:    isCenter ? "default" : "pointer",
                          zIndex:    isCenter ? 10 : isAdjacent ? 5 : 1,
                          transform: `translateX(${translateX}px)`,
                          // Non-center cards: slight scale down for depth effect
                          scale:     isCenter ? "1" : isAdjacent ? "0.95" : "0.88",
                        }}>
                        <img src={service.image} alt={service.title} draggable={false}
                          className="w-full h-full object-cover" />

                        {/* Theme gradient overlay on all cards */}
                        <div className="absolute inset-0"
                          style={{ background: "linear-gradient(to top, rgba(6,89,153,0.85) 0%, rgba(6,89,153,0.1) 50%, transparent 100%)" }} />

                        {isCenter && (
                          <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                            <div>
                              <p className="text-xs uppercase tracking-widest mb-1 font-medium"
                                style={{ color: "#5fc7f4" }}>
                                {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                              </p>
                              <h3 className="text-white text-2xl font-bold">{service.title}</h3>
                            </div>
                            <Link to={service.path} onClick={e => e.stopPropagation()}
                              className="flex-shrink-0 ml-4 text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
                              style={{ backgroundColor: "#5fc7f4", color: "#065999" }}
                              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#fff" }}
                              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#5fc7f4" }}>
                              Explore →
                            </Link>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Dots */}
                <div className="flex items-center justify-center gap-2 mt-8">
                  {services.map((_, i) => (
                    <button key={i} onClick={() => setCurrent(i)}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width:           i === current ? "2rem" : "0.5rem",
                        height:          "0.5rem",
                        backgroundColor: i === current ? "#065999" : "#5fc7f4",
                        opacity:         i === current ? 1 : 0.5,
                      }} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Corporate Gifting Promo ONLY ── */}
      <PromoSection
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