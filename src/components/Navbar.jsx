import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ChevronDown, ChevronRight, Search, X, Loader2, Menu, Phone } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { nameToSlug } from "@/lib/slugutils"

const BRAND = "#5fc7f4"
const DARK  = "#065999"

// ── Badge ─────────────────────────────────────────────────────────────────────
const BADGE_STYLES = {
  "New":         "bg-blue-500 text-white",
  "Hot":         "bg-red-500 text-white",
  "Popular":     "bg-purple-500 text-white",
  "Offer":       "bg-green-500 text-white",
  "Best Seller": "bg-amber-500 text-white",
  "Trending":    "bg-pink-500 text-white",
}
function Badge({ label }) {
  if (!label) return null
  return (
    <span className={`inline-block align-middle text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ml-1 leading-none flex-shrink-0 ${BADGE_STYLES[label] || "bg-zinc-500 text-white"}`}>
      {label}
    </span>
  )
}

export default function Navbar() {
  const [scrolled,        setScrolled]        = useState(false)
  const [open,            setOpen]            = useState(false)
  const [expandedMobile,  setExpandedMobile]  = useState({})
  const [expandedSection, setExpandedSection] = useState({})
  const [mobileSearch,    setMobileSearch]    = useState(false)
  const [navTree,         setNavTree]         = useState([])
  const [navLoaded,       setNavLoaded]       = useState(false)

  // Mega menu
  const [activeMenu, setActiveMenu] = useState(null)
  const [menuLeft,   setMenuLeft]   = useState(0)
  const triggerRefs  = useRef({})
  const navBarRef    = useRef(null)
  const catBarRef    = useRef(null)
  const menuCloseRef = useRef(null)

  // Search
  const [query,     setQuery]     = useState("")
  const [results,   setResults]   = useState([])
  const [searching, setSearching] = useState(false)
  const [showDrop,  setShowDrop]  = useState(false)
  const searchRef       = useRef(null)
  const mobileSearchRef = useRef(null)
  const debounceRef     = useRef(null)
  const navigate        = useNavigate()

  // ── Scroll detection ──────────────────────────────────────────────────────
  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 60) }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // ── Nav data ──────────────────────────────────────────────────────────────
  async function fetchNavTree() {
    const [catsRes, subsRes, itemsRes] = await Promise.all([
      supabase.from("Categories").select("id, name").order("name"),
      supabase.from("Subcategories").select("id, name, category_id, badge").order("name"),
      supabase.from("Items").select("id, name, subcategory_id, badge").order("name"),
    ])
    const cats  = catsRes.data  || []
    const subs  = subsRes.data  || []
    const items = itemsRes.data || []
    setNavTree(cats.map(cat => ({
      ...cat,
      subcategories: subs
        .filter(s => s.category_id === cat.id)
        .map(sub => ({ ...sub, items: items.filter(i => i.subcategory_id === sub.id) })),
    })))
    setNavLoaded(true)
  }

  useEffect(() => {
    fetchNavTree()
    const ch = supabase.channel("navbar-v3")
      .on("postgres_changes", { event: "*", schema: "public", table: "Categories" },    fetchNavTree)
      .on("postgres_changes", { event: "*", schema: "public", table: "Subcategories" }, fetchNavTree)
      .on("postgres_changes", { event: "*", schema: "public", table: "Items" },         fetchNavTree)
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [])

  // ── Search ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!query.trim()) { setResults([]); setShowDrop(false); return }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      const { data } = await supabase
        .from("Products").select("id, name, image_url")
        .ilike("name", `%${query.trim()}%`).eq("is_active", true).limit(8)
      setResults(data || [])
      setShowDrop(true)
      setSearching(false)
    }, 300)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  useEffect(() => {
    function handler(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowDrop(false)
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target))
        if (mobileSearch && !query) setMobileSearch(false)
      if (navBarRef.current && !navBarRef.current.contains(e.target)) setActiveMenu(null)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [mobileSearch, query])

  function clearSearch() { setQuery(""); setResults([]); setShowDrop(false) }
  function handleResultClick(name) {
    navigate(`/product/${nameToSlug(name)}`)
    clearSearch(); setMobileSearch(false); setActiveMenu(null)
  }
  function handleSearchKeyDown(e) {
    if (e.key === "Enter" && results.length > 0) handleResultClick(results[0].name)
    if (e.key === "Escape") clearSearch()
  }
  const toggleMobile  = id => setExpandedMobile(p  => ({ ...p, [id]: !p[id] }))
  const toggleSection = id => setExpandedSection(p => ({ ...p, [id]: !p[id] }))

  // ── Mega menu positioning ─────────────────────────────────────────────────
  function openMenu(catId) {
    const triggerEl = triggerRefs.current[catId]
    const navEl     = catBarRef.current
    if (!triggerEl || !navEl) { setActiveMenu(catId); return }
    const triggerRect = triggerEl.getBoundingClientRect()
    const navRect     = navEl.getBoundingClientRect()
    const DROPDOWN_W  = 820
    let left = triggerRect.left - navRect.left + triggerRect.width / 2 - DROPDOWN_W / 2
    left = Math.max(8, Math.min(left, navRect.width - DROPDOWN_W - 8))
    setMenuLeft(left)
    setActiveMenu(catId)
  }

  function handleTriggerEnter(catId) { clearTimeout(menuCloseRef.current); openMenu(catId) }
  function handleMenuLeave()  { menuCloseRef.current = setTimeout(() => setActiveMenu(null), 80) }
  function handleMenuEnter()  { clearTimeout(menuCloseRef.current) }

  const activeCat = navTree.find(c => c.id === activeMenu)

  const SearchResults = () => (
    <>
      {showDrop && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden z-50">
          <ul>
            {results.map(p => (
              <li key={p.id}>
                <button onClick={() => handleResultClick(p.name)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-50 transition-colors text-left border-b last:border-b-0">
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0">
                    {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-zinc-200" />}
                  </div>
                  <span className="text-sm text-zinc-800 flex-1 leading-snug">{p.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {showDrop && results.length === 0 && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-zinc-100 z-50 px-4 py-5 text-sm text-center text-zinc-400">
          No results for "<span className="font-medium text-zinc-600">{query}</span>"
        </div>
      )}
    </>
  )

  return (
    <div ref={navBarRef} className="sticky top-0 z-50">

      {/* ═══════════════════════════════════════════════════════
          LEVEL 1 — Always visible, always sticky
          Logo · Brand name · Support
      ═══════════════════════════════════════════════════════ */}
      <div className="flex items-center justify-between px-5 md:px-8 h-20 md:h-24 shadow-sm"
        style={{ backgroundColor: BRAND }}>

        {/* Left — Logo + hamburger on mobile */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-black/10 transition-colors" style={{ color: DARK }}>
                <Menu size={22} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] max-w-sm overflow-y-auto p-0">
              <div className="sticky top-0 bg-white border-b px-4 py-4 z-10 flex items-center gap-3">
                <img src="/mekal_logo.png" alt="Mekal Enterprises" className="h-12 w-auto object-contain" />
                <h2 className="text-sm font-bold text-zinc-900">Mekal Enterprises</h2>
              </div>
              {/* Mobile search */}
              <div className="px-3 pt-3 pb-1">
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                  <input value={query} onChange={e => setQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search products..."
                    className="w-full pl-9 pr-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 bg-zinc-50"
                    style={{ "--tw-ring-color": BRAND }} />
                </div>
                {showDrop && results.length > 0 && (
                  <div className="mt-1 bg-white rounded-xl border border-zinc-100 shadow-lg overflow-hidden max-h-52 overflow-y-auto">
                    {results.map(p => (
                      <button key={p.id} onClick={() => handleResultClick(p.name)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-50 border-b last:border-b-0 text-left">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0">
                          {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-zinc-200" />}
                        </div>
                        <span className="text-sm text-zinc-800 flex-1 leading-snug">{p.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Mobile nav tree */}
              <div className="px-3 py-2 space-y-1">
                {!navLoaded && <div className="flex items-center gap-2 px-3 py-3 text-sm text-zinc-400"><Loader2 size={14} className="animate-spin" /> Loading…</div>}
                {navTree.map(cat => {
                  const catOpen = expandedMobile[cat.id]
                  return (
                    <div key={cat.id}>
                      <div className="flex items-center rounded-xl">
                        <Link to={`/category/${cat.id}`} onClick={() => setOpen(false)}
                          className="flex-1 px-3 py-3 text-sm font-semibold text-zinc-900">{cat.name}</Link>
                        {cat.subcategories.length > 0 && (
                          <button onClick={() => toggleMobile(cat.id)} className="px-3 py-3 text-zinc-400">
                            {catOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </button>
                        )}
                      </div>
                      {catOpen && (
                        <div className="ml-4 border-l-2 border-zinc-100 pl-3 mb-2 space-y-1">
                          {cat.subcategories.map(sub => {
                            const subOpen = expandedSection[sub.id] ?? false
                            return (
                              <div key={sub.id}>
                                <div className="flex items-center">
                                  <span className="flex-1 px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
                                    {sub.name}<Badge label={sub.badge} />
                                  </span>
                                  {sub.items.length > 0 && (
                                    <button onClick={() => toggleSection(sub.id)} className="px-2 py-1.5 text-zinc-400">
                                      {subOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                    </button>
                                  )}
                                </div>
                                {subOpen && sub.items.map(item => (
                                  <Link key={item.id} to={`/product/${nameToSlug(item.name)}`}
                                    onClick={() => setOpen(false)}
                                    className="block px-2 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg">
                                    {item.name}<Badge label={item.badge} />
                                  </Link>
                                ))}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
                <div className="pt-3 mt-3 border-t">
                  <a href="tel:+919999999999"
                    className="flex items-center gap-3 px-3 py-3 text-sm font-semibold rounded-xl hover:bg-zinc-50"
                    style={{ color: DARK }}>
                    <Phone size={15} /> +91 99999 99999
                  </a>
                  <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer"
                    className="flex items-center gap-3 px-3 py-3 text-sm font-semibold text-green-700 rounded-xl hover:bg-green-50">
                    💬 WhatsApp Support
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src="/mekal_logo.png" alt="Mekal Enterprises"
              className="h-14 md:h-16 w-auto object-contain" />
          </Link>
        </div>

        {/* Centre — Brand name (hidden on small mobile) */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2 hidden sm:block text-center">
          <p className="text-[9px] uppercase tracking-[0.3em] font-medium leading-none mb-1" style={{ color: DARK }}>Est. 2018</p>
          <h1 className="font-bold leading-none tracking-wide"
            style={{ fontSize: "clamp(14px, 2vw, 22px)", fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: "0.08em", color: DARK }}>
            Mekal Enterprises
          </h1>
          <p className="text-[10px] leading-none mt-1 font-semibold tracking-[0.2em]"
            style={{ color: DARK, opacity: 0.7 }}>
            CUSTOM PRINTING SOLUTIONS
          </p>
        </Link>

        {/* Right — Support */}
        <div className="flex items-center gap-2">
          <a href="tel:+919999999999"
            className="hidden md:flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-xl hover:bg-black/10 transition-colors group">
            <div className="w-7 h-7 rounded-full flex items-center justify-center border transition-colors"
              style={{ borderColor: `${DARK}40`, backgroundColor: `${DARK}15` }}>
              <Phone size={14} style={{ color: DARK }} />
            </div>
            <span className="text-[9px] font-semibold uppercase tracking-widest transition-colors" style={{ color: DARK }}>Support</span>
          </a>
          {/* Mobile search icon */}
          <button onClick={() => setMobileSearch(s => !s)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-black/10" style={{ color: DARK }}>
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      {mobileSearch && (
        <div ref={mobileSearchRef} className="md:hidden relative px-3 py-2"
          style={{ backgroundColor: BRAND }}>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search products..."
              className="w-full pl-9 pr-10 py-2.5 bg-white rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none shadow-md" />
            <button onClick={query ? clearSearch : () => setMobileSearch(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
              {searching ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />}
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          LEVELS 2 + 3 — Scroll away when scrolled down
      ═══════════════════════════════════════════════════════ */}
      <div className={`hidden md:block transition-all duration-300 overflow-hidden ${scrolled ? "max-h-0 opacity-0" : "max-h-40 opacity-100"}`}
        style={{ backgroundColor: BRAND }}>

        {/* LEVEL 2 — Search bar */}
        <div className="flex items-center justify-center px-6 py-3 border-b border-white/20">
          <div ref={searchRef} className="relative w-full max-w-2xl">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: DARK }} />
            <input value={query} onChange={e => setQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => results.length > 0 && setShowDrop(true)}
              placeholder="Search for products, categories..."
              className="w-full pl-11 pr-10 py-2.5 rounded-2xl text-sm font-medium focus:outline-none transition-colors shadow-sm"
              style={{
                backgroundColor: "rgba(255,255,255,0.35)",
                border: "1px solid rgba(255,255,255,0.5)",
                color: DARK,
              }}
              onFocusCapture={e => { e.target.style.backgroundColor = "#fff"; e.target.style.color = "#111" }}
              onBlurCapture={e => { e.target.style.backgroundColor = "rgba(255,255,255,0.35)"; e.target.style.color = DARK }}
            />
            {query && (
              <button onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: `${DARK}80` }}>
                {searching ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
              </button>
            )}
            <SearchResults />
          </div>
        </div>

        {/* LEVEL 3 — Category nav */}
        <div ref={catBarRef} className="relative">
          <div className="flex items-stretch justify-between px-4">
            {!navLoaded && (
              <div className="flex items-center px-4 py-2 text-[10px]" style={{ color: `${DARK}60` }}>
                <Loader2 size={12} className="animate-spin" />
              </div>
            )}
            {navTree.map(cat => (
              <div key={cat.id}
                ref={el => { triggerRefs.current[cat.id] = el }}
                onMouseEnter={() => handleTriggerEnter(cat.id)}
                onMouseLeave={handleMenuLeave}
                className="flex-1">
                <Link to={`/category/${cat.id}`}
                  onClick={() => setActiveMenu(null)}
                  className={`flex items-center justify-center gap-1 w-full py-2.5 text-[11px] font-semibold transition-colors px-1 leading-tight text-center ${activeMenu === cat.id ? "bg-black/10" : "hover:bg-black/10"}`}
                  style={{ color: DARK }}>
                  {cat.name.includes("&") ? (
                    <span className="text-center">
                      {cat.name.split("&")[0].trim()}&nbsp;&amp;<br />{cat.name.split("&").slice(1).join("&").trim()}
                    </span>
                  ) : <span>{cat.name}</span>}
                  {cat.subcategories.length > 0 && (
                    <ChevronDown size={10} className={`flex-shrink-0 transition-transform ${activeMenu === cat.id ? "rotate-180" : ""}`} />
                  )}
                </Link>
              </div>
            ))}
          </div>

          {/* Mega dropdown */}
          {activeMenu && activeCat?.subcategories.length > 0 && (
            <div
              onMouseEnter={handleMenuEnter}
              onMouseLeave={handleMenuLeave}
              className="absolute top-full z-50 bg-white border border-zinc-100 rounded-b-2xl shadow-2xl"
              style={{
                left:     menuLeft,
                width:    Math.min(820, typeof window !== "undefined" ? window.innerWidth - 16 : 820),
                minWidth: 480,
              }}>
              <div className="p-5">
                <div className="flex items-center justify-between mb-4 pb-3 border-b">
                  <Link to={`/category/${activeCat.id}`} onClick={() => setActiveMenu(null)}
                    className="text-xs font-bold hover:underline" style={{ color: DARK }}>
                    View all {activeCat.name} →
                  </Link>
                  <span className="text-[10px] text-zinc-400">
                    {activeCat.subcategories.reduce((n, s) => n + s.items.length, 0)} products
                  </span>
                </div>
                <div className={`grid gap-x-6 gap-y-4 ${activeCat.subcategories.length <= 2 ? "grid-cols-2" : activeCat.subcategories.length === 3 ? "grid-cols-3" : "grid-cols-4"}`}>
                  {activeCat.subcategories.map(sub => (
                    <div key={sub.id}>
                      <Link to={`/category/${activeCat.id}`} onClick={() => setActiveMenu(null)}
                        className="block text-[10px] font-bold uppercase tracking-widest text-zinc-800 hover:text-[#065999] mb-2 border-b pb-1.5 transition-colors">
                        {sub.name}<Badge label={sub.badge} />
                      </Link>
                      {sub.items.length > 0 && (
                        <ul className="space-y-1">
                          {sub.items.map(item => (
                            <li key={item.id}>
                              <Link to={`/product/${nameToSlug(item.name)}`} onClick={() => setActiveMenu(null)}
                                className="block text-[12px] text-zinc-500 hover:text-zinc-900 transition-colors leading-snug hover:underline underline-offset-2">
                                {item.name}<Badge label={item.badge} />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Compact sticky bar — shown only when scrolled (desktop) ── */}
      <div className={`hidden md:flex items-center justify-between px-6 h-10 transition-all duration-300 border-b border-white/20 ${scrolled ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ backgroundColor: BRAND }}>

        {/* Mini category strip */}
        <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] flex-1">
          {navTree.map(cat => (
            <Link key={cat.id} to={`/category/${cat.id}`}
              className="flex-shrink-0 text-[10.5px] font-semibold px-2.5 py-1 rounded-full hover:bg-black/10 transition-colors whitespace-nowrap"
              style={{ color: DARK }}>
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Mini search icon */}
        <button onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }) }}
          className="flex-shrink-0 flex items-center gap-1.5 text-[10px] font-semibold px-3 py-1 rounded-full hover:bg-black/10 transition-colors ml-4"
          style={{ color: DARK }}>
          <Search size={11} /> Search
        </button>
      </div>

    </div>
  )
}