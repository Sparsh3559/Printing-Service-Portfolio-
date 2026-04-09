import { useEffect, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Link } from "react-router-dom"

const WHATSAPP = "919131387559"

const FALLBACK_SLIDES = [
  { id: "f1", image_url: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1440", button_text: "Explore Apparel", link: "/apparels" },
  { id: "f2", image_url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1440", button_text: "Explore Drinkware", link: "/drinkware" },
  { id: "f3", image_url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1440", button_text: "Explore Gifts", link: "/corporate-giftings" },
]

export default function HeroSlider() {
  const [slides,  setSlides]  = useState([])
  const [index,   setIndex]   = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchBanners() }, [])

  async function fetchBanners() {
    const { data, error } = await supabase.from("Banners").select("*").order("sort_order", { ascending: true })
    if (error || !data?.length) { setSlides(FALLBACK_SLIDES); setLoading(false); return }
    setSlides(data.map(slide => {
      if (slide.image_url && !slide.image_url.startsWith("http")) {
        const { data: urlData } = supabase.storage.from("banners").getPublicUrl(slide.image_url)
        return { ...slide, image_url: urlData.publicUrl }
      }
      return slide
    }))
    setLoading(false)
  }

  const next = useCallback(() => setIndex(p => (p + 1) % slides.length), [slides.length])
  const prev = useCallback(() => setIndex(p => p === 0 ? slides.length - 1 : p - 1), [slides.length])

  useEffect(() => {
    if (slides.length < 2) return
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [slides.length, next])

  if (loading) return (
    <div className="w-full hero-wrap flex items-center justify-center" style={{ backgroundColor: "#065999" }}>
      <style>{`
        .hero-wrap { height: 260px; }
        @media(min-width:768px){ .hero-wrap{ height: 580px; } }
      `}</style>
      <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    </div>
  )

  const slide = slides[index]
  const hasTitle    = slide.title    && slide.title.trim()    !== ""
  const hasSubtitle = slide.subtitle && slide.subtitle.trim() !== ""
  const hasLink     = slide.link     && slide.link.trim()     !== ""
  const hasButton   = slide.button_text && slide.button_text.trim() !== ""
  const hasContent  = hasTitle || hasSubtitle || hasLink || hasButton

  return (
    /*
     * MOBILE HEIGHT FIX:
     * Instead of aspect-ratio (which made mobile too short for landscape images),
     * we use explicit pixel heights:
     *   mobile  → 260px  (enough to be impactful, not squashed)
     *   desktop → 580px
     * The image uses object-cover so it always fills the space beautifully.
     */
    <div className="relative w-full overflow-hidden hero-wrap">
      <style>{`
        .hero-wrap { height: 260px; }
        @media(min-width:480px){ .hero-wrap{ height: 320px; } }
        @media(min-width:768px){ .hero-wrap{ height: 580px; } }
      `}</style>

      {/* Slides */}
      {slides.map((s, i) => (
        <div key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
          <img src={s.image_url} alt="Banner" className="w-full h-full object-cover object-center" />
          {hasContent && (
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(to right, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.22) 55%, transparent 100%)" }} />
          )}
          {/* Subtle bottom vignette always for button readability */}
          <div className="absolute inset-x-0 bottom-0 h-20"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.30) 0%, transparent 100%)" }} />
        </div>
      ))}

      {/* Content */}
      {hasContent ? (
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-4 md:px-20">
          <p className="text-white/60 text-[9px] md:text-xs uppercase tracking-[0.25em] font-semibold mb-1.5 md:mb-3">
            Mekal Enterprises
          </p>
          {hasTitle && (
            <h1 className="text-base md:text-5xl font-bold text-white leading-tight mb-1.5 md:mb-4 max-w-2xl">
              {slide.title}
            </h1>
          )}
          {hasSubtitle && (
            <p className="text-white/80 text-xs md:text-base max-w-lg mb-3 md:mb-8 hidden md:block">
              {slide.subtitle}
            </p>
          )}
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            {hasLink && (
              <Link to={slide.link}
                className="inline-flex items-center bg-white font-bold rounded-full hover:bg-zinc-100 transition-colors"
                style={{ color: "#065999", fontSize: "clamp(10px, 2.5vw, 14px)", padding: "clamp(6px, 1.5vw, 12px) clamp(12px, 3vw, 24px)" }}>
                {hasButton ? slide.button_text : "Explore →"}
              </Link>
            )}
            <button
              onClick={() => window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hello, I want to get a quote for custom printing.")}`, "_blank")}
              className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-full transition-colors"
              style={{ fontSize: "clamp(10px, 2.5vw, 14px)", padding: "clamp(6px, 1.5vw, 12px) clamp(12px, 3vw, 24px)" }}>
              <MessageCircle style={{ width: "clamp(12px, 2vw, 16px)", height: "clamp(12px, 2vw, 16px)" }} />
              Get Quote
            </button>
          </div>
        </div>
      ) : (
        /* Image-only: just the WhatsApp button at bottom-left */
        <div className="absolute z-20" style={{ bottom: "clamp(12px, 4vw, 40px)", left: "clamp(12px, 4vw, 40px)" }}>
          <p className="text-white/50 text-[9px] md:text-xs uppercase tracking-[0.25em] font-semibold mb-2">Mekal Enterprises</p>
          <button
            onClick={() => window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hello, I want to get a quote for custom printing.")}`, "_blank")}
            className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-full transition-colors shadow-lg"
            style={{ fontSize: "clamp(10px, 2.5vw, 14px)", padding: "clamp(7px, 1.5vw, 12px) clamp(14px, 3vw, 24px)" }}>
            <MessageCircle style={{ width: "clamp(12px, 2vw, 16px)", height: "clamp(12px, 2vw, 16px)" }} />
            Get Quote
          </button>
        </div>
      )}

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 bg-black/25 hover:bg-black/50 text-white rounded-full transition-colors" style={{ padding: "clamp(5px, 1.5vw, 10px)" }}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={next} className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 bg-black/25 hover:bg-black/50 text-white rounded-full transition-colors" style={{ padding: "clamp(5px, 1.5vw, 10px)" }}>
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-2 md:bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{ width: i === index ? "1.5rem" : "0.375rem", backgroundColor: i === index ? "#fff" : "rgba(255,255,255,0.4)" }} />
          ))}
        </div>
      )}
    </div>
  )
}