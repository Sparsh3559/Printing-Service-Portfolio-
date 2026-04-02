import { useEffect, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Link } from "react-router-dom"

const WHATSAPP = "919131387559"

const FALLBACK_SLIDES = [
  {
    id: "f1",
    image_url: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1440",
    title:       "Custom Apparel Printing",
    subtitle:    "Polo tees, round necks, hoodies & sports jerseys — your logo on every stitch.",
    button_text: "Explore Apparel",
    link:        "/apparels",
  },
  {
    id: "f2",
    image_url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1440",
    title:       "Custom Drinkware",
    subtitle:    "Bottles, tumblers, mugs — branded and ready to impress.",
    button_text: "Explore Drinkware",
    link:        "/drinkware",
  },
  {
    id: "f3",
    image_url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1440",
    title:       "Corporate Gifting Solutions",
    subtitle:    "Premium gifts for every occasion — bulk or single piece.",
    button_text: "Explore Gifts",
    link:        "/corporate-giftings",
  },
]

export default function HeroSlider() {
  const [slides,  setSlides]  = useState([])
  const [index,   setIndex]   = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchBanners() }, [])

  async function fetchBanners() {
    const { data, error } = await supabase
      .from("Banners").select("*").order("sort_order", { ascending: true })

    if (error || !data?.length) {
      setSlides(FALLBACK_SLIDES)
      setLoading(false)
      return
    }

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
    <div className="w-full banner-hero flex items-center justify-center"
      style={{ backgroundColor: "#065999" }}>
      <style>{`.banner-hero{aspect-ratio:1440/580}@media(min-width:768px){.banner-hero{aspect-ratio:unset;height:580px}}`}</style>
      <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    </div>
  )

  const slide = slides[index]

  const hasTitle    = slide.title    && slide.title.trim()    !== ""
  const hasSubtitle = slide.subtitle && slide.subtitle.trim() !== ""
  const hasButton   = slide.button_text && slide.button_text.trim() !== ""
  const hasLink     = slide.link     && slide.link.trim()     !== ""
  const hasContent  = hasTitle || hasSubtitle || hasButton || hasLink

  return (
    <div className="relative w-full overflow-hidden banner-hero">
      <style>{`
        .banner-hero { aspect-ratio: 1440 / 580; }
        @media (min-width: 768px) {
          .banner-hero { aspect-ratio: unset; height: 580px; }
        }
      `}</style>

      {/* ── Slides ── */}
      {slides.map((s, i) => (
        <div key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
          <img
            src={s.image_url}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          {/* Subtle gradient only at bottom so the label + buttons don't clash with banner text */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 35%, transparent 60%)"
            }}
          />
        </div>
      ))}

      {/* ── Bottom overlay: label + buttons anchored to bottom-left ── */}
      <div className="absolute bottom-10 md:bottom-12 left-5 md:left-12 z-20 flex flex-col items-start gap-2 md:gap-3">

        {/* "Mekal Enterprises" label */}
        <p className="text-white/70 text-[9px] md:text-[11px] uppercase tracking-[0.28em] font-semibold">
          Mekal Enterprises
        </p>

        {/* Buttons row */}
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          {/* Explore / link button */}
          {hasLink && (
            <Link
              to={slide.link}
              className="inline-flex items-center bg-white text-[#065999] font-bold text-xs md:text-sm px-4 md:px-6 py-2 md:py-2.5 rounded-full hover:bg-zinc-100 transition-colors shadow-md">
              {hasButton ? slide.button_text : "Explore →"}
            </Link>
          )}

          {/* WhatsApp Get Quote — always shown */}
          <button
            onClick={() => window.open(
              `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hello, I want to get a quote for custom printing.")}`,
              "_blank"
            )}
            className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-400 text-white font-semibold text-xs md:text-sm px-4 md:px-6 py-2 md:py-2.5 rounded-full transition-colors shadow-md">
            <MessageCircle size={14} /> Get Quote
          </button>
        </div>
      </div>

      {/* ── Arrows ── */}
      {slides.length > 1 && (
        <>
          <button onClick={prev}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 bg-black/25 hover:bg-black/50 text-white rounded-full p-1.5 md:p-2.5 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <button onClick={next}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 bg-black/25 hover:bg-black/50 text-white rounded-full p-1.5 md:p-2.5 transition-colors">
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* ── Dots ── */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 md:gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 md:w-8 bg-white" : "w-2 md:w-3 bg-white/40 hover:bg-white/70"
              }`} />
          ))}
        </div>
      )}
    </div>
  )
}