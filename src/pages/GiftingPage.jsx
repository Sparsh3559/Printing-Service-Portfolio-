import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import SideStrips from "../components/SideStrips"
import { supabase } from "@/lib/supabase"
import { nameToSlug } from "../lib/slugutils"
import { MessageCircle, ChevronLeft, ChevronRight, Loader2, ArrowRight } from "lucide-react"

const WHATSAPP = "+919131387559"

function openWhatsApp(msg) {
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank")
}

// ── Product card ──────────────────────────────────────────────────────────────
function ProductCard({ name, image_url, tag, price, category }) {
  return (
    <Link to={`/product/${nameToSlug(name)}`} className="flex-shrink-0 w-52 group">
      <div className="relative rounded-2xl overflow-hidden bg-zinc-100 mb-3 aspect-[3/4]">
        {image_url
          ? <img src={image_url} alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          : <div className="w-full h-full flex items-center justify-center text-zinc-300 text-xs">No image</div>}
        {tag && (
          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-white text-zinc-800 px-2.5 py-1 rounded-full shadow-sm">
            {tag}
          </span>
        )}
      </div>
      <p className="text-xs text-zinc-400 mb-0.5">{category}</p>
      <p className="text-sm font-medium text-zinc-800 leading-snug line-clamp-2">{name}</p>
      {price && <p className="text-sm font-semibold mt-0.5 text-[#065999]">₹{price}</p>}
    </Link>
  )
}

// ── Horizontal scroll section ─────────────────────────────────────────────────
function ProductRow({ label, products }) {
  const ref = useRef(null)
  const scroll = (d) => ref.current?.scrollBy({ left: d * 270, behavior: "smooth" })
  if (!products.length) return null
  return (
    <div className="mb-14">
      <div className="flex items-center justify-between mb-5 px-6 max-w-7xl mx-auto">
        <h3 className="text-xl font-bold text-zinc-900">{label}
          <span className="ml-2 text-sm font-normal text-zinc-400">({products.length})</span>
        </h3>
        <div className="hidden md:flex gap-2">
          <button onClick={() => scroll(-1)} className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-900 hover:text-white transition-all">
            <ChevronLeft size={14} />
          </button>
          <button onClick={() => scroll(1)} className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-900 hover:text-white transition-all">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
      <div ref={ref} className="flex gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map(p => <ProductCard key={p.id} {...p} />)}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function GiftingPage({ config }) {
  const [products,  setProducts]  = useState([])
  const [grouped,   setGrouped]   = useState([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      // Fetch products tagged with this gifting tag, join category name
      const { data } = await supabase
        .from("Products")
        .select("id, name, image_url, tag, price, category_id, Categories(name)")
        .eq("tag", config.tag)
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      const all = (data || []).map(p => ({
        ...p,
        category: p.Categories?.name || "Other",
      }))

      setProducts(all)

      // Group by category
      const groups = {}
      all.forEach(p => {
        if (!groups[p.category]) groups[p.category] = []
        groups[p.category].push(p)
      })
      setGrouped(Object.entries(groups).map(([label, items]) => ({ label, items })))
      setLoading(false)
    }
    fetchProducts()
  }, [config.tag])

  return (
    <>
      <SideStrips />
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative w-full min-h-[60vh] overflow-hidden flex items-center">
        <img
          src={config.heroImage}
          alt={config.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{
          background: `linear-gradient(105deg, ${config.overlayFrom} 0%, ${config.overlayTo} 60%, transparent 100%)`
        }} />
        <div className="relative z-10 px-8 md:px-20 py-24 max-w-3xl">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: config.accentColor + "25", color: config.accentColor, border: `1px solid ${config.accentColor}50` }}>
            {config.badge}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-5">
            {config.title}
          </h1>
          <p className="text-white/75 text-base md:text-lg max-w-xl mb-10 leading-relaxed">
            {config.subtitle}
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => openWhatsApp(`Hello, I'm interested in ${config.title}. Please share details.`)}
              className="inline-flex items-center gap-2 font-bold text-sm px-7 py-4 rounded-full transition-all hover:scale-105"
              style={{ backgroundColor: config.accentColor, color: "#fff" }}>
              <MessageCircle size={16} /> Get a Free Quote
            </button>
            <button
              onClick={() => document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold text-sm px-7 py-4 rounded-full backdrop-blur-sm transition-all">
              Browse Products <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Occasions ── */}
      <section className="py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">Perfect For</p>
          <h2 className="text-3xl font-bold text-zinc-900 mb-12">Every Occasion</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {config.occasions.map((occ) => (
              <button
                key={occ.label}
                onClick={() => openWhatsApp(`Hello, I need ${config.title} for ${occ.label}. Please share options.`)}
                className="group relative rounded-2xl overflow-hidden aspect-[4/5] cursor-pointer"
              >
                <img src={occ.image} alt={occ.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-bold text-sm leading-tight">{occ.label}</p>
                  <p className="text-white/60 text-xs mt-0.5 group-hover:text-white/90 transition-colors">
                    Enquire →
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why us strips ── */}
      <section className="py-8" style={{ backgroundColor: "#065999" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {config.perks.map(p => (
              <div key={p.label}>
                <p className="text-2xl font-bold text-white mb-1">{p.value}</p>
                <p className="text-white/60 text-xs uppercase tracking-wider">{p.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Products ── */}
      <section id="products-section" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">Curated Collection</p>
          <h2 className="text-3xl font-bold text-zinc-900">Featured Products</h2>
          <p className="text-zinc-500 text-sm mt-2">
            {loading ? "Loading..." : `${products.length} products · Tag products as "${config.tag}" in admin to show them here`}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={28} className="animate-spin text-zinc-300" />
          </div>
        ) : products.length === 0 ? (
          <div className="max-w-7xl mx-auto px-6 py-16 text-center">
            <div className="bg-zinc-50 rounded-3xl p-12 inline-block">
              <p className="text-zinc-400 text-sm mb-3">No products tagged yet.</p>
              <p className="text-zinc-300 text-xs">
                Go to Admin → Manage Products → edit any product → set tag to <strong className="text-zinc-400">"{config.tag}"</strong>
              </p>
            </div>
          </div>
        ) : (
          grouped.map(({ label, items }) => (
            <ProductRow key={label} label={label} products={items} />
          ))
        )}
      </section>

      {/* ── CTA ── */}
      <section className="mx-6 mb-16 rounded-3xl overflow-hidden relative"
        style={{ background: `linear-gradient(135deg, #065999 0%, #5fc7f4 100%)` }}>
        <div className="px-10 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-3xl font-bold text-white mb-2">{config.ctaHeading}</h3>
            <p className="text-white/70 text-sm max-w-md">{config.ctaSubtext}</p>
          </div>
          <button
            onClick={() => openWhatsApp(`Hello, I need a bulk quote for ${config.title}.`)}
            className="flex-shrink-0 inline-flex items-center gap-2 bg-white font-bold text-sm px-8 py-4 rounded-full hover:bg-zinc-100 transition-colors"
            style={{ color: "#065999" }}>
            <MessageCircle size={16} /> Chat on WhatsApp
          </button>
        </div>
      </section>

      <Footer />
    </>
  )
}