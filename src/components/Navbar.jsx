import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { ChevronDown, ChevronRight, Search, X, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { nameToSlug } from "@/lib/slugutils"

// ── Static product data — names must match DB exactly ────────────────────────
const NAV_CATEGORIES = [
  {
    label: "Custom Apparel",
    sections: [
      {
        heading: "Polo T-Shirts",
        items: [
          "Polo Matty 240 GSM",
          "Polo Matty 180 GSM",
          "Spoon Matty",
          "Shape Matty",
          "Premium Cotton Collar T-Shirt",
          "Collar Tipping Polo T-Shirt",
        ],
      },
      {
        heading: "Round Neck T-Shirts",
        items: [
          "Round Neck Cotton T-Shirt",
          "French Terry T-Shirt",
          "Off Shoulder T-Shirt",
          "Down Sleeve Round Neck Cotton T-Shirt",
          "Polyester Round Neck T-Shirt",
          "Dot Net Round Neck T-Shirt",
          "Dryfit Round Neck T-Shirt",
          "Polyester Holi Fabric T-Shirt",
        ],
      },
      {
        heading: "Winter Collection",
        items: ["Hoodies", "Sweat Shirt"],
      },
      {
        heading: "Sports Apparel",
        items: [
          "Custom Sport Round Neck T-Shirt",
          "Custom Sport Collar T-Shirt",
          "Custom Sport Stand Collar T-Shirt",
          "Customer Sport Kit Jersey",
          "Custom Sport Sandow",
          "Sport Honeycomb T-Shirt Stand Collar",
        ],
      },
      {
        heading: "Cap",
        items: ["Cotton Cap", "Sporty Cap"],
      },
    ],
  },
  {
    label: "Drinkware",
    sections: [
      {
        heading: "Water Bottles",
        items: [
          "Sublimation Sipper Water Bottle 600ml / 700ml",
          "Temperature Bottle",
          "Stainless Steel Water Bottle",
          "Stainless Steel Sports Water Bottle",
          "Metallic Bottle",
          "Corporate Stainless Steel Water Bottle",
          "Premium Sporty Hydration Stainless Steel Water Bottle",
          "Premium Stainless Steel Water Bottle",
          "Office Water Bottle",
        ],
      },
      {
        heading: "Tumbler & Thermos",
        items: [
          "Sublimation Thermos",
          "Vacuum Flask Set",
          "Cup Tumbler",
          "Vacuum Insulated Steel Tumbler with Handle & Straw",
        ],
      },
      {
        heading: "Ceramic Mugs",
        items: [
          "Simple White Coffee Mug 11oz",
          "Simple White Coffee Mug 6oz",
          "Simple Heart Handle Mug",
          "Simple Full Heart Handle Mug",
          "Page Mug",
          "Heart Handle Page Mug",
          "Heart Handle 3 Tone Mug",
          "3 Tone Two Color Mug",
          "Magic Mug",
          "Heart Handle Magic Mug",
          "Full Heart Handle Magic Mug",
          "Neon Mug",
          "Silver & Gold Mug",
          "Frosted Mug",
          "Glass Mug",
          "Beer Mug",
          "Tea Mug",
        ],
      },
    ],
  },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [expandedMobile, setExpandedMobile] = useState({})
  const [expandedSection, setExpandedSection] = useState({})
  const [catIdMap, setCatIdMap] = useState({})

  // ── Search ─────────────────────────────────────────────────────────────────
  const [query, setQuery]         = useState("")
  const [results, setResults]     = useState([])
  const [searching, setSearching] = useState(false)
  const [showDrop, setShowDrop]   = useState(false)
  const searchRef                 = useRef(null)
  const debounceRef               = useRef(null)
  const navigate                  = useNavigate()

  // ── Fetch all category IDs once on mount ─────────────────────────────────
  useEffect(() => {
    async function fetchCatIds() {
      const { data } = await supabase.from("Categories").select("id, name")
      if (data) {
        const map = {}
        data.forEach(c => { map[c.name] = c.id })
        setCatIdMap(map)
      }
    }
    fetchCatIds()
  }, [])

  // ── Search: debounce + Supabase query ─────────────────────────────────────
  useEffect(() => {
    if (!query.trim()) { setResults([]); setShowDrop(false); return }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      const { data } = await supabase
        .from("Products")
        .select("id, name, image_url, category_id")
        .ilike("name", `%${query.trim()}%`)
        .eq("is_active", true)
        .limit(8)
      setResults(data || [])
      setShowDrop(true)
      setSearching(false)
    }, 300)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDrop(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  function clearSearch() { setQuery(""); setResults([]); setShowDrop(false) }

  function handleResultClick(name) {
    navigate(`/product/${nameToSlug(name)}`)
    clearSearch()
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && query.trim()) {
      if (results.length === 1) handleResultClick(results[0].name)
      else if (results.length > 1) handleResultClick(results[0].name)
    }
    if (e.key === "Escape") clearSearch()
  }

  const toggleMobile = (label) =>
    setExpandedMobile((prev) => ({ ...prev, [label]: !prev[label] }))

  const toggleSection = (key) =>
    setExpandedSection((prev) => ({ ...prev, [key]: !prev[key] }))

  // Helper — returns Link if we have an ID, otherwise plain span
  function CatLink({ name, className, onClick, children }) {
    const id = catIdMap[name]
    if (id) return <Link to={`/category/${id}`} className={className} onClick={onClick}>{children || name}</Link>
    return <span className={className}>{children || name}</span>
  }

  return (
    <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: "#065999" }}>

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-6 py-3">

        {/* Mobile hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden text-white hover:bg-white/10">☰</Button>
          </SheetTrigger>

          {/* ── Mobile drawer ── */}
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <div className="space-y-1 mt-6 pb-8">
              <h2 className="text-lg font-bold px-3 mb-5">Categories</h2>

              {NAV_CATEGORIES.map((cat) => {
                const isOpen = expandedMobile[cat.label]
                return (
                  <div key={cat.label}>
                    {/* Parent row: label links to category page, arrow toggles expand */}
                    <div className="flex items-center justify-between rounded-lg hover:bg-zinc-50 transition-colors">
                      <CatLink
                        name={cat.label}
                        className="flex-1 px-3 py-2.5 text-sm font-semibold"
                        onClick={() => setOpen(false)}
                      />
                      <button
                        onClick={() => toggleMobile(cat.label)}
                        className="px-3 py-2.5"
                      >
                        {isOpen
                          ? <ChevronDown size={15} className="text-zinc-400" />
                          : <ChevronRight size={15} className="text-zinc-400" />}
                      </button>
                    </div>

                    {/* Sections */}
                    {isOpen && (
                      <div className="ml-3 border-l pl-3 mt-1 space-y-2 mb-2">
                        {cat.sections.map((sec) => {
                          const secKey = cat.label + sec.heading
                          const secOpen = expandedSection[secKey] ?? true
                          return (
                            <div key={sec.heading}>
                              <div className="flex items-center justify-between">
                                {/* Subcategory label links to subcategory page */}
                                <CatLink
                                  name={sec.heading}
                                  className="flex-1 px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 transition-colors"
                                  onClick={() => setOpen(false)}
                                />
                                <button
                                  onClick={() => toggleSection(secKey)}
                                  className="px-2 py-1.5"
                                >
                                  {secOpen
                                    ? <ChevronDown size={12} className="text-zinc-400" />
                                    : <ChevronRight size={12} className="text-zinc-400" />}
                                </button>
                              </div>
                              {secOpen && (
                                <div className="ml-2 space-y-0.5">
                                  {sec.items.map((item) => (
                                    // Product items link directly to product page by name
                                    <Link
                                      key={item}
                                      to={`/product/${nameToSlug(item)}`}
                                      onClick={() => setOpen(false)}
                                      className="block w-full px-2 py-1.5 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded transition-colors"
                                    >
                                      {item}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link to="/">
          <img
            src="/mekal_logo.png"
            alt="Mekal Enterprises"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* ── Live Search ── */}
        <div ref={searchRef} className="hidden md:flex flex-1 max-w-xl mx-6 relative">
          <div className="relative w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => results.length > 0 && setShowDrop(true)}
              placeholder="Search products..."
              className="pl-9 pr-9 bg-white/15 border-white/20 text-white placeholder:text-white/50 focus:bg-white focus:text-zinc-900 focus:placeholder:text-zinc-400 transition-colors"
            />
            {query && (
              <button onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors">
                {searching
                  ? <Loader2 size={14} className="animate-spin" />
                  : <X size={14} />}
              </button>
            )}
          </div>

          {/* Dropdown results */}
          {showDrop && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-zinc-100 overflow-hidden z-50">
              {results.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-zinc-400">
                  No products found for "<span className="font-medium text-zinc-600">{query}</span>"
                </div>
              ) : (
                <>
                  <div className="px-3 py-2 border-b bg-zinc-50">
                    <p className="text-xs text-zinc-400 font-medium">{results.length} result{results.length !== 1 ? "s" : ""}</p>
                  </div>
                  <ul>
                    {results.map(product => (
                      <li key={product.id}>
                        <button
                          onClick={() => handleResultClick(product.name)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-50 transition-colors text-left"
                        >
                          {/* Thumbnail */}
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0">
                            {product.image_url
                              ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                              : <div className="w-full h-full bg-zinc-200" />}
                          </div>
                          {/* Name with query highlight */}
                          <span className="text-sm text-zinc-800 flex-1 leading-snug">
                            {product.name.split(new RegExp(`(${query})`, "gi")).map((part, i) =>
                              part.toLowerCase() === query.toLowerCase()
                                ? <mark key={i} className="bg-yellow-100 text-zinc-900 rounded px-0.5">{part}</mark>
                                : part
                            )}
                          </span>
                          <ChevronRight size={14} className="text-zinc-300 flex-shrink-0" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-white hover:bg-white/10">Support</Button>
          <Button className="bg-white text-[#065999] hover:bg-white/90 font-semibold">Login</Button>
        </div>
      </div>

      {/* ── Desktop categories bar ── */}
      <div className="hidden md:flex justify-center border-t border-white/20" style={{ backgroundColor: "#065999" }}>
        <NavigationMenu className="max-w-full">
          <NavigationMenuList className="flex-wrap justify-center">
            {NAV_CATEGORIES.map((cat) => (
              <NavigationMenuItem key={cat.label}>
                <NavigationMenuTrigger className="text-sm font-medium text-white bg-transparent hover:bg-white/10 data-[state=open]:bg-white/10">
                  {/* Category label → category page */}
                  <CatLink name={cat.label} className="hover:underline underline-offset-2">
                    {cat.label}
                  </CatLink>
                </NavigationMenuTrigger>

                <NavigationMenuContent>
                  <div className="p-6 w-[860px]">

                    {/* View all link */}
                    <CatLink
                      name={cat.label}
                      className="block text-xs font-semibold text-[#065999] hover:underline mb-4 pb-3 border-b"
                    >
                      View all {cat.label} →
                    </CatLink>

                    <div className="grid grid-cols-4 gap-x-8 gap-y-6">
                      {cat.sections.map((sec) => (
                        <div key={sec.heading}>
                          {/* Subcategory heading → subcategory page */}
                          <CatLink
                            name={sec.heading}
                            className="block text-xs font-bold uppercase tracking-widest text-zinc-900 hover:text-[#065999] mb-3 border-b pb-1.5 transition-colors"
                          />
                          <ul className="space-y-1.5">
                            {sec.items.map((item) => (
                              <li key={item}>
                                {/* Product item → product page */}
                                <Link
                                  to={`/product/${nameToSlug(item)}`}
                                  className="block text-sm text-zinc-500 hover:text-zinc-900 transition-colors leading-snug"
                                >
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

    </header>
  )
}