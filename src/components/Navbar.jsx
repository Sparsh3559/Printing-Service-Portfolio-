import { useState, useEffect } from "react"
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
import { supabase } from "@/lib/supabase"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState([])   // parent categories
  const [children, setChildren] = useState([])        // subcategories
  const [expandedMobile, setExpandedMobile] = useState({})

  // ── Fetch categories ──────────────────────────────────────────────────────
  async function fetchCategories() {
    const { data, error } = await supabase
      .from("Categories")
      .select("*")
      .order("name")
    if (error || !data) return
    setCategories(data.filter((c) => c.parent_id === null))
    setChildren(data.filter((c) => c.parent_id !== null))
  }

  useEffect(() => { fetchCategories() }, [])

  // ── Realtime — navbar updates when admin adds/removes categories ──────────
  useEffect(() => {
    const channel = supabase
      .channel("navbar-categories")
      .on("postgres_changes", { event: "*", schema: "public", table: "Categories" }, fetchCategories)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const subsOf = (parentId) => children.filter((c) => c.parent_id === parentId)

  const toggleMobile = (id) =>
    setExpandedMobile((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <header className="sticky top-0 z-50 bg-white border-b">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-6 py-3">

        {/* Mobile hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden">☰</Button>
          </SheetTrigger>

          {/* ── Mobile drawer ── */}
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <div className="space-y-2 mt-6">
              <h2 className="text-lg font-bold px-2 mb-4">Categories</h2>

              {categories.length === 0 ? (
                <p className="text-sm text-muted-foreground px-2">No categories yet.</p>
              ) : (
                categories.map((cat) => {
                  const subs = subsOf(cat.id)
                  const isOpen = expandedMobile[cat.id]
                  return (
                    <div key={cat.id}>
                      <button
                        onClick={() => subs.length > 0 && toggleMobile(cat.id)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-muted text-sm font-medium transition-colors"
                      >
                        <span>{cat.name}</span>
                        {subs.length > 0 && (
                          isOpen
                            ? <ChevronDown size={15} className="text-muted-foreground" />
                            : <ChevronRight size={15} className="text-muted-foreground" />
                        )}
                      </button>

                      {/* Mobile subcategories */}
                      {isOpen && subs.length > 0 && (
                        <div className="ml-4 mt-1 space-y-1 border-l pl-3">
                          {subs.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => setOpen(false)}
                              className="w-full text-left px-2 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
                            >
                              {sub.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <div className="text-xl font-bold">PRINT HUB</div>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-xl mx-6">
          <Input placeholder="Search products..." />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost">Support</Button>
          <Button>Login</Button>
        </div>
      </div>

      {/* ── Desktop categories bar ── */}
      <div className="hidden md:flex justify-center border-t bg-white">
        <NavigationMenu>
          <NavigationMenuList>
            {categories.map((cat) => {
              const subs = subsOf(cat.id)
              return (
                <NavigationMenuItem key={cat.id}>
                  {subs.length > 0 ? (
                    <>
                      <NavigationMenuTrigger>{cat.name}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 p-6 w-[380px]">
                          {subs.map((sub) => (
                            <NavigationMenuLink
                              key={sub.id}
                              className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                            >
                              {sub.name}
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink className="px-4 py-2 text-sm font-medium cursor-pointer hover:text-foreground/70 transition-colors">
                      {cat.name}
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

    </header>
  )
}