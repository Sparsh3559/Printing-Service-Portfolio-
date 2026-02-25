import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function HeroSlider() {
  const slides = [
    {
      title: "Premium Custom Printing",
      subtitle: "Creative, customisable, cost-effective solutions",
      button: "Explore Services",
      image:
        "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1920",
    },
    {
      title: "Corporate Gifting Solutions",
      subtitle: "Perfect for teams, events & branding",
      button: "View Products",
      image:
        "https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=1920",
    },
    {
      title: "High-Quality Apparel Printing",
      subtitle: "Designed for brands, events & individuals",
      button: "Start Designing",
      image:
        "https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=1920",
    },
  ]

  const [index, setIndex] = useState(0)

  const next = () =>
    setIndex((prev) => (prev + 1) % slides.length)

  const prev = () =>
    setIndex((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    )

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative w-full h-[80vh] overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Image */}
          <img
            src={slide.image}
            alt=""
            className="w-full h-full object-cover"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

          {/* Content */}
          <div className="absolute left-[8%] top-1/2 -translate-y-1/2 max-w-xl text-white">
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-4">
              {slide.title}
            </h1>

            <p className="text-lg text-white/80 mb-6">
              {slide.subtitle}
            </p>

            <img src="https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/IMG_2753.HEIC" alt="product" />

            <Button size="lg" className="rounded-full px-8">
              {slide.button}
            </Button>
          </div>
        </div>
      ))}

      {/* Left Arrow */}
      <button
        onClick={prev}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white hover:bg-black/70 transition"
      >
        <ChevronLeft />
      </button>

      {/* Right Arrow */}
      <button
        onClick={next}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white hover:bg-black/70 transition"
      >
        <ChevronRight />
      </button>

      {/* Pagination */}
      <div className="absolute bottom-8 left-[8%] flex gap-3">
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
    </section>
  )
}