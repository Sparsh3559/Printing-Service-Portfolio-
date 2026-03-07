import { useState, useEffect, useRef } from "react"
import { Link, useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import SideStrips from "../components/SideStrips"
import { supabase } from "@/lib/supabase"
import { nameToSlug } from "../lib/slugutils"
import {
  ChevronLeft, ChevronRight,
  MessageCircle, Loader2, ArrowLeft,
} from "lucide-react"

const BRAND       = "#5fc7f4"
const DARK        = "#065999"
const WHATSAPP    = "919999999999"

function openWhatsApp(msg) {
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank")
}

// ── Product card ──────────────────────────────────────────────────────────────
function ProductCard({ name, image_url, tag, price }) {
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
      <p className="text-sm font-medium text-zinc-800 leading-snug line-clamp-2">{name}</p>
      {price && <p className="text-sm font-semibold mt-0.5" style={{ color: DARK }}>₹{price}</p>}
      <p className="text-xs text-zinc-400 mt-0.5">View details →</p>
    </Link>
  )
}

// ── Horizontal scrolling section ──────────────────────────────────────────────
function SubcategorySection({ label, products }) {
  const ref = useRef(null)
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 270, behavior: "smooth" })
  if (!products.length) return null

  return (
    <div className="mb-16">
      <div className="flex items-end justify-between mb-6 px-6 max-w-7xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">
            {label}
            <span className="ml-2 text-sm font-normal text-zinc-400">({products.length})</span>
          </h2>
        </div>
        <div className="hidden md:flex gap-2">
          <button onClick={() => scroll(-1)}
            className="w-9 h-9 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => scroll(1)}
            className="w-9 h-9 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div ref={ref}
        className="flex gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map(p => <ProductCard key={p.id} {...p} />)}
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function CategoryLandingPage({ fixedName } = {}) {
  const { id: urlId } = useParams()

  const [category,      setCategory]      = useState(null)
  const [subcategories, setSubcategories] = useState([])
  const [sections,      setSections]      = useState([])   // [{label, products[]}]
  const [heroImage,     setHeroImage]     = useState(null)
  const [loading,       setLoading]       = useState(true)
  const [notFound,      setNotFound]      = useState(false)

  useEffect(() => { fetchAll() }, [urlId, fixedName])

  async function fetchAll() {
    setLoading(true)
    setNotFound(false)

    // 1. Get category ─────────────────────────────────────────────────────────
    let cat = null
    if (fixedName) {
      const { data } = await supabase
        .from("Categories").select("*").ilike("name", fixedName).limit(1).single()
      cat = data
    } else {
      const { data } = await supabase
        .from("Categories").select("*").eq("id", urlId).single()
      cat = data
    }
    if (!cat) { setNotFound(true); setLoading(false); return }
    setCategory(cat)

    // 2. Get all products in this category (direct FK: Products.category_id = cat.id)
    const { data: products } = await supabase
      .from("Products")
      .select("id, name, image_url, tag, price, category_id")
      .eq("category_id", cat.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    const allProducts = products || []

    // Set hero from first product with image
    const firstWithImage = allProducts.find(p => p.image_url)
    if (firstWithImage) setHeroImage(firstWithImage.image_url)

    // 3. Get subcategories ────────────────────────────────────────────────────
    const { data: subs } = await supabase
      .from("Subcategories")
      .select("id, name")
      .eq("category_id", cat.id)
      .order("name")

    const allSubs = subs || []
    setSubcategories(allSubs)

    if (!allSubs.length) {
      // No subcategories — just show all products in one flat list
      if (allProducts.length) {
        setSections([{ label: cat.name, products: allProducts }])
      } else {
        setSections([])
      }
      setLoading(false)
      return
    }

    // 4. Get Items for each subcategory to know which product names belong where
    const { data: items } = await supabase
      .from("Items")
      .select("name, subcategory_id")
      .in("subcategory_id", allSubs.map(s => s.id))

    const allItems = items || []

    // Build a map: product name → subcategory_id
    const nameToSubcatId = {}
    allItems.forEach(item => { nameToSubcatId[item.name.toLowerCase()] = item.subcategory_id })

    // 5. Group products by subcategory ────────────────────────────────────────
    // Primary: match product name to Items table
    // Fallback: products that don't match any item go into "Other"
    const grouped = {}      // subcatId → products[]
    const unmatched = []

    allSubs.forEach(s => { grouped[s.id] = [] })

    allProducts.forEach(product => {
      const subcatId = nameToSubcatId[product.name.toLowerCase()]
      if (subcatId && grouped[subcatId] !== undefined) {
        grouped[subcatId].push(product)
      } else {
        unmatched.push(product)
      }
    })

    const built = allSubs
      .map(sub => ({ label: sub.name, id: sub.id, products: grouped[sub.id] || [] }))
      .filter(s => s.products.length > 0)

    if (unmatched.length) {
      built.push({ label: "Other", id: "other", products: unmatched })
    }

    setSections(built)
    setLoading(false)
  }

  const totalProducts = sections.reduce((n, s) => n + s.products.length, 0)

  if (loading) return (
    <><SideStrips /><Navbar />
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-zinc-300" />
      </div>
      <Footer /></>
  )

  if (notFound || !category) return (
    <><SideStrips /><Navbar />
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Category not found</h2>
        <Link to="/" className="text-sm font-semibold underline" style={{ color: DARK }}>← Back to Home</Link>
      </div>
      <Footer /></>
  )

  return (
    <>
      <SideStrips />
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative w-full h-[50vh] min-h-[320px] overflow-hidden">
        {heroImage
          ? <img src={heroImage} alt={category.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${BRAND} 100%)` }} />}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20">
          <p className="text-white/60 text-xs uppercase tracking-[0.25em] font-semibold mb-3">Mekal Enterprises</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">{category.name}</h1>
          <p className="text-white/80 text-sm md:text-base max-w-md mb-8">
            Custom printing on all products · Single quantity accepted · Pan India delivery
          </p>
          <button
            onClick={() => openWhatsApp(`Hello, I'm interested in ${category.name}. Please share details.`)}
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold text-sm px-6 py-3 rounded-full w-fit transition-colors">
            <MessageCircle size={16} /> Get a Free Quote
          </button>
        </div>
      </section>

      {/* ── Breadcrumb ── */}
      <div className="bg-zinc-50 border-b px-6 py-3 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <Link to="/" className="hover:text-zinc-700">Home</Link>
          <span>/</span>
          <span className="text-zinc-700 font-medium">{category.name}</span>
        </div>
      </div>

      {/* ── Summary ── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-900 mb-5 transition-colors">
          <ArrowLeft size={14} /> Back
        </Link>
        <h2 className="text-2xl font-bold text-zinc-900">{category.name}</h2>
        <p className="text-zinc-500 text-sm mt-1">
          {totalProducts} product{totalProducts !== 1 ? "s" : ""}
          {subcategories.length > 0 && ` · ${subcategories.length} subcategor${subcategories.length !== 1 ? "ies" : "y"}`}
        </p>
      </div>

      {/* ── Subcategory circles ── */}
      {subcategories.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="flex gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {subcategories.map(sub => {
              const firstImg = sections.find(s => s.id === sub.id)?.products?.[0]?.image_url
              return (
                <a key={sub.id} href={`#section-${sub.id}`}
                  className="flex flex-col items-center gap-2 flex-shrink-0 group cursor-pointer">
                  <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-zinc-100 group-hover:ring-[#5fc7f4] transition-all bg-zinc-100">
                    {firstImg
                      ? <img src={firstImg} alt={sub.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      : <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white"
                          style={{ background: `linear-gradient(135deg, ${DARK}, ${BRAND})` }}>
                          {sub.name.charAt(0)}
                        </div>}
                  </div>
                  <span className="text-xs text-center text-zinc-600 font-medium w-20 leading-tight">{sub.name}</span>
                </a>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Product sections ── */}
      {sections.length === 0 ? (
        <div className="max-w-7xl mx-auto px-6 py-20 text-center text-zinc-400">
          <p className="text-sm">No products in this category yet.</p>
          <p className="text-xs mt-1">Products are being added — check back soon.</p>
        </div>
      ) : (
        sections.map(({ label, id, products }) => (
          <div key={id} id={`section-${id}`}>
            <SubcategorySection label={label} products={products} />
          </div>
        ))
      )}

      {/* ── CTA ── */}
      <section className="mx-6 mb-16 rounded-3xl overflow-hidden" style={{ backgroundColor: DARK }}>
        <div className="px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">Need a bulk quote?</h3>
            <p className="text-white/70 text-sm">Share your requirements and we'll respond within 2 hours.</p>
          </div>
          <button
            onClick={() => openWhatsApp(`Hello, I need a bulk quote for ${category.name}.`)}
            className="flex-shrink-0 inline-flex items-center gap-2 bg-green-400 hover:bg-green-300 text-green-950 font-bold text-sm px-8 py-4 rounded-full transition-colors">
            <MessageCircle size={16} /> Chat on WhatsApp
          </button>
        </div>
      </section>

      <Footer />
    </>
  )
}