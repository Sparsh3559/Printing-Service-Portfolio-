import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import SideStrips from "../components/SideStrips"
import { supabase } from "@/lib/supabase"
import { nameToSlug, slugToName } from "../lib/slugutils"
import {
  MessageCircle, ArrowLeft, Loader2,
  ChevronLeft, ChevronRight,
  Star, Shield, Truck, RefreshCw, Package, Check
} from "lucide-react"

const DARK      = "#065999"
const BRAND     = "#5fc7f4"
const WHATSAPP  = "919131387559"

// ── Star rating display ───────────────────────────────────────────────────────
function Stars({ rating = 4.5, count = 128 }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={15}
            className={
              i < full
                ? "fill-amber-400 text-amber-400"
                : i === full && half
                ? "fill-amber-200 text-amber-400"
                : "fill-zinc-200 text-zinc-200"
            }
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-zinc-700">{rating}</span>
      <span className="text-xs text-zinc-400">({count} reviews)</span>
    </div>
  )
}

export default function ProductPage() {
  const { slug } = useParams()
  const [product,  setProduct]  = useState(null)
  const [related,  setRelated]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeImg,setActiveImg]= useState(0)

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true); setNotFound(false); setActiveImg(0)
      const productName = slugToName(slug)
      const { data, error } = await supabase
        .from("Products").select("*, Categories(id, name)")
        .ilike("name", productName).limit(1).single()

      if (error || !data) { setNotFound(true); setLoading(false); return }
      setProduct(data)

      const { data: rel } = await supabase
        .from("Products").select("name, image_url, tag, price")
        .eq("category_id", data.category_id).neq("name", data.name).limit(8)
      if (rel) setRelated(rel)
      setLoading(false)
    }
    fetchProduct()
  }, [slug])

  const openWhatsApp = () => {
    const msg = `Hello, I'm interested in *${product?.name}*. Please share details and pricing.`
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank")
  }

  if (loading) return (
    <><SideStrips /><Navbar />
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={28} className="animate-spin" style={{ color: BRAND }} />
      </div>
      <Footer /></>
  )

  if (notFound || !product) return (
    <><SideStrips /><Navbar />
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: `${BRAND}20` }}>
          <Package size={28} style={{ color: DARK }} />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Product not found</h2>
        <p className="text-sm text-zinc-500 mb-6">This product may have been removed or renamed.</p>
        <Link to="/" className="text-sm font-semibold underline" style={{ color: DARK }}>← Back to Home</Link>
      </div>
      <Footer /></>
  )

  const fallback = "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=800"
  const images   = product.images?.length
    ? product.images
    : product.image_url ? [product.image_url] : [fallback]

  const prevImg = () => setActiveImg(i => (i - 1 + images.length) % images.length)
  const nextImg = () => setActiveImg(i => (i + 1) % images.length)

  const features = [
    { icon: Check,     text: "Custom logo & name printing" },
    { icon: Package,   text: "Order as low as single quantity" },
    { icon: Truck,     text: "Fast turnaround — 5–7 days" },
    { icon: Shield,    text: "Pan India delivery" },
    { icon: RefreshCw, text: "Free replacement if defective" },
  ]

  return (
    <>
      <SideStrips />
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-zinc-50 border-b px-4 md:px-6 py-3 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-zinc-700 transition-colors">Home</Link>
          <span>/</span>
          {product.Categories && (
            <>
              <Link to={`/category/${product.Categories.id}`}
                className="hover:text-zinc-700 transition-colors truncate max-w-[120px]">
                {product.Categories.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="font-medium truncate max-w-[140px]" style={{ color: DARK }}>{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12">

        {/* Back link */}
        <Link to={product.Categories ? `/category/${product.Categories.id}` : "/"}
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-900 mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to {product.Categories?.name || "Home"}
        </Link>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">

          {/* Left — Image gallery */}
          <div className="md:sticky md:top-28">
            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden bg-zinc-50 aspect-square mb-3 border border-zinc-100">
              <img
                key={activeImg}
                src={images[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              {product.tag && (
                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider text-white px-3 py-1 rounded-full shadow"
                  style={{ backgroundColor: DARK }}>
                  {product.tag}
                </span>
              )}
              {images.length > 1 && (
                <>
                  <button onClick={prevImg}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors border border-zinc-100">
                    <ChevronLeft size={16} className="text-zinc-700" />
                  </button>
                  <button onClick={nextImg}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors border border-zinc-100">
                    <ChevronRight size={16} className="text-zinc-700" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setActiveImg(i)}
                        className="rounded-full transition-all duration-200 h-1.5"
                        style={{
                          width:           i === activeImg ? "20px" : "6px",
                          backgroundColor: i === activeImg ? DARK : "#d4d4d8",
                        }} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {images.map((url, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-zinc-100 transition-all border-2"
                    style={{
                      borderColor: i === activeImg ? BRAND : "transparent",
                      opacity:     i === activeImg ? 1 : 0.65,
                    }}>
                    <img src={url} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Product info */}
          <div className="flex flex-col gap-5">

            {/* Category */}
            {product.Categories && (
              <Link to={`/category/${product.Categories.id}`}
                className="text-[11px] font-bold uppercase tracking-[0.2em] transition-colors w-fit"
                style={{ color: BRAND }}>
                {product.Categories.name}
              </Link>
            )}

            {/* Name */}
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 leading-tight">
              {product.name}
            </h1>

            {/* Stars */}
            <Stars rating={4.7} count={94} />

            {/* Divider */}
            <div className="h-px bg-zinc-100" />

            {/* Price */}
            {product.price ? (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold" style={{ color: DARK }}>₹{product.price}</span>
                <span className="text-sm text-zinc-400 line-through">₹{Math.round(product.price * 1.2)}</span>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">17% OFF</span>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold" style={{ color: DARK }}>Price on Request</p>
                <p className="text-xs text-zinc-400 mt-0.5">Contact us for best pricing on your quantity</p>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <p className="text-sm text-zinc-600 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Features */}
            <div className="rounded-2xl border border-zinc-100 p-4 space-y-2.5 bg-zinc-50/50">
              {features.map(f => (
                <div key={f.text} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${BRAND}20` }}>
                    <f.icon size={12} style={{ color: DARK }} />
                  </div>
                  <span className="text-sm text-zinc-600">{f.text}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button onClick={openWhatsApp}
              className="w-full flex items-center justify-center gap-2.5 text-white font-bold py-4 rounded-2xl transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-lg text-sm"
              style={{ backgroundColor: "#25D366" }}>
              <MessageCircle size={18} /> Enquire on WhatsApp
            </button>
            <p className="text-center text-xs text-zinc-400 -mt-3">
              Typically responds within 1–2 hours · Mon–Sat 10 AM – 8 PM
            </p>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              {[
                { icon: Shield,    label: "Safe & Secure" },
                { icon: RefreshCw, label: "Free Replacement" },
                { icon: Truck,     label: "Pan India Delivery" },
              ].map(b => (
                <div key={b.label}
                  className="flex flex-col items-center gap-1.5 text-center py-3 rounded-xl border border-zinc-100 bg-white">
                  <b.icon size={16} style={{ color: BRAND }} />
                  <span className="text-[10px] text-zinc-500 font-medium leading-tight">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Related products ── */}
        {related.length > 0 && (
          <div className="mt-16 md:mt-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg md:text-xl font-bold text-zinc-900">More in this category</h2>
              {product.Categories && (
                <Link to={`/category/${product.Categories.id}`}
                  className="text-xs font-semibold hover:underline underline-offset-2"
                  style={{ color: DARK }}>
                  View all →
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {related.map(r => (
                <Link key={r.name} to={`/product/${nameToSlug(r.name)}`}
                  className="group rounded-2xl border border-zinc-100 overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 bg-white">
                  <div className="relative aspect-square bg-zinc-50 overflow-hidden">
                    <img src={r.image_url || fallback} alt={r.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {r.tag && (
                      <span className="absolute top-2 left-2 text-[9px] font-bold uppercase text-white px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: DARK }}>
                        {r.tag}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-zinc-800 line-clamp-2 leading-snug mb-1">{r.name}</p>
                    {r.price
                      ? <p className="text-xs font-bold" style={{ color: DARK }}>₹{r.price}</p>
                      : <p className="text-xs text-zinc-400">Price on request</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}