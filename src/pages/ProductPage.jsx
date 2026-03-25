import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import SideStrips from "../components/SideStrips"
import { supabase } from "@/lib/supabase"
import { nameToSlug, slugToName } from "../lib/slugutils"
import { MessageCircle, ArrowLeft, Loader2, ChevronLeft, ChevronRight } from "lucide-react"

const whatsappNumber = "+919131387559"

export default function ProductPage() {
  const { slug } = useParams()
  const [product,    setProduct]    = useState(null)
  const [related,    setRelated]    = useState([])
  const [loading,    setLoading]    = useState(true)
  const [notFound,   setNotFound]   = useState(false)
  const [activeImg,  setActiveImg]  = useState(0)

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
        .from("Products").select("name, image_url, tag")
        .eq("category_id", data.category_id).neq("name", data.name).limit(6)
      if (rel) setRelated(rel)
      setLoading(false)
    }
    fetchProduct()
  }, [slug])

  const openWhatsApp = () => {
    const msg = product?.whatsapp_message ||
      `Hello, I'm interested in ${product?.name}. Please share details and pricing.`
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank")
  }

  if (loading) return (
    <><SideStrips /><Navbar />
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-zinc-300" />
      </div>
    <Footer /></>
  )

  if (notFound || !product) return (
    <><SideStrips /><Navbar />
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Product not found</h2>
        <p className="text-sm text-zinc-500 mb-6">This product may have been removed or renamed.</p>
        <Link to="/" className="text-sm font-semibold text-[#065999] underline">← Back to Home</Link>
      </div>
    <Footer /></>
  )

  // Build image list — prefer images[] array, fallback to image_url
  const fallback = "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=800"
  const images   = product.images?.length
    ? product.images
    : product.image_url
    ? [product.image_url]
    : [fallback]

  const prevImg = () => setActiveImg(i => (i - 1 + images.length) % images.length)
  const nextImg = () => setActiveImg(i => (i + 1) % images.length)

  return (
    <>
      <SideStrips />
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-zinc-50 border-b px-4 md:px-6 py-2.5 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-zinc-700">Home</Link>
          <span>/</span>
          {product.Categories && (
            <>
              <Link to={`/category/${product.Categories.id}`} className="hover:text-zinc-700 truncate max-w-[120px]">
                {product.Categories.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-zinc-700 font-medium truncate max-w-[140px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12">
        <Link to={product.Categories ? `/category/${product.Categories.id}` : "/"}
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-900 mb-5 md:mb-8 transition-colors">
          <ArrowLeft size={15} /> Back
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-14 items-start">

          {/* ── Image Gallery ── */}
          <div>
            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden bg-zinc-100 aspect-square mb-3">
              <img
                key={activeImg}
                src={images[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              {product.tag && (
                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-white text-zinc-800 px-3 py-1 rounded-full shadow-sm">
                  {product.tag}
                </span>
              )}

              {/* Prev / Next arrows (only if multiple images) */}
              {images.length > 1 && (
                <>
                  <button onClick={prevImg}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors">
                    <ChevronLeft size={16} className="text-zinc-700" />
                  </button>
                  <button onClick={nextImg}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors">
                    <ChevronRight size={16} className="text-zinc-700" />
                  </button>

                  {/* Dot indicator */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setActiveImg(i)}
                        className={`rounded-full transition-all duration-200 ${
                          i === activeImg ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/60 hover:bg-white"
                        }`} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail strip (only if 2+ images) */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {images.map((url, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-zinc-100 transition-all ${
                      i === activeImg
                        ? "ring-2 ring-[#5fc7f4] ring-offset-2"
                        : "ring-1 ring-zinc-200 hover:ring-zinc-400 opacity-70 hover:opacity-100"
                    }`}>
                    <img src={url} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="md:sticky md:top-24">
            {product.Categories && (
              <Link to={`/category/${product.Categories.id}`}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 hover:text-[#065999] transition-colors mb-2 md:mb-3 block">
                {product.Categories.name}
              </Link>
            )}

            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 leading-tight mb-3 md:mb-4">{product.name}</h1>

            {product.price && (
              <p className="text-xl md:text-2xl font-bold text-[#065999] mb-3 md:mb-4">₹{product.price}</p>
            )}

            {product.description && (
              <p className="text-zinc-500 text-sm leading-relaxed mb-5 md:mb-6">{product.description}</p>
            )}

            <div className="space-y-2 mb-6 md:mb-8">
              {["Custom logo & name printing", "Order as low as single quantity", "Fast turnaround — 5–7 days", "Pan India delivery"].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-zinc-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>

            <button onClick={openWhatsApp}
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold py-4 rounded-2xl transition-colors text-sm">
              <MessageCircle size={18} /> Enquire on WhatsApp
            </button>
            <p className="text-center text-xs text-zinc-400 mt-3">We typically respond within 1–2 hours</p>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-12 md:mt-20">
            <h2 className="text-lg md:text-xl font-bold text-zinc-900 mb-4 md:mb-6">More in this category</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
              {related.map(r => (
                <Link key={r.name} to={`/product/${nameToSlug(r.name)}`} className="group">
                  <div className="relative rounded-xl overflow-hidden bg-zinc-100 mb-2 aspect-square">
                    <img src={r.image_url || fallback} alt={r.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    {r.tag && (
                      <span className="absolute top-1.5 left-1.5 text-[8px] md:text-[9px] font-bold uppercase bg-white text-zinc-700 px-1.5 py-0.5 rounded-full">
                        {r.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] md:text-xs font-medium text-zinc-800 line-clamp-2 leading-snug">{r.name}</p>
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