import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { ChevronDown, ChevronRight } from "lucide-react"

// ── Slug helper ───────────────────────────────────────────────────────────────
const toSlug = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

// ── Hardcoded category data ───────────────────────────────────────────────────
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

  const toggleMobile = (label) =>
    setExpandedMobile((prev) => ({ ...prev, [label]: !prev[label] }))

  const toggleSection = (key) =>
    setExpandedSection((prev) => ({ ...prev, [key]: !prev[key] }))

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
                const catSlug = toSlug(cat.label)
                const isOpen = expandedMobile[cat.label]
                return (
                  <div key={cat.label}>
                    {/* Parent — click label to go to category page, chevron to expand */}
                    <div className="flex items-center">
                      <Link
                        to={`/category/${catSlug}`}
                        onClick={() => setOpen(false)}
                        className="flex-1 px-3 py-2.5 text-sm font-semibold hover:bg-zinc-50 rounded-lg transition-colors"
                      >
                        {cat.label}
                      </Link>
                      <button
                        onClick={() => toggleMobile(cat.label)}
                        className="px-2 py-2.5 rounded-lg hover:bg-zinc-50 transition-colors"
                      >
                        {isOpen
                          ? <ChevronDown size={15} className="text-zinc-400" />
                          : <ChevronRight size={15} className="text-zinc-400" />}
                      </button>
                    </div>

                    {/* Sub-category sections */}
                    {isOpen && (
                      <div className="ml-3 border-l pl-3 mt-1 space-y-2 mb-2">
                        {cat.sections.map((sec) => {
                          const secSlug = toSlug(sec.heading)
                          const secKey = cat.label + sec.heading
                          const secOpen = expandedSection[secKey] ?? true
                          return (
                            <div key={sec.heading}>
                              <div className="flex items-center">
                                <Link
                                  to={`/category/${catSlug}/${secSlug}`}
                                  onClick={() => setOpen(false)}
                                  className="flex-1 px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 transition-colors"
                                >
                                  {sec.heading}
                                </Link>
                                <button
                                  onClick={() => toggleSection(secKey)}
                                  className="px-1 text-zinc-400 hover:text-zinc-700"
                                >
                                  {secOpen
                                    ? <ChevronDown size={12} />
                                    : <ChevronRight size={12} />}
                                </button>
                              </div>
                              {secOpen && (
                                <div className="ml-2 space-y-0.5">
                                  {sec.items.map((item) => (
                                    <Link
                                      key={item}
                                      to={`/product/${toSlug(item)}`}
                                      onClick={() => setOpen(false)}
                                      className="block px-2 py-1.5 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded transition-colors"
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
        <img
          src="/mekal_logo.png"
          alt="Mekal Enterprises"
          className="h-12 w-auto object-contain"
        />

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-xl mx-6">
          <Input
            placeholder="Search products..."
            className="bg-white/15 border-white/20 text-white placeholder:text-white/50 focus:bg-white focus:text-zinc-900 transition-colors"
          />
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
            {NAV_CATEGORIES.map((cat) => {
              const catSlug = toSlug(cat.label)
              return (
                <NavigationMenuItem key={cat.label}>
                  <NavigationMenuTrigger
                    className="text-sm font-medium text-white bg-transparent hover:bg-white/10 data-[state=open]:bg-white/10"
                    // Allow clicking the label itself to navigate to category page
                    onPointerDown={(e) => {
                      // Only navigate on direct click (not just hover/keyboard open)
                      if (e.pointerType === "mouse" && e.button === 0) {
                        // Navigation is handled by the Link below via the rendered label
                      }
                    }}
                  >
                    {/* Wrap label in Link but stop propagation so the dropdown still works */}
                    <Link
                      to={`/category/${catSlug}`}
                      className="mr-1 hover:underline underline-offset-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {cat.label}
                    </Link>
                  </NavigationMenuTrigger>

                  <NavigationMenuContent>
                    {/* Mega menu */}
                    <div className="p-6 w-[860px]">
                      <div className="grid grid-cols-4 gap-x-8 gap-y-6">
                        {cat.sections.map((sec) => {
                          const secSlug = toSlug(sec.heading)
                          return (
                            <div key={sec.heading}>
                              {/* Sub-category heading → sub-category page */}
                              <Link
                                to={`/category/${catSlug}/${secSlug}`}
                                className="block text-xs font-bold uppercase tracking-widest text-zinc-900 mb-3 border-b pb-1.5 hover:text-[#065999] transition-colors"
                              >
                                {sec.heading}
                              </Link>
                              <ul className="space-y-1.5">
                                {sec.items.map((item) => (
                                  <li key={item}>
                                    {/* Product item → product page */}
                                    <NavigationMenuLink asChild>
                                      <Link
                                        to={`/product/${toSlug(item)}`}
                                        className="block text-sm text-zinc-500 hover:text-zinc-900 cursor-pointer transition-colors leading-snug"
                                      >
                                        {item}
                                      </Link>
                                    </NavigationMenuLink>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

    </header>
  )
}