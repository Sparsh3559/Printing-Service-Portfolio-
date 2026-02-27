import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function HeroSlider() {
  const [slides, setSlides] = useState([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    fetchBanners()
  }, [])

  async function fetchBanners() {
    const { data, error } = await supabase
      .from("Banners")
      .select("*")
      .order("id")

    if (error) {
      console.error(error)
      return
    }

    // ✅ If image_url is a storage path (not a full URL), convert it
    const slidesWithUrls = data.map((slide) => {
      if (
        slide.image_url &&
        !slide.image_url.startsWith("http")
      ) {
        const { data: urlData } = supabase.storage
          .from("banners") // 🔁 replace with your actual bucket name
          .getPublicUrl(slide.image_url)
        return { ...slide, image_url: urlData.publicUrl }
      }
      return slide
    })

    setSlides(slidesWithUrls)
  }

  // ✅ useCallback prevents stale closure in the autoplay useEffect
  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prev = useCallback(() => {
    setIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }, [slides.length])

  // Auto-play
  useEffect(() => {
    if (slides.length === 0) return
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [slides.length, next])

  if (slides.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-[500px] bg-gray-100">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* ✅ Use <img> instead of backgroundImage to avoid CORS issues */}
          <img
            src={slide.image_url}
            alt={slide.title}
            crossOrigin="anonymous" // ✅ explicit CORS header request
            className="w-full h-full object-cover"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-12 max-w-2xl">
            <h1 className="text-4xl font-bold text-white mb-3">
              {slide.title}
            </h1>
            <p className="text-lg text-white/80 mb-6">{slide.subtitle}</p>
            <Button className="w-fit">{slide.button_text}</Button>
          </div>
        </div>
      ))}

      {/* Left Arrow */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition"
      >
        <ChevronRight size={24} />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2 items-center">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-[6px] rounded-full transition-all duration-300 ${
              i === index
                ? "w-10 bg-white"
                : "w-4 bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  )
}