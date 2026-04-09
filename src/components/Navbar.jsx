import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ChevronDown, ChevronRight, Search, X, Loader2, Menu, HeadphonesIcon } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { nameToSlug } from "@/lib/slugutils"

// ── Theme colours (single source of truth) ───────────────────────────────────
const BG    = "#5fc7f4"   // navbar / sheet background
const DARK  = "#065999"   // primary text / icon colour
const NAVY  = "#0a3d62"   // deeper navy for headings in sheet

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

// ── Helper: split a category name at "&" into two display lines ───────────────
// Returns [line1, line2] or [name, null] if no "&"
function splitAtAmpersand(name) {
  const idx = name.indexOf("&")
  if (idx === -1) return [name, null]
  return [name.slice(0, idx).trim(), "& " + name.slice(idx + 1).trim()]
}

export default function Navbar() {
  const [open,            setOpen]            = useState(false)
  const [expandedMobile,  setExpandedMobile]  = useState({})
  const [expandedSection, setExpandedSection] = useState({})
  const [mobileSearch,    setMobileSearch]    = useState(false)
  const [navTree,         setNavTree]         = useState([])
  const [navLoaded,       setNavLoaded]       = useState(false)

  // Desktop mega-menu state
  const [activeMenu,  setActiveMenu]  = useState(null)
  const [menuLeft,    setMenuLeft]    = useState(0)
  const triggerRefs  = useRef({})
  const navBarRef    = useRef(null)
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
    const ch = supabase.channel("navbar-v2")
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
      if (searchRef.current && !searchRef.current.contains(e.target))       setShowDrop(false)
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target))
        if (mobileSearch && !query) setMobileSearch(false)
      if (navBarRef.current && !navBarRef.current.contains(e.target))       setActiveMenu(null)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [mobileSearch, query])

  function clearSearch() { setQuery(""); setResults([]); setShowDrop(false) }
  function handleResultClick(name) {
    navigate(`/product/${nameToSlug(name)}`)
    clearSearch()
    setMobileSearch(false)
    setActiveMenu(null)
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
    const navEl     = navBarRef.current
    if (!triggerEl || !navEl) { setActiveMenu(catId); return }
    const triggerRect = triggerEl.getBoundingClientRect()
    const navRect     = navEl.getBoundingClientRect()
    const DROPDOWN_W  = 820
    let left = triggerRect.left - navRect.left + triggerRect.width / 2 - DROPDOWN_W / 2
    const maxLeft = navRect.width - DROPDOWN_W - 8
    left = Math.max(8, Math.min(left, maxLeft))
    setMenuLeft(left)
    setActiveMenu(catId)
  }

  function handleTriggerEnter(catId) {
    clearTimeout(menuCloseRef.current)
    openMenu(catId)
  }
  function handleMenuLeave() {
    menuCloseRef.current = setTimeout(() => setActiveMenu(null), 80)
  }
  function handleMenuEnter() {
    clearTimeout(menuCloseRef.current)
  }

  const activeCat = navTree.find(c => c.id === activeMenu)

  return (
    <header ref={navBarRef} className="sticky top-0 z-50 border-b shadow-sm" style={{ backgroundColor: BG }}>

      {/* ══════════════════════════════════════════════════════════════════════
          DESKTOP LAYOUT — two rows
          Row 1: Logo  |  Brand name + search bar  |  icons
          Row 2: category tabs
         ══════════════════════════════════════════════════════════════════════ */}

      {/* ══════════════════════════════════════════════════════════════════════
          DESKTOP — Row A: Logo | Brand name | Icons
         ══════════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex items-center px-6 gap-4" style={{ height: "76px" }}>

        {/* Logo */}
        <Link to="/" className="flex-shrink-0 flex items-center">
          <img src="/mekal_logo.png" alt="Mekal Enterprises" className="h-16 w-auto object-contain" />
        </Link>

        {/* Brand name — centred */}
        <div className="flex-1 flex items-center justify-center select-none">
          <span style={{
            fontFamily:    "'Georgia', 'Times New Roman', serif",
            fontSize:      "1.65rem",
            fontWeight:    "900",
            letterSpacing: "0.18em",
            color:         DARK,
            textTransform: "uppercase",
            lineHeight:    1,
          }}>
            MEKAL ENTERPRISES
            <sup style={{ fontSize: "0.55rem", fontWeight: "700", letterSpacing: 0, verticalAlign: "super", marginLeft: "2px" }}>™</sup>
          </span>
        </div>

        {/* Customer care icon */}
        <a href="https://wa.me/+919131387559" target="_blank" rel="noreferrer"
          aria-label="Customer Care on WhatsApp"
          className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-black/10 transition-colors flex-shrink-0"
          title="Customer Care">
          <HeadphonesIcon size={22} style={{ color: DARK }} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-green-500 border border-white" />
        </a>
      </div>

      {/* ── Divider line ── */}
      <div className="hidden md:block" style={{ height: "1.5px", backgroundColor: `${DARK}40`, margin: "0 0" }} />

      {/* ══════════════════════════════════════════════════════════════════════
          DESKTOP — Row B: Search bar (full width, centred)
         ══════════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex items-center justify-center px-8 py-2.5">
        <div ref={searchRef} className="relative w-full max-w-2xl">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: `${DARK}99` }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            onFocus={e => {
              if (results.length > 0) setShowDrop(true)
              e.target.style.background = "rgba(255,255,255,0.6)"
              e.target.style.borderColor = `${DARK}99`
            }}
            onBlur={e => {
              e.target.style.background = "rgba(255,255,255,0.3)"
              e.target.style.borderColor = "rgba(255,255,255,0.55)"
            }}
            placeholder="Search products..."
            className="w-full pl-10 pr-10 rounded-2xl text-sm font-medium focus:outline-none transition-all"
            style={{
              height:      "40px",
              background:  "rgba(255,255,255,0.3)",
              border:      "1.5px solid rgba(255,255,255,0.55)",
              color:       DARK,
            }}
          />
          {query && (
            <button onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: `${DARK}99` }}>
              {searching ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />}
            </button>
          )}

          {/* Search dropdown */}
          {showDrop && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden z-50">
              <ul>
                {results.map(p => (
                  <li key={p.id}>
                    <button onClick={() => handleResultClick(p.name)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-50 transition-colors text-left border-b last:border-b-0">
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0">
                        {p.image_url
                          ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full bg-zinc-200" />}
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
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          MOBILE LAYOUT — single row: hamburger | logo+name | search+care
         ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex md:hidden items-center justify-between px-3 h-14">

        {/* Hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-black/10 transition-colors" style={{ color: DARK }}>
              <Menu size={22} />
            </button>
          </SheetTrigger>

          {/* ── Mobile slide-in sheet — fully themed ── */}
          <SheetContent side="left" className="w-[85vw] max-w-sm overflow-y-auto p-0 border-0"
            style={{ backgroundColor: BG }}>

            {/* Sheet header */}
            <div className="sticky top-0 z-10 px-4 py-4 border-b" style={{ backgroundColor: BG, borderColor: `${DARK}33` }}>
              <div className="flex items-center gap-3">
                <img src="/mekal_logo.png" alt="Mekal Enterprises" className="h-8 w-auto object-contain" />
                <span className="font-extrabold text-sm tracking-wide" style={{ color: DARK }}>MEKAL ENTERPRISES</span>
              </div>
            </div>

            {/* Nav tree */}
            <div className="px-3 py-4 space-y-1">
              {!navLoaded && (
                <div className="flex items-center gap-2 px-3 py-3 text-sm" style={{ color: `${DARK}88` }}>
                  <Loader2 size={14} className="animate-spin" /> Loading…
                </div>
              )}

              {navTree.map(cat => {
                const catOpen = expandedMobile[cat.id]
                return (
                  <div key={cat.id} className="rounded-xl overflow-hidden">
                    {/* ── Level 1: Category — block hover with bg shift ── */}
                    <div
                      className="flex items-center rounded-xl transition-all duration-150"
                      style={{ backgroundColor: catOpen ? `${DARK}20` : "transparent" }}
                      onMouseEnter={e => { if (!catOpen) e.currentTarget.style.backgroundColor = `${DARK}15` }}
                      onMouseLeave={e => { if (!catOpen) e.currentTarget.style.backgroundColor = "transparent" }}>
                      <Link
                        to={`/category/${cat.id}`}
                        onClick={() => setOpen(false)}
                        className="flex-1 px-3 py-3 text-sm font-extrabold transition-all duration-150"
                        style={{ color: NAVY }}
                        onMouseEnter={e => { e.currentTarget.style.color = "#fff" }}
                        onMouseLeave={e => { e.currentTarget.style.color = NAVY }}
                        onTouchStart={e => { e.currentTarget.style.color = "#fff" }}
                        onTouchEnd={e => { e.currentTarget.style.color = NAVY }}>
                        {cat.name}
                      </Link>
                      {cat.subcategories.length > 0 && (
                        <button
                          onClick={() => toggleMobile(cat.id)}
                          className="px-3 py-3 transition-all duration-150"
                          style={{ color: DARK }}
                          onMouseEnter={e => { e.currentTarget.style.color = "#fff" }}
                          onMouseLeave={e => { e.currentTarget.style.color = DARK }}>
                          {catOpen
                            ? <ChevronDown size={16} />
                            : <ChevronRight size={16} />}
                        </button>
                      )}
                    </div>

                    {/* ── Level 2: Subcategories — block hover with bg shift ── */}
                    {catOpen && (
                      <div className="ml-4 mb-2 mt-1 space-y-0.5 border-l-2 pl-3" style={{ borderColor: `${DARK}44` }}>
                        {cat.subcategories.map(sub => {
                          const subOpen = expandedSection[sub.id] ?? false
                          return (
                            <div key={sub.id}>
                              <div
                                className="flex items-center rounded-lg transition-all duration-150 cursor-pointer"
                                style={{ backgroundColor: subOpen ? `${DARK}18` : "transparent" }}
                                onMouseEnter={e => { if (!subOpen) e.currentTarget.style.backgroundColor = `${DARK}12` }}
                                onMouseLeave={e => { if (!subOpen) e.currentTarget.style.backgroundColor = "transparent" }}>
                                <span
                                  className="flex-1 px-2 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors duration-150"
                                  style={{ color: DARK }}>
                                  {sub.name}<Badge label={sub.badge} />
                                </span>
                                {sub.items.length > 0 && (
                                  <button
                                    onClick={() => toggleSection(sub.id)}
                                    className="px-2 py-2 transition-all duration-150"
                                    style={{ color: DARK }}
                                    onMouseEnter={e => { e.currentTarget.style.color = "#fff" }}
                                    onMouseLeave={e => { e.currentTarget.style.color = DARK }}>
                                    {subOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                  </button>
                                )}
                              </div>

                              {/* ── Level 3: Items — underline on hover ── */}
                              {subOpen && (
                                <div className="ml-2 border-l pl-3 space-y-0.5 pb-1" style={{ borderColor: `${DARK}30` }}>
                                  {sub.items.map(item => (
                                    <Link
                                      key={item.id}
                                      to={`/product/${nameToSlug(item.name)}`}
                                      onClick={() => setOpen(false)}
                                      className="block py-1.5 text-[13px] px-2 transition-all duration-150"
                                      style={{
                                        color: `${DARK}cc`,
                                        textDecoration: "none",
                                        borderBottom: "1px solid transparent",
                                      }}
                                      onMouseEnter={e => {
                                        e.currentTarget.style.color = NAVY
                                        e.currentTarget.style.borderBottomColor = `${DARK}80`
                                      }}
                                      onMouseLeave={e => {
                                        e.currentTarget.style.color = `${DARK}cc`
                                        e.currentTarget.style.borderBottomColor = "transparent"
                                      }}
                                      onTouchStart={e => { e.currentTarget.style.color = NAVY; e.currentTarget.style.borderBottomColor = `${DARK}80` }}
                                      onTouchEnd={e => { e.currentTarget.style.color = `${DARK}cc`; e.currentTarget.style.borderBottomColor = "transparent" }}>
                                      {item.name}<Badge label={item.badge} />
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

              {/* WhatsApp CTA */}
              <div className="pt-4 mt-4 border-t" style={{ borderColor: `${DARK}33` }}>
                <a href="https://wa.me/+919131387559" target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 px-3 py-3 text-sm font-semibold rounded-xl transition-colors"
                  style={{ color: "#166534", backgroundColor: "rgba(255,255,255,0.35)" }}>
                  💬 Chat on WhatsApp
                </a>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo + name — centred */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/mekal_logo.png" alt="Mekal Enterprises" className="h-9 w-auto object-contain" />
          <span className="font-extrabold text-xs leading-tight tracking-wide" style={{ color: DARK }}>
            MEKAL<br />ENTERPRISES
          </span>
        </Link>

        {/* Right: search + customer care */}
        <div className="flex items-center gap-0.5">
          <button onClick={() => setMobileSearch(s => !s)}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-black/10 transition-colors"
            style={{ color: DARK }}>
            <Search size={20} />
          </button>
          <a href="https://wa.me/+919131387559" target="_blank" rel="noreferrer"
            aria-label="Customer Care on WhatsApp"
            className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-black/10 transition-colors"
            title="Customer Care">
            <HeadphonesIcon size={22} style={{ color: DARK }} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-green-500 border border-white" />
          </a>
        </div>
      </div>

      {/* ── Mobile search bar (expands below top row) ── */}
      {mobileSearch && (
        <div ref={mobileSearchRef} className="md:hidden px-3 pb-3 relative">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search products..."
              className="w-full pl-9 pr-10 py-3 bg-white rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none shadow-md"
            />
            <button onClick={query ? clearSearch : () => setMobileSearch(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
              {searching ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />}
            </button>
          </div>
          {showDrop && results.length > 0 && (
            <div className="absolute left-3 right-3 top-full mt-1 bg-white rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden z-50 max-h-72 overflow-y-auto">
              <ul>
                {results.map(p => (
                  <li key={p.id}>
                    <button onClick={() => handleResultClick(p.name)}
                      className="w-full flex items-center gap-3 px-3 py-3 hover:bg-zinc-50 transition-colors text-left border-b last:border-b-0">
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0">
                        {p.image_url
                          ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full bg-zinc-200" />}
                      </div>
                      <span className="text-sm text-zinc-800 flex-1 leading-snug">{p.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          DESKTOP CATEGORIES BAR
         ══════════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block border-t relative" style={{ backgroundColor: BG, borderColor: `${DARK}33` }}>

        {/* Category triggers */}
        <div className="flex items-stretch justify-between px-2">
          {!navLoaded && (
            <div className="flex items-center px-4 py-2 text-xs" style={{ color: `${DARK}80` }}>
              <Loader2 size={12} className="animate-spin" />
            </div>
          )}

          {navTree.map(cat => {
            const [line1, line2] = splitAtAmpersand(cat.name)
            const isActive       = activeMenu === cat.id
            const hasSubs        = cat.subcategories.length > 0

            return (
              <div
                key={cat.id}
                ref={el => { triggerRefs.current[cat.id] = el }}
                onMouseEnter={() => handleTriggerEnter(cat.id)}
                onMouseLeave={handleMenuLeave}
                className="relative flex-1">
                <Link
                  to={`/category/${cat.id}`}
                  onClick={() => setActiveMenu(null)}
                  className="flex flex-col items-center justify-center w-full py-2.5 px-1 text-center transition-colors"
                  style={{
                    backgroundColor: isActive ? "rgba(0,0,0,0.1)" : "transparent",
                    color: DARK,
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.07)" }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent" }}>

                  {/* For single-line names: text + chevron inline on same row.
                      For & names: line1 on top, line2+chevron below. */}
                  {line2 ? (
                    <>
                      <span className="text-[13px] font-bold leading-tight whitespace-nowrap">{line1}</span>
                      <span className="flex items-center gap-0.5 text-[11px] font-bold leading-tight whitespace-nowrap">
                        {line2}
                        {hasSubs && (
                          <ChevronDown size={10} className={`flex-shrink-0 transition-transform ml-0.5 ${isActive ? "rotate-180" : ""}`} />
                        )}
                      </span>
                    </>
                  ) : (
                    <span className="flex items-center gap-1 text-[13px] font-bold leading-tight whitespace-nowrap">
                      {line1}
                      {hasSubs && (
                        <ChevronDown size={10} className={`flex-shrink-0 transition-transform ${isActive ? "rotate-180" : ""}`} />
                      )}
                    </span>
                  )}
                </Link>
              </div>
            )
          })}
        </div>

        {/* ── Mega dropdown — IDENTICAL logic to original ── */}
        {activeMenu && activeCat?.subcategories.length > 0 && (
          <div
            onMouseEnter={handleMenuEnter}
            onMouseLeave={handleMenuLeave}
            className="absolute top-full z-50 bg-white border border-zinc-100 rounded-b-2xl shadow-2xl overflow-hidden"
            style={{
              left:     menuLeft,
              width:    Math.min(820, typeof window !== "undefined" ? window.innerWidth - 16 : 820),
              minWidth: 480,
            }}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4 pb-3 border-b">
                <Link
                  to={`/category/${activeCat.id}`}
                  onClick={() => setActiveMenu(null)}
                  className="text-xs font-bold hover:underline"
                  style={{ color: DARK }}>
                  View all {activeCat.name} →
                </Link>
                <span className="text-[10px] text-zinc-400">
                  {activeCat.subcategories.reduce((n, s) => n + s.items.length, 0)} products
                </span>
              </div>

              <div className={`grid gap-x-6 gap-y-4 ${
                activeCat.subcategories.length <= 2 ? "grid-cols-2"
                : activeCat.subcategories.length <= 3 ? "grid-cols-3"
                : "grid-cols-4"}`}>
                {activeCat.subcategories.map(sub => (
                  <div key={sub.id}>
                    <Link
                      to={`/category/${activeCat.id}`}
                      onClick={() => setActiveMenu(null)}
                      className="block text-[10px] font-bold uppercase tracking-widest text-zinc-800 hover:text-[#065999] mb-2 border-b pb-1.5 transition-colors">
                      {sub.name}<Badge label={sub.badge} />
                    </Link>
                    {sub.items.length > 0 && (
                      <ul className="space-y-1">
                        {sub.items.map(item => (
                          <li key={item.id}>
                            <Link
                              to={`/product/${nameToSlug(item.name)}`}
                              onClick={() => setActiveMenu(null)}
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

    </header>
  )
}