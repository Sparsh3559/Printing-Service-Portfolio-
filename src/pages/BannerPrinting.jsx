import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import SideStrips from "../components/SideStrips"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

export default function BannerPrinting() {
  const number = "+919131387559"

  const openWhatsApp = () => {
    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent("Hello, I want details about Banner & Poster Printing services.")}`,
      "_blank"
    )
  }

  return (
    <>
      <SideStrips />
      <Navbar />

      {/* Hero */}
      <section className="relative w-full h-[55vh]">
        <img
          src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1400"
          alt="Banner Printing"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20">
          <p className="text-white/60 text-xs uppercase tracking-[0.25em] font-semibold mb-3">Mekal Enterprises</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">Banner & Poster Printing</h1>
          <p className="text-white/80 text-sm md:text-base max-w-md mb-8">
            Large format printing for events, promotions & branding.
          </p>
          <button onClick={openWhatsApp}
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold text-sm px-6 py-3 rounded-full w-fit transition-colors">
            <MessageCircle size={16} /> Get a Free Quote
          </button>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-lg text-zinc-700 leading-relaxed mb-8">
          High-impact large format printing for events, promotions, storefronts, exhibitions, and outdoor advertising.
          Designed to grab attention and deliver your message clearly.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {[
            "Flex banners & vinyl prints",
            "Indoor & outdoor posters",
            "Weather-resistant materials",
            "Custom sizes available",
            "Fast turnaround — 3–5 days",
            "Pan India delivery",
          ].map(f => (
            <div key={f} className="flex items-center gap-3 bg-zinc-50 rounded-xl px-4 py-3 text-sm text-zinc-700">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "#5fc7f4" }} />
              {f}
            </div>
          ))}
        </div>

        <Button size="lg" className="rounded-full text-white font-semibold"
          style={{ backgroundColor: "#065999" }} onClick={openWhatsApp}>
          <MessageCircle size={16} className="mr-2" /> Get Quote on WhatsApp
        </Button>
      </section>

      {/* CTA */}
      <section className="mx-6 mb-16 rounded-3xl overflow-hidden" style={{ backgroundColor: "#065999" }}>
        <div className="px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">Need large format printing?</h3>
            <p className="text-white/70 text-sm">Tell us your size and design — we'll handle the rest.</p>
          </div>
          <button onClick={openWhatsApp}
            className="flex-shrink-0 inline-flex items-center gap-2 bg-green-400 hover:bg-green-300 text-green-950 font-bold text-sm px-8 py-4 rounded-full transition-colors">
            <MessageCircle size={16} /> Chat on WhatsApp
          </button>
        </div>
      </section>

      <Footer />
    </>
  )
}