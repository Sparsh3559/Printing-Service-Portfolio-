import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Link } from "react-router-dom"

const FALLBACK_SLIDES = [
  {
    id: "f1",
    image_url: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1440",
    title: "Custom Apparel Printing",
    subtitle: "Polo tees, round necks, hoodies & sports jerseys — your logo on every stitch.",
    button_text: "Explore Apparel",
    link: "/apparels",
  },
  {
    id: "f2",
    image_url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1440",
    title: "Custom Drinkware",
    subtitle: "Bottles, tumblers, mugs — branded and ready to impress.",
    button_text: "Explore Drinkware",
    link: "/drinkware",
  },
  {
    id: "f3",
    image_url: "https://images.unsplash.com/photo-1586769852044-692d6e3703f0?q=80&w=1440",
    title: "Visiting Cards & ID Cards",
    subtitle: "Premium quality cards — glossy, matte, UV, NFC and more.",
    button_text: "Explore Cards",
    link: "/visiting-cards",
  },
]

export default function HeroSlider() {
  const [slides,  setSlides]  = useState([])
  const [index,   setIndex]   = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchBanners() }, [])

  async function fetchBanners() {
    const { data, error } = await supabase
      .from("Banners")
      .select("*")
      .order("sort_order", { ascending: true })

    if (error || !data?.length) {
      setSlides(FALLBACK_SLIDES)
      setLoading(false)
      return
    }

    const withUrls = data.map(slide => {
      if (slide.image_url && !slide.image_url.startsWith("http")) {
        const { data: urlData } = supabase.storage.from("banners").getPublicUrl(slide.image_url)
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
    <div className="w-full flex items-center justify-center" style={{ backgroundColor: "#065999", aspectRatio: "1440/580", maxHeight: "580px" }}>
      <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    </div>
  )

  const slide = slides[index]

  return (
    /*
     * KEY FIX:
     * Mobile  → aspect-ratio: 1440/580 — container scales with the image, full banner visible, nothing cropped
     * Desktop → override to fixed 580px height via media query class
     *
     * object-cover fills the container; since the container IS the image's aspect ratio on mobile,
     * the full image is always visible.
     */
    <div className="relative w-full overflow-hidden banner-hero">
      <style>{`
        .banner-hero { aspect-ratio: 1440 / 580; }
        @media (min-width: 768px) {
          .banner-hero { aspect-ratio: unset; height: 580px; }
        }
      `}</style>

      {/* Slides */}
      {slides.map((s, i) => (
        <div key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
          <img
            src={s.image_url}
            alt={s.title || "Banner"}
            className="w-full h-full object-cover"
            // On mobile use object-contain so nothing is cropped
            style={{ objectFit: "cover" }}
          />
          {/* Gradient overlay — lighter on mobile so image stays readable */}
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)" }} />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center px-5 md:px-20">
        <p className="text-white/60 text-[10px] md:text-xs uppercase tracking-[0.25em] font-semibold mb-2 md:mb-3">
          Mekal Enterprises
        </p>
        <h1 className="text-xl md:text-5xl font-bold text-white leading-tight mb-2 md:mb-4 max-w-2xl">
          {slide.title}
        </h1>
        {slide.subtitle && (
          <p className="text-white/80 text-xs md:text-base max-w-lg mb-4 md:mb-8 hidden md:block">
            {slide.subtitle}
          </p>
        )}
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          {slide.link ? (
            <Link to={slide.link}
              className="inline-flex items-center bg-white text-[#065999] font-bold text-xs md:text-sm px-4 md:px-6 py-2 md:py-3 rounded-full hover:bg-zinc-100 transition-colors">
              {slide.button_text || "Explore →"}
            </Link>
          ) : (
            <span className="inline-flex items-center bg-white text-[#065999] font-bold text-xs md:text-sm px-4 md:px-6 py-2 md:py-3 rounded-full">
              {slide.button_text || "Explore →"}
            </span>
          )}
          <button
            onClick={() => window.open(`https://wa.me/919999999999?text=${encodeURIComponent("Hello, I want to know more about your printing services.")}`, "_blank")}
            className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-400 text-white font-semibold text-xs md:text-sm px-4 md:px-6 py-2 md:py-3 rounded-full transition-colors">
            <MessageCircle size={14} /> WhatsApp Us
          </button>
        </div>
      </div>

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button onClick={prev}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/60 text-white rounded-full p-2 md:p-2.5 transition">
            <ChevronLeft size={18} />
          </button>
          <button onClick={next}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/60 text-white rounded-full p-2 md:p-2.5 transition">
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 md:bottom-6 left-5 md:left-20 z-30 flex gap-1.5 md:gap-2">
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