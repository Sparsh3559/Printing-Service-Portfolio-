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

export default function Navbar() {
  const [open, setOpen]                       = useState(false)
  const [expandedMobile, setExpandedMobile]   = useState({})
  const [expandedSection, setExpandedSection] = useState({})

  // ── Nav data from 3 tables ────────────────────────────────────────────────
  // navTree = [ { id, name, subcategories: [ { id, name, items: [ { id, name } ] } ] } ]
  const [navTree,   setNavTree]   = useState([])
  const [navLoaded, setNavLoaded] = useState(false)

  // ── Live search ───────────────────────────────────────────────────────────
  const [query,     setQuery]     = useState("")
  const [results,   setResults]   = useState([])
  const [searching, setSearching] = useState(false)
  const [showDrop,  setShowDrop]  = useState(false)
  const searchRef                 = useRef(null)
  const debounceRef               = useRef(null)
  const navigate                  = useNavigate()

  // ── Fetch from 3 tables and build tree ───────────────────────────────────
  async function fetchNavTree() {
    const [catsRes, subsRes, itemsRes] = await Promise.all([
      supabase.from("Categories").select("id, name").order("name"),
      supabase.from("Subcategories").select("id, name, category_id").order("name"),
      supabase.from("Items").select("id, name, subcategory_id").order("name"),
    ])

    const cats  = catsRes.data  || []
    const subs  = subsRes.data  || []
    const items = itemsRes.data || []

    // Build tree
    const tree = cats.map(cat => ({
      ...cat,
      subcategories: subs
        .filter(s => s.category_id === cat.id)
        .map(sub => ({
          ...sub,
          items: items.filter(i => i.subcategory_id === sub.id),
        })),
    }))

    setNavTree(tree)
    setNavLoaded(true)
  }

  useEffect(() => {
    fetchNavTree()

    // Realtime — navbar updates instantly when admin makes changes
    const ch = supabase.channel("navbar-3tables")
      .on("postgres_changes", { event: "*", schema: "public", table: "Categories" },    fetchNavTree)
      .on("postgres_changes", { event: "*", schema: "public", table: "Subcategories" }, fetchNavTree)
      .on("postgres_changes", { event: "*", schema: "public", table: "Items" },         fetchNavTree)
      .subscribe()

    return () => supabase.removeChannel(ch)
  }, [])

  // ── Live search ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!query.trim()) { setResults([]); setShowDrop(false); return }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      const { data } = await supabase
        .from("Products")
        .select("id, name, image_url")
        .ilike("name", `%${query.trim()}%`)
        .eq("is_active", true)
        .limit(8)
      setResults(data || [])
      setShowDrop(true)
      setSearching(false)
    }, 300)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  useEffect(() => {
    function handler(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowDrop(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  function clearSearch() { setQuery(""); setResults([]); setShowDrop(false) }
  function handleResultClick(name) { navigate(`/product/${nameToSlug(name)}`); clearSearch() }
  function handleSearchKeyDown(e) {
    if (e.key === "Enter" && results.length > 0) handleResultClick(results[0].name)
    if (e.key === "Escape") clearSearch()
  }

  const toggleMobile  = (id) => setExpandedMobile(p  => ({ ...p, [id]: !p[id] }))
  const toggleSection = (id) => setExpandedSection(p => ({ ...p, [id]: !p[id] }))

  return (
    <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: "#5fc7f4" }}>

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-6 py-3">

        {/* Mobile hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden text-[#065999] hover:bg-black/10">☰</Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-80 overflow-y-auto">
            <div className="space-y-1 mt-6 pb-8">
              <h2 className="text-lg font-bold px-3 mb-5">Categories</h2>

              {!navLoaded && (
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400">
                  <Loader2 size={14} className="animate-spin" /> Loading…
                </div>
              )}

              {navTree.map(cat => {
                const catOpen = expandedMobile[cat.id]
                return (
                  <div key={cat.id}>
                    <div className="flex items-center justify-between rounded-lg hover:bg-zinc-50 transition-colors">
                      <Link to={`/category/${cat.id}`} onClick={() => setOpen(false)}
                        className="flex-1 px-3 py-2.5 text-sm font-semibold text-zinc-900">
                        {cat.name}
                      </Link>
                      {cat.subcategories.length > 0 && (
                        <button onClick={() => toggleMobile(cat.id)} className="px-3 py-2.5">
                          {catOpen
                            ? <ChevronDown size={15} className="text-zinc-400" />
                            : <ChevronRight size={15} className="text-zinc-400" />}
                        </button>
                      )}
                    </div>

                    {catOpen && cat.subcategories.length > 0 && (
                      <div className="ml-3 border-l pl-3 mt-1 space-y-1 mb-2">
                        {cat.subcategories.map(sub => {
                          const subOpen = expandedSection[sub.id] ?? true
                          return (
                            <div key={sub.id}>
                              <div className="flex items-center justify-between">
                                <Link to={`/category/${cat.id}`} onClick={() => setOpen(false)}
                                  className="flex-1 px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 transition-colors">
                                  {sub.name}
                                </Link>
                                {sub.items.length > 0 && (
                                  <button onClick={() => toggleSection(sub.id)} className="px-2 py-1.5">
                                    {subOpen
                                      ? <ChevronDown size={12} className="text-zinc-400" />
                                      : <ChevronRight size={12} className="text-zinc-400" />}
                                  </button>
                                )}
                              </div>
                              {subOpen && sub.items.length > 0 && (
                                <div className="ml-2 space-y-0.5">
                                  {sub.items.map(item => (
                                    <Link key={item.id} to={`/product/${nameToSlug(item.name)}`}
                                      onClick={() => setOpen(false)}
                                      className="block px-2 py-1.5 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded transition-colors">
                                      {item.name}
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
        <Link to="/"><img src="/mekal_logo.png" alt="Mekal Enterprises" className="h-12 w-auto object-contain" /></Link>

        {/* ── Live Search ── */}
        <div ref={searchRef} className="hidden md:flex flex-1 max-w-xl mx-6 relative">
          <div className="relative w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#065999]/60 pointer-events-none" />
            <Input value={query} onChange={e => setQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => results.length > 0 && setShowDrop(true)}
              placeholder="Search products..."
              className="pl-9 pr-9 bg-white/30 border-white/40 text-[#065999] placeholder:text-[#065999]/50 focus:bg-white focus:text-zinc-900 focus:placeholder:text-zinc-400 transition-colors font-medium" />
            {query && (
              <button onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#065999]/60 hover:text-[#065999] transition-colors">
                {searching ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
              </button>
            )}
          </div>

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
                        <button onClick={() => handleResultClick(product.name)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-50 transition-colors text-left">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0">
                            {product.image_url
                              ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                              : <div className="w-full h-full bg-zinc-200" />}
                          </div>
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
          <Button variant="ghost" className="text-[#065999] font-semibold hover:bg-black/10">Support</Button>
          <Button className="bg-[#065999] text-white hover:bg-[#065999]/90 font-semibold">Login</Button>
        </div>
      </div>

      {/* ── Desktop categories bar ── */}
      <div className="hidden md:flex justify-center border-t border-[#065999]/20" style={{ backgroundColor: "#5fc7f4" }}>
        <NavigationMenu className="max-w-full">
          <NavigationMenuList className="flex-wrap justify-center">
            {!navLoaded && (
              <div className="flex items-center gap-2 px-4 py-2 text-[#065999]/60 text-sm">
                <Loader2 size={13} className="animate-spin" />
              </div>
            )}
            {navTree.map(cat => (
              <NavigationMenuItem key={cat.id}>
                <NavigationMenuTrigger className="text-sm font-semibold text-[#065999] bg-transparent hover:bg-black/10 data-[state=open]:bg-black/10">
                  <Link to={`/category/${cat.id}`} className="hover:underline underline-offset-2"
                    onClick={e => e.stopPropagation()}>
                    {cat.name}
                  </Link>
                </NavigationMenuTrigger>

                {cat.subcategories.length > 0 && (
                  <NavigationMenuContent>
                    <div className="p-6 w-[860px]">
                      <Link to={`/category/${cat.id}`}
                        className="block text-xs font-semibold text-[#065999] hover:underline mb-4 pb-3 border-b">
                        View all {cat.name} →
                      </Link>
                      <div className="grid grid-cols-4 gap-x-8 gap-y-6">
                        {cat.subcategories.map(sub => (
                          <div key={sub.id}>
                            {/* Bold subcategory heading → parent category page */}
                            <Link to={`/category/${cat.id}`}
                              className="block text-xs font-bold uppercase tracking-widest text-zinc-900 hover:text-[#065999] mb-3 border-b pb-1.5 transition-colors">
                              {sub.name}
                            </Link>
                            {/* Product links */}
                            {sub.items.length > 0 && (
                              <ul className="space-y-1.5">
                                {sub.items.map(item => (
                                  <li key={item.id}>
                                    <Link to={`/product/${nameToSlug(item.name)}`}
                                      className="block text-sm text-zinc-500 hover:text-zinc-900 transition-colors leading-snug">
                                      {item.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

    </header>
  )
}