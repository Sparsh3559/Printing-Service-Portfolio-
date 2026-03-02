import { useRef } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import SideStrips from "../components/SideStrips"
import { ChevronLeft, ChevronRight, ArrowUpRight, MessageCircle } from "lucide-react"

const whatsappNumber = "919999999999"
const openWhatsApp = (msg = "Hello, I want details about your Drinkware products.") => {
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank")
}

// ─────────────────────────────────────────────────────────────────────────────
// HOW TO CONNECT TO SUPABASE:
// 1. Go to /admin/categories and add your categories (e.g. "Water Bottles")
// 2. Copy the ID from Supabase and paste it as categoryId below
// 3. Go to /admin/add-product and add products
// 4. Copy each product's ID and paste as productId below
// ─────────────────────────────────────────────────────────────────────────────

const categories = [
  { label: "Water Bottles",     image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=400", categoryId: null },
  { label: "Tumbler & Thermos", image: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?q=80&w=400", categoryId: null },
  { label: "Ceramic Mugs",      image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=400", categoryId: null },
]

const productSections = [
  {
    title: "Water Bottles", subtitle: "Custom printed bottles for every need",
    categoryId: null,
    products: [
      { name: "Sublimation Sipper Water Bottle 600ml / 700ml", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600", tag: "Best Seller", productId: null },
      { name: "Temperature Bottle",                            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600", tag: null,          productId: null },
      { name: "Stainless Steel Water Bottle",                  image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=600", tag: "Popular",    productId: null },
      { name: "Stainless Steel Sports Water Bottle",           image: "https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?q=80&w=600", tag: null,          productId: null },
      { name: "Metallic Bottle",                               image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?q=80&w=600", tag: null,          productId: null },
      { name: "Corporate Stainless Steel Water Bottle",        image: "https://images.unsplash.com/photo-1553531889-65d9c51c4b49?q=80&w=600", tag: "Corporate",   productId: null },
      { name: "Premium Sporty Hydration Stainless Steel Water Bottle", image: "https://images.unsplash.com/photo-1545937022-3b4f6e97a4e1?q=80&w=600", tag: "Premium", productId: null },
      { name: "Premium Stainless Steel Water Bottle",          image: "https://images.unsplash.com/photo-1611735341450-74d61e660ad2?q=80&w=600", tag: null,          productId: null },
      { name: "Office Water Bottle",                           image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600", tag: null,          productId: null },
    ],
  },
  {
    title: "Tumbler & Thermos", subtitle: "Keep it hot or cold — all day long",
    categoryId: null,
    products: [
      { name: "Sublimation Thermos",                               image: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?q=80&w=600", tag: "Best Seller", productId: null },
      { name: "Vacuum Flask Set",                                   image: "https://images.unsplash.com/photo-1585155967849-91c736589c84?q=80&w=600", tag: null,          productId: null },
      { name: "Cup Tumbler",                                        image: "https://images.unsplash.com/photo-1596952954288-16862d37405b?q=80&w=600", tag: null,          productId: null },
      { name: "Vacuum Insulated Steel Tumbler with Handle & Straw", image: "https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?q=80&w=600", tag: "Popular",    productId: null },
    ],
  },
  {
    title: "Ceramic Mugs", subtitle: "Custom printed mugs for gifting & branding",
    categoryId: null,
    products: [
      { name: "Simple White Coffee Mug 11oz", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=600", tag: "Best Seller", productId: null },
      { name: "Simple White Coffee Mug 6oz",  image: "https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?q=80&w=600", tag: null,          productId: null },
      { name: "Simple Heart Handle Mug",      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600", tag: null,          productId: null },
      { name: "Simple Full Heart Handle Mug", image: "https://images.unsplash.com/photo-1521302080334-4bebac2763a6?q=80&w=600", tag: null,          productId: null },
      { name: "Page Mug",                     image: "https://images.unsplash.com/photo-1483648969698-5e7dcaa3444f?q=80&w=600", tag: null,          productId: null },
      { name: "Heart Handle Page Mug",        image: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=600", tag: null,          productId: null },
      { name: "Heart Handle 3 Tone Mug",      image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=600", tag: null,          productId: null },
      { name: "3 Tone Two Color Mug",         image: "https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?q=80&w=600", tag: null,          productId: null },
      { name: "Magic Mug",                    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600", tag: "Popular",    productId: null },
      { name: "Heart Handle Magic Mug",       image: "https://images.unsplash.com/photo-1521302080334-4bebac2763a6?q=80&w=600", tag: null,          productId: null },
      { name: "Full Heart Handle Magic Mug",  image: "https://images.unsplash.com/photo-1483648969698-5e7dcaa3444f?q=80&w=600", tag: null,          productId: null },
      { name: "Neon Mug",                     image: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=600", tag: null,          productId: null },
      { name: "Silver & Gold Mug",            image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=600", tag: "Premium",    productId: null },
      { name: "Frosted Mug",                  image: "https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?q=80&w=600", tag: null,          productId: null },
      { name: "Glass Mug",                    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600", tag: null,          productId: null },
      { name: "Beer Mug",                     image: "https://images.unsplash.com/photo-1521302080334-4bebac2763a6?q=80&w=600", tag: null,          productId: null },
      { name: "Tea Mug",                      image: "https://images.unsplash.com/photo-1483648969698-5e7dcaa3444f?q=80&w=600", tag: null,          productId: null },
    ],
  },
]

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ name, image, tag, productId }) {
  const cardBody = (
    <>
      <div className="relative rounded-2xl overflow-hidden bg-zinc-100 mb-3">
        <img src={image} alt={name}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" />
        {tag && (
          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-white text-zinc-800 px-2.5 py-1 rounded-full shadow-sm">
            {tag}
          </span>
        )}
        <div className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md">
          <MessageCircle size={14} className="text-green-600" />
        </div>
      </div>
      <p className="text-sm font-medium text-zinc-800 leading-snug">{name}</p>
      <p className="text-xs text-zinc-400 mt-0.5">{productId ? "View details →" : "Tap to enquire"}</p>
    </>
  )

  if (productId) {
    return <Link to={`/product/${productId}`} className="flex-shrink-0 w-56 group">{cardBody}</Link>
  }

  return (
    <div className="flex-shrink-0 w-56 group cursor-pointer"
      onClick={() => openWhatsApp(`Hello, I'm interested in ${name}. Please share details and pricing.`)}>
      {cardBody}
    </div>
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
export default function Drinkware() {
  return (
    <>
      <SideStrips />
      <Navbar />

      <section className="relative w-full h-[50vh] min-h-[360px]">
        <img src="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1400" alt="Drinkware" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20">
          <p className="text-white/60 text-xs uppercase tracking-[0.25em] font-semibold mb-3">Custom Printing</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">Drinkware</h1>
          <p className="text-white/80 text-sm md:text-base max-w-md mb-8">Custom printed bottles, tumblers, thermoses and mugs — perfect for corporate gifting, events & branding.</p>
          <button onClick={() => openWhatsApp()}
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold text-sm px-6 py-3 rounded-full w-fit transition-colors">
            <MessageCircle size={16} /> Get a Free Quote
          </button>
        </div>
      </section>

      <div className="bg-zinc-50 border-b px-6 py-3 text-xs text-zinc-400">
        <span className="max-w-7xl mx-auto flex items-center gap-2">
          <Link to="/" className="hover:text-zinc-700">Home</Link> <span>/</span>
          <span className="text-zinc-700 font-medium">Drinkware</span>
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <p className="text-zinc-600 text-sm leading-relaxed max-w-3xl">
          Explore our wide range of custom printed drinkware — from sublimation water bottles and stainless steel flasks to ceramic mugs and magic mugs. Perfect for corporate gifting, event merchandise, and personal branding.
        </p>
      </div>

      {/* Category circles */}
      <div className="max-w-7xl mx-auto px-6 mb-14">
        <div className="flex gap-8 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((cat) => {
            const circle = (
              <>
                <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-zinc-100 group-hover:ring-[#065999] transition-all duration-300">
                  <img src={cat.image} alt={cat.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-xs text-center text-zinc-600 font-medium w-24 leading-tight">{cat.label}</span>
              </>
            )
            return cat.categoryId
              ? <Link key={cat.label} to={`/category/${cat.categoryId}`} className="flex flex-col items-center gap-2 flex-shrink-0 group">{circle}</Link>
              : <div key={cat.label} className="flex flex-col items-center gap-2 flex-shrink-0 group cursor-default">{circle}</div>
          })}
        </div>
      </div>

      {productSections.map((s) => <ProductSection key={s.title} {...s} />)}

      <section className="mx-6 mb-16 rounded-3xl overflow-hidden" style={{ backgroundColor: "#065999" }}>
        <div className="px-10 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Need a custom quote?</h3>
            <p className="text-white/70 text-sm">Tell us your requirements and we'll get back within 2 hours.</p>
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