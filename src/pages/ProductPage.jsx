import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import SideStrips from "../components/SideStrips"
import { supabase } from "@/lib/supabase"
import { nameToSlug, slugToName } from "../lib/slugutils"
import { MessageCircle, ArrowLeft, Loader2 } from "lucide-react"

const whatsappNumber = "919999999999"

export default function ProductPage() {
  const { slug } = useParams()
  const [product,  setProduct]  = useState(null)
  const [related,  setRelated]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      setNotFound(false)

      const productName = slugToName(slug)

      // Single query — fetch product by name (case-insensitive)
      const { data } = await supabase
        .from("Products")
        .select("*, Categories(id, name)")
        .ilike("name", productName)
        .eq("is_active", true)
        .limit(1)
        .single()

      if (!data) { setNotFound(true); setLoading(false); return }

      setProduct(data)

      // Fetch related products from same category
      const { data: rel } = await supabase
        .from("Products")
        .select("name, image_url, tag")
        .eq("category_id", data.category_id)
        .eq("is_active", true)
        .neq("name", data.name)
        .limit(6)

      if (rel) setRelated(rel)
      setLoading(false)
    }
    fetch()
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

  return (
    <>
      <SideStrips />
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-zinc-50 border-b px-6 py-3 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-zinc-700">Home</Link>
          <span>/</span>
          {product.Categories && (
            <>
              <Link to={`/category/${product.Categories.id}`} className="hover:text-zinc-700">
                {product.Categories.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-zinc-700 font-medium">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link
          to={product.Categories ? `/category/${product.Categories.id}` : "/"}
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-900 mb-8 transition-colors"
        >
          <ArrowLeft size={15} /> Back
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

          {/* Image */}
          <div className="rounded-2xl overflow-hidden bg-zinc-100 aspect-square relative">
            <img
              src={product.image_url || "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=800"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.tag && (
              <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider bg-white text-zinc-800 px-3 py-1 rounded-full shadow-sm">
                {product.tag}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="sticky top-28">
            {product.Categories && (
              <Link
                to={`/category/${product.Categories.id}`}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 hover:text-[#065999] transition-colors mb-3 block"
              >
                {product.Categories.name}
              </Link>
            )}

            <h1 className="text-3xl font-bold text-zinc-900 leading-tight mb-4">{product.name}</h1>

            {product.price && (
              <p className="text-2xl font-bold text-[#065999] mb-4">₹{product.price}</p>
            )}

            {product.description && (
              <p className="text-zinc-500 text-sm leading-relaxed mb-6">{product.description}</p>
            )}

            <div className="space-y-2 mb-8">
              {["Custom logo & name printing", "Order as low as single quantity", "Fast turnaround — 5–7 days", "Pan India delivery"].map((f) => (
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
          <div className="mt-20">
            <h2 className="text-xl font-bold text-zinc-900 mb-6">More in this category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {related.map((r) => (
                <Link key={r.name} to={`/product/${nameToSlug(r.name)}`} className="group">
                  <div className="relative rounded-xl overflow-hidden bg-zinc-100 mb-2 aspect-square">
                    <img src={r.image_url || ""} alt={r.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    {r.tag && (
                      <span className="absolute top-2 left-2 text-[9px] font-bold uppercase bg-white text-zinc-700 px-2 py-0.5 rounded-full">
                        {r.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-zinc-800 line-clamp-2 leading-snug">{r.name}</p>
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