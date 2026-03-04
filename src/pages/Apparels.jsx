import { useRef, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import SideStrips from "../components/SideStrips"
import { supabase } from "@/lib/supabase"
import { nameToSlug } from "../lib/slugutils"
import { ChevronLeft, ChevronRight, ArrowUpRight, MessageCircle } from "lucide-react"

const whatsappNumber = "919999999999"
const openWhatsApp = (msg = "Hello, I want details about your Custom Apparel.") => {
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank")
}

const categoryDefs = [
  { label: "Polo T-Shirts",     image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=400" },
  { label: "Round Neck",        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400" },
  { label: "Winter Collection", image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?q=80&w=400" },
  { label: "Sports Apparel",    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=400" },
  { label: "Caps",              image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=400" },
]

const sectionDefs = [
  {
    title: "Polo T-Shirts", subtitle: "Premium collar tees for corporate & casual wear",
    categoryName: "Polo T-Shirts",
    products: [
      { name: "Polo Matty 240 GSM",            image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=600", tag: "Best Seller" },
      { name: "Polo Matty 180 GSM",            image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?q=80&w=600", tag: null },
      { name: "Spoon Matty",                   image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=600", tag: null },
      { name: "Shape Matty",                   image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600", tag: null },
      { name: "Premium Cotton Collar T-Shirt", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600", tag: "Premium" },
      { name: "Collar Tipping Polo T-Shirt",   image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=600", tag: null },
    ],
  },
  {
    title: "Round Neck T-Shirts", subtitle: "Everyday comfort in every fabric & weight",
    categoryName: "Round Neck",
    products: [
      { name: "Round Neck Cotton T-Shirt",             image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600", tag: "Best Seller" },
      { name: "French Terry T-Shirt",                  image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=600", tag: null },
      { name: "Off Shoulder T-Shirt",                  image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?q=80&w=600", tag: null },
      { name: "Down Sleeve Round Neck Cotton T-Shirt", image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=600", tag: null },
      { name: "Polyester Round Neck T-Shirt",          image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=600", tag: null },
      { name: "Dot Net Round Neck T-Shirt",            image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600", tag: null },
      { name: "Dryfit Round Neck T-Shirt",             image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?q=80&w=600", tag: "Popular" },
      { name: "Polyester Holi Fabric T-Shirt",         image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=600", tag: null },
    ],
  },
  {
    title: "Winter Collection", subtitle: "Hoodies & sweatshirts for the cold season",
    categoryName: "Winter Collection",
    products: [
      { name: "Hoodies",     image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?q=80&w=600", tag: "Best Seller" },
      { name: "Sweat Shirt", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600", tag: null },
    ],
  },
  {
    title: "Sports Apparel", subtitle: "Performance wear for teams & tournaments",
    categoryName: "Sports Apparel",
    products: [
      { name: "Custom Sport Round Neck T-Shirt",      image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=600", tag: "Best Seller" },
      { name: "Custom Sport Collar T-Shirt",          image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600", tag: null },
      { name: "Custom Sport Stand Collar T-Shirt",    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=600", tag: null },
      { name: "Customer Sport Kit Jersey",            image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=600", tag: "Popular" },
      { name: "Custom Sport Sandow",                  image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=600", tag: null },
      { name: "Sport Honeycomb T-Shirt Stand Collar", image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?q=80&w=600", tag: null },
    ],
  },
  {
    title: "Caps", subtitle: "Cotton & sporty caps with custom logo printing",
    categoryName: "Caps",
    products: [
      { name: "Cotton Cap", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600", tag: "Best Seller" },
      { name: "Sporty Cap", image: "https://images.unsplash.com/photo-1534215754734-18e55d13e346?q=80&w=600", tag: null },
    ],
  },
]

// ── Product Card — navigates directly by name slug, zero DB calls ─────────────
function ProductCard({ name, image, tag }) {
  return (
    <Link to={`/product/${nameToSlug(name)}`} className="flex-shrink-0 w-56 group">
      <div className="relative rounded-2xl overflow-hidden bg-zinc-100 mb-3">
        <img src={image} alt={name}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" />
        {tag && (
          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-white text-zinc-800 px-2.5 py-1 rounded-full shadow-sm">
            {tag}
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-zinc-800 leading-snug">{name}</p>
      <p className="text-xs text-zinc-400 mt-0.5">View details →</p>
    </Link>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────
function ProductSection({ title, subtitle, categoryId, products }) {
  const ref = useRef(null)
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 280, behavior: "smooth" })

  return (
    <div className="mb-16">
      <div className="flex items-end justify-between mb-6 px-6 max-w-7xl mx-auto">
        <div>
          {categoryId ? (
            <Link to={`/category/${categoryId}`} className="group inline-flex items-center gap-2">
              <h2 className="text-2xl font-bold text-zinc-900 group-hover:text-[#065999] transition-colors">{title}</h2>
              <ArrowUpRight size={20} className="text-zinc-400 group-hover:text-[#065999] transition-colors" />
            </Link>
          ) : (
            <h2 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
              {title} <ArrowUpRight size={20} className="text-zinc-400" />
            </h2>
          )}
          <p className="text-sm text-zinc-500 mt-1">{subtitle}</p>
        </div>
        <div className="hidden md:flex gap-2">
          <button onClick={() => scroll(-1)} className="w-9 h-9 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => scroll(1)} className="w-9 h-9 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div ref={ref} className="flex gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((p) => <ProductCard key={p.name} {...p} />)}
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Apparels() {
  const [categoryMap, setCategoryMap] = useState({})

  useEffect(() => {
    async function fetchCategories() {
      const names = [...new Set([...categoryDefs.map(c => c.label), ...sectionDefs.map(s => s.categoryName)])]
      const { data } = await supabase.from("Categories").select("id, name").in("name", names)
      if (data) {
        const map = {}
        data.forEach(c => { map[c.name] = c.id })
        setCategoryMap(map)
      }
    }
    fetchCategories()
  }, [])

  return (
    <>
      <SideStrips />
      <Navbar />

      <section className="relative w-full h-[50vh] min-h-[360px]">
        <img src="https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1400" alt="Custom Apparel" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20">
          <p className="text-white/60 text-xs uppercase tracking-[0.25em] font-semibold mb-3">Custom Printing</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">Custom Apparel</h1>
          <p className="text-white/80 text-sm md:text-base max-w-md mb-8">Premium quality custom clothing for brands, events, corporate teams & personal use.</p>
          <button onClick={() => openWhatsApp()}
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold text-sm px-6 py-3 rounded-full w-fit transition-colors">
            <MessageCircle size={16} /> Get a Free Quote
          </button>
        </div>
      </section>

      <div className="bg-zinc-50 border-b px-6 py-3 text-xs text-zinc-400">
        <span className="max-w-7xl mx-auto flex items-center gap-2">
          <Link to="/" className="hover:text-zinc-700">Home</Link> <span>/</span>
          <span className="text-zinc-700 font-medium">Custom Apparel</span>
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <p className="text-zinc-600 text-sm leading-relaxed max-w-3xl">
          Discover our wide range of customised clothing and apparel — polo t-shirts, round neck tees, hoodies, jerseys, and caps for corporate gifting, sports events, and everyday wear.
        </p>
      </div>

      {/* Category circles */}
      <div className="max-w-7xl mx-auto px-6 mb-14">
        <div className="flex gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categoryDefs.map((cat) => {
            const catId = categoryMap[cat.label]
            const circle = (
              <>
                <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-zinc-100 group-hover:ring-[#065999] transition-all duration-300">
                  <img src={cat.image} alt={cat.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-xs text-center text-zinc-600 font-medium w-20 leading-tight">{cat.label}</span>
              </>
            )
            return catId
              ? <Link key={cat.label} to={`/category/${catId}`} className="flex flex-col items-center gap-2 flex-shrink-0 group">{circle}</Link>
              : <div key={cat.label} className="flex flex-col items-center gap-2 flex-shrink-0 group cursor-default">{circle}</div>
          })}
        </div>
      </div>

      {sectionDefs.map((s) => (
        <ProductSection key={s.title} title={s.title} subtitle={s.subtitle}
          categoryId={categoryMap[s.categoryName] || null} products={s.products} />
      ))}

      <section className="mx-6 mb-16 rounded-3xl overflow-hidden" style={{ backgroundColor: "#065999" }}>
        <div className="px-10 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Need a custom quote?</h3>
            <p className="text-white/70 text-sm">Tell us your requirements and we'll get back to you within 2 hours.</p>
          </div>
          <button onClick={() => openWhatsApp()}
            className="flex-shrink-0 inline-flex items-center gap-2 bg-green-400 hover:bg-green-300 text-green-950 font-bold text-sm px-8 py-4 rounded-full transition-colors">
            <MessageCircle size={16} /> Chat on WhatsApp
          </button>
        </div>
      </section>

      <Footer />
    </>
  )
}