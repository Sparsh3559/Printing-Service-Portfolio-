import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Link } from "react-router-dom"

// ── Fallback slides shown when no banners are in Supabase yet ────────────────
const FALLBACK_SLIDES = [
  {
    id: "f1",
    image_url: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1400",
    title: "Custom Apparel Printing",
    subtitle: "Polo tees, round necks, hoodies & sports jerseys — your logo on every stitch.",
    button_text: "Explore Apparel",
    link: "/apparels",
  },
  {
    id: "f2",
    image_url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1400",
    title: "Custom Drinkware",
    subtitle: "Bottles, tumblers, mugs — branded and ready to impress.",
    button_text: "Explore Drinkware",
    link: "/drinkware",
  },
  {
    id: "f3",
    image_url: "https://images.unsplash.com/photo-1586769852044-692d6e3703f0?q=80&w=1400",
    title: "Visiting Cards & ID Cards",
    subtitle: "Premium quality cards — glossy, matte, UV, NFC and more.",
    button_text: "Explore Cards",
    link: "/visiting-cards",
  },
]

export default function HeroSlider() {
  const [slides,   setSlides]   = useState([])
  const [index,    setIndex]    = useState(0)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => { fetchBanners() }, [])

  async function fetchBanners() {
    const { data, error } = await supabase
      .from("Banners")
      .select("*")
      .order("id")

    if (error || !data?.length) {
      console.error("Banner fetch error:", error, "data:", data)
      setSlides(FALLBACK_SLIDES)
      setLoading(false)
      return
    }

    const withUrls = data.map(slide => {
      if (slide.image_url && !slide.image_url.startsWith("http")) {
        const { data: urlData } = supabase.storage
          .from("banners")
          .getPublicUrl(slide.image_url)
        return { ...slide, image_url: urlData.publicUrl }
      }
      return slide
    })

    setSlides(withUrls)
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
    <div className="w-full h-[500px] flex items-center justify-center" style={{ backgroundColor: "#065999" }}>
      <div className="text-center text-white/60">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3" />
      </div>
    </div>
  )

  const slide = slides[index]

  return (
    <div className="relative w-full h-[500px] md:h-[580px] overflow-hidden">

      {/* Slides */}
      {slides.map((s, i) => (
        <div key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
          <img src={s.image_url} alt={s.title}
            className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        </div>
      ))}

      {/* Content — left aligned */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-20">
        <p className="text-white/50 text-xs uppercase tracking-[0.25em] font-semibold mb-3">
          Mekal Enterprises
        </p>
        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4 max-w-2xl">
          {slide.title}
        </h1>
        {slide.subtitle && (
          <p className="text-white/80 text-sm md:text-base max-w-lg mb-8">
            {slide.subtitle}
          </p>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          {slide.link ? (
            <Link to={slide.link}
              className="inline-flex items-center bg-white text-[#065999] font-bold text-sm px-6 py-3 rounded-full hover:bg-zinc-100 transition-colors">
              {slide.button_text || "Explore →"}
            </Link>
          ) : (
            <span className="inline-flex items-center bg-white text-[#065999] font-bold text-sm px-6 py-3 rounded-full">
              {slide.button_text || "Explore →"}
            </span>
          )}
          <button
            onClick={() => window.open(`https://wa.me/919999999999?text=${encodeURIComponent("Hello, I want to know more about your printing services.")}`, "_blank")}
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold text-sm px-6 py-3 rounded-full transition-colors">
            <MessageCircle size={16} /> WhatsApp Us
          </button>
        </div>
      </div>

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/60 text-white rounded-full p-2.5 transition">
            <ChevronLeft size={22} />
          </button>
          <button onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/60 text-white rounded-full p-2.5 transition">
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-8 md:left-20 z-30 flex gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-8 bg-white" : "w-3 bg-white/40 hover:bg-white/70"}`} />
          ))}
        </div>
      )}
    </div>
  )
}