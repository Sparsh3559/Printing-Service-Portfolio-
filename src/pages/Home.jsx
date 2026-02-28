import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import WhatsAppButton from "../components/WhatsAppButton"
import Footer from "../components/Footer"
import { services } from "../data/services"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

export default function Home() {
  const scrollRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // ── Arrow scroll ──────────────────────────────────────────────────────────
  function scrollBy(dir) {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir * 320, behavior: "smooth" })
  }

  // ── Drag to scroll ────────────────────────────────────────────────────────
  function onMouseDown(e) {
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  function onMouseMove(e) {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    scrollRef.current.scrollLeft = scrollLeft - (x - startX)
  }

  function onMouseUp() { setIsDragging(false) }

  return (
    <>
      <Navbar />
      <Hero />

      {/* ── Services Carousel Section ── */}
      <section className="py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400 mb-2">
                What We Offer
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold text-zinc-900 leading-tight">
                Our Services
              </h2>
              <p className="text-zinc-500 mt-2 max-w-md text-sm">
                High-quality custom printing solutions tailored for individuals, brands, and businesses.
              </p>
            </div>

            {/* Arrow controls */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scrollBy(-1)}
                className="w-10 h-10 rounded-full border border-zinc-200 bg-white flex items-center justify-center hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all duration-200"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scrollBy(1)}
                className="w-10 h-10 rounded-full border border-zinc-200 bg-white flex items-center justify-center hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all duration-200"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Carousel track */}
          <div className="relative">
            {/* Fade edges */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-zinc-50 to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-zinc-50 to-transparent z-10" />

            <div
              ref={scrollRef}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              className={`flex gap-5 overflow-x-auto pb-4 select-none scroll-smooth
                [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
            >
              {services.map((service, i) => (
                <Link
                  to={service.path}
                  key={service.id}
                  className="group flex-shrink-0 w-64"
                  draggable={false}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="bg-white rounded-2xl overflow-hidden border border-zinc-100 hover:border-zinc-300 hover:shadow-lg transition-all duration-300">

                    {/* Image */}
                    <div className="overflow-hidden h-48">
                      <img
                        src={service.image}
                        alt={service.title}
                        draggable={false}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Label */}
                    <div className="px-5 py-4 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-zinc-800 leading-snug">
                        {service.title}
                      </h3>
                      <div className="w-7 h-7 rounded-full bg-zinc-100 group-hover:bg-zinc-900 flex items-center justify-center transition-colors duration-300 flex-shrink-0 ml-2">
                        <ArrowRight size={13} className="text-zinc-500 group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>

                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile scroll hint */}
          <p className="text-center text-xs text-zinc-400 mt-4 md:hidden">
            Swipe to explore all services →
          </p>

        </div>
      </section>

      <WhatsAppButton />
      <Footer />
    </>
  )
}