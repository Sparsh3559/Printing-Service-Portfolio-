import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import SideStrips from "../components/SideStrips"
import { supabase } from "@/lib/supabase"
import { MessageCircle, Loader2, ArrowLeft } from "lucide-react"

const whatsappNumber = "919999999999"

export default function CategoryPage() {
  const { id } = useParams()
  const [category,          setCategory]          = useState(null)
  const [subcategories,     setSubcategories]      = useState([])
  const [productsBySubcat,  setProductsBySubcat]   = useState({})
  const [loading,           setLoading]            = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      const { data: cat } = await supabase
        .from("Categories").select("*").eq("id", id).single()
      if (!cat) { setLoading(false); return }
      setCategory(cat)

      const { data: subs } = await supabase
        .from("Categories").select("*").eq("parent_id", id).order("name")
      const allSubs = subs || []
      setSubcategories(allSubs)

      const catIds = [Number(id), ...allSubs.map((s) => s.id)]
      const { data: prods } = await supabase
        .from("Products")
        .select("id, name, image_url, tag, category_id, price")
        .in("category_id", catIds)
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      const grouped = {}
      if (prods) {
        prods.forEach((p) => {
          if (!grouped[p.category_id]) grouped[p.category_id] = []
          grouped[p.category_id].push(p)
        })
      }
      setProductsBySubcat(grouped)
      setLoading(false)
    }
    fetchData()
  }, [id])

  const openWhatsApp = (name) => {
    const msg = `Hello, I'm interested in ${name}. Please share details and pricing.`
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank")
  }

  if (loading) return (
    <><SideStrips /><Navbar />
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-zinc-300" />
      </div>
      <Footer /></>
  )

  if (!category) return (
    <><SideStrips /><Navbar />
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-2">Category not found</h2>
        <Link to="/" className="text-sm underline text-zinc-500">← Home</Link>
      </div>
      <Footer /></>
  )

  const totalProducts = Object.values(productsBySubcat).flat().length

  const sections = [
    ...subcategories.map((sub) => ({
      label: sub.name, catId: sub.id,
      products: productsBySubcat[sub.id] || [],
    })),
    ...(productsBySubcat[Number(id)]?.length ? [{
      label: category.name, catId: Number(id),
      products: productsBySubcat[Number(id)],
    }] : []),
  ].filter((s) => s.products.length > 0)

  return (
    <>
      <SideStrips />
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-zinc-50 border-b px-6 py-3 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <Link to="/" className="hover:text-zinc-700">Home</Link>
          <span>/</span>
          <span className="text-zinc-700 font-medium">{category.name}</span>
        </div>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-900 mb-6 transition-colors">
          <ArrowLeft size={14} /> Back
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-2">{category.name}</h1>
        <p className="text-zinc-500 text-sm">
          {totalProducts} product{totalProducts !== 1 ? "s" : ""} · Custom printing on all items
        </p>
      </div>

      {/* Subcategory circles */}
      {subcategories.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="flex gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {subcategories.map((sub) => {
              const firstProduct = productsBySubcat[sub.id]?.[0]
              return (
                <a key={sub.id} href={`#section-${sub.id}`}
                  className="flex flex-col items-center gap-2 flex-shrink-0 group cursor-pointer">
                  <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-zinc-100 group-hover:ring-[#065999] transition-all duration-300 bg-zinc-100">
                    {firstProduct?.image_url && (
                      <img src={firstProduct.image_url} alt={sub.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    )}
                  </div>
                  <span className="text-xs text-center text-zinc-600 font-medium w-20 leading-tight">{sub.name}</span>
                </a>
              )
            })}
          </div>
        </div>
      )}

      {/* Product sections */}
      {sections.length === 0 ? (
        <div className="max-w-7xl mx-auto px-6 py-20 text-center text-zinc-400">
          <p className="text-sm">No products in this category yet.</p>
          <p className="text-xs mt-1">Products are being added — check back soon.</p>
        </div>
      ) : (
        sections.map((section) => (
          <div key={section.catId} id={`section-${section.catId}`} className="max-w-7xl mx-auto px-6 mb-14">
            <h2 className="text-xl font-bold text-zinc-900 mb-6 pb-2 border-b border-zinc-100">
              {section.label}
              <span className="text-sm font-normal text-zinc-400 ml-2">({section.products.length})</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {section.products.map((p) => (
                <div key={p.id} className="group">
                  <Link to={`/product/${p.id}`}>
                    <div className="relative rounded-2xl overflow-hidden bg-zinc-100 mb-3 aspect-[3/4]">
                      <img src={p.image_url || ""} alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      {p.tag && (
                        <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-white text-zinc-800 px-2 py-0.5 rounded-full shadow-sm">
                          {p.tag}
                        </span>
                      )}
                    </div>
                  </Link>
                  <p className="text-sm font-medium text-zinc-800 leading-snug mb-1 line-clamp-2">{p.name}</p>
                  {p.price && <p className="text-sm font-semibold text-[#065999] mb-1">₹{p.price}</p>}
                  <button onClick={() => openWhatsApp(p.name)}
                    className="flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 font-medium">
                    <MessageCircle size={12} /> Enquire
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* CTA */}
      <section className="mx-6 mb-16 rounded-3xl overflow-hidden" style={{ backgroundColor: "#065999" }}>
        <div className="px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">Need a bulk quote?</h3>
            <p className="text-white/70 text-sm">Share your requirements and we'll respond within 2 hours.</p>
          </div>
          <button onClick={() => openWhatsApp(category.name)}
            className="flex-shrink-0 inline-flex items-center gap-2 bg-green-400 hover:bg-green-300 text-green-950 font-bold text-sm px-8 py-4 rounded-full transition-colors">
            <MessageCircle size={16} /> Chat on WhatsApp
          </button>
        </div>
      </section>

      <Footer />
    </>
  )
}