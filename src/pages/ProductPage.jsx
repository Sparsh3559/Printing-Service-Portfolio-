import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import SideStrips from "../components/SideStrips"
import { supabase } from "@/lib/supabase"
import { MessageCircle, ArrowLeft, Loader2 } from "lucide-react"

const whatsappNumber = "919999999999"

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      setLoading(true)

      const { data } = await supabase
        .from("Products")
        .select("*, Categories(id, name, parent_id)")
        .eq("id", id)
        .eq("is_active", true)
        .single()

      if (data) {
        setProduct(data)
        const { data: rel } = await supabase
          .from("Products")
          .select("id, name, image_url, tag")
          .eq("category_id", data.category_id)
          .eq("is_active", true)
          .neq("id", Number(id))
          .limit(6)
        if (rel) setRelated(rel)
      }
      setLoading(false)
    }
    fetch()
  }, [id])

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

  if (!product) return (
    <><SideStrips /><Navbar />
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Product not found</h2>
        <Link to="/" className="text-sm font-medium text-zinc-900 underline">← Back to Home</Link>
      </div>
      <Footer /></>
  )

  return (
    <>
      <SideStrips />
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-zinc-50 border-b px-6 py-3 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
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
        <Link to={product.Categories ? `/category/${product.Categories.id}` : "/"}
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-900 mb-8 transition-colors">
          <ArrowLeft size={15} /> Back
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

          {/* Image */}
          <div className="rounded-2xl overflow-hidden bg-zinc-100 aspect-square relative">
            <img
              src={product.image_url || "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=800"}
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
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 mb-3">
                {product.Categories.name}
              </p>
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

            <button
              onClick={openWhatsApp}
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold py-4 rounded-2xl transition-colors text-sm"
            >
              <MessageCircle size={18} /> Enquire on WhatsApp
            </button>
            <p className="text-center text-xs text-zinc-400 mt-3">We typically respond within 1–2 hours</p>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-xl font-bold text-zinc-900 mb-6">More in this category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {related.map((r) => (
                <Link key={r.id} to={`/product/${r.id}`} className="group">
                  <div className="relative rounded-xl overflow-hidden bg-zinc-100 mb-2 aspect-square">
                    <img src={r.image_url || ""} alt={r.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    {r.tag && (
                      <span className="absolute top-2 left-2 text-[9px] font-bold uppercase bg-white text-zinc-700 px-2 py-0.5 rounded-full">
                        {r.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-zinc-800 line-clamp-2">{r.name}</p>
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