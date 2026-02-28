import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import WhatsAppButton from "../components/WhatsAppButton"
import Footer from "../components/Footer"
import Trustbar from "../components/Trustbar"
import Promosection from "../components/Promosection"
import { services } from "../data/services"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function Home() {
  const [current, setCurrent] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const total = services.length

  const prev = () => setCurrent((c) => (c - 1 + total) % total)
  const next = () => setCurrent((c) => (c + 1) % total)

  useEffect(() => {
    const t = setInterval(next, 4000)
    return () => clearInterval(t)
  }, [current])

  function onDragStart(e) {
    setIsDragging(true)
    setDragStartX(e.type === "touchstart" ? e.touches[0].clientX : e.clientX)
  }
  function onDragEnd(e) {
    if (!isDragging) return
    setIsDragging(false)
    const endX = e.type === "touchend" ? e.changedTouches[0].clientX : e.clientX
    const diff = dragStartX - endX
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
  }
  const getIdx = (offset) => (current + offset + total) % total

  return (
    <>
      <Navbar />
      <Hero />

      {/* ── Trust Bar ── */}
      <Trustbar />

      {/* ── Services Carousel ── */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400 mb-2">What We Offer</p>
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900">Our Services</h2>
              <p className="text-zinc-500 mt-2 text-sm max-w-md">
                High-quality custom printing solutions tailored for individuals, brands, and businesses.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <button onClick={prev} className="w-11 h-11 rounded-full border-2 border-zinc-200 flex items-center justify-center hover:border-zinc-900 hover:bg-zinc-900 hover:text-white transition-all duration-200">
                <ChevronLeft size={18} />
              </button>
              <button onClick={next} className="w-11 h-11 rounded-full border-2 border-zinc-200 flex items-center justify-center hover:border-zinc-900 hover:bg-zinc-900 hover:text-white transition-all duration-200">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div
          className="relative flex items-center justify-center"
          style={{ height: "420px", gap: "20px" }}
          onMouseDown={onDragStart}
          onMouseUp={onDragEnd}
          onMouseLeave={() => setIsDragging(false)}
          onTouchStart={onDragStart}
          onTouchEnd={onDragEnd}
        >
          {[-2, -1, 0, 1, 2].map((offset) => {
            const service = services[getIdx(offset)]
            const isCenter = offset === 0
            const isAdjacent = Math.abs(offset) === 1
            const isFar = Math.abs(offset) === 2
            return (
              <div
                key={service.id + "-" + offset}
                onClick={() => { if (offset < 0) prev(); else if (offset > 0) next() }}
                className="absolute rounded-2xl overflow-hidden transition-all duration-500 ease-out"
                style={{
                  width: isCenter ? "clamp(300px, 38vw, 520px)" : isAdjacent ? "clamp(180px, 22vw, 300px)" : "clamp(120px, 14vw, 200px)",
                  height: isCenter ? "420px" : isAdjacent ? "340px" : "260px",
                  opacity: isFar ? 0.3 : isAdjacent ? 0.72 : 1,
                  cursor: isCenter ? "default" : "pointer",
                  zIndex: isCenter ? 10 : isAdjacent ? 5 : 1,
                  transform: `translateX(${
                    offset === 0 ? "0" :
                    offset === -1 ? "calc(-clamp(300px, 38vw, 520px) / 2 - clamp(180px, 22vw, 300px) / 2 - 20px)" :
                    offset === 1 ? "calc(clamp(300px, 38vw, 520px) / 2 + clamp(180px, 22vw, 300px) / 2 + 20px)" :
                    offset === -2 ? "calc(-clamp(300px, 38vw, 520px) / 2 - clamp(180px, 22vw, 300px) - clamp(120px, 14vw, 200px) / 2 - 40px)" :
                    "calc(clamp(300px, 38vw, 520px) / 2 + clamp(180px, 22vw, 300px) + clamp(120px, 14vw, 200px) / 2 + 40px)"
                  }) scale(${isCenter ? 1 : isAdjacent ? 0.97 : 0.92})`,
                }}
              >
                <img src={service.image} alt={service.title} draggable={false} className="w-full h-full object-cover" />
                {isCenter && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                      <div>
                        <p className="text-white/50 text-xs uppercase tracking-widest mb-1 font-medium">
                          {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                        </p>
                        <h3 className="text-white text-2xl font-bold">{service.title}</h3>
                      </div>
                      <Link to={service.path} onClick={(e) => e.stopPropagation()} className="flex-shrink-0 ml-4 bg-white text-zinc-900 text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-zinc-900 hover:text-white transition-colors duration-200">
                        Explore →
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-center gap-2 mt-10">
          {services.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`rounded-full transition-all duration-300 ${i === current ? "w-8 h-2 bg-zinc-900" : "w-2 h-2 bg-zinc-300 hover:bg-zinc-500"}`} />
          ))}
        </div>
      </section>

      {/* ── Women's Day Promo ── */}
      <Promosection
        tag="Women's Day Special"
        heading="Women's Day Gifts for Your Employees"
        description="Thoughtfully curated gifts that show you value your women workforce. Premium hampers, personalized gifts, and elegant accessories. Order as low as single quantity."
        ctaText="View Range"
        ctaPath="/corporate-giftings"
        heroImage="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1200"
        bgColor="bg-rose-50"
        tiles={[
          {
            label: "Premium Gift Hampers",
            image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=800",
            path: "/corporate-giftings",
          },
          {
            label: "Budget-Friendly Options Under ₹500",
            image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=800",
            path: "/corporate-giftings",
          },
          {
            label: "Personalized Gifts for Your Team",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800",
            path: "/corporate-giftings",
          },
          {
            label: "Premium Handbags",
            image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800",
            path: "/corporate-giftings",
          },
        ]}
      />

      {/* ── Corporate Gifting Promo ── */}
      <PromoSection
        tag="Corporate Solutions"
        heading="Corporate Gifting for Every Occasion"
        description="Build lasting impressions with premium branded merchandise. From onboarding kits to festive hampers — crafted for teams of all sizes. Order in bulk or single pieces."
        ctaText="Explore Corporate Gifts"
        ctaPath="/corporate-giftings"
        heroImage="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200"
        bgColor="bg-blue-50"
        tiles={[
          {
            label: "Branded Merchandise",
            image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=800",
            path: "/merchandise",
          },
          {
            label: "Office Stationery Kits",
            image: "https://images.unsplash.com/photo-1586769852044-692d6e3703f0?q=80&w=800",
            path: "/office-branding",
          },
          {
            label: "Custom Drinkware",
            image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800",
            path: "/mugs",
          },
          {
            label: "Festive Hampers",
            image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=800",
            path: "/corporate-giftings",
          },
        ]}
      />

      <WhatsAppButton />
      <Footer />
    </>
  )
}