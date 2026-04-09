import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import {
  LayoutDashboard, PackagePlus, Package,
  Tag, Image, LogOut, Menu, X, MessageSquare,
} from "lucide-react"

const DARK  = "#065999"
const BRAND = "#5fc7f4"

const navItems = [
  { to: "/admin",             label: "Dashboard",       icon: LayoutDashboard },
  { to: "/admin/add-product", label: "Add Product",     icon: PackagePlus     },
  { to: "/admin/products",    label: "Manage Products", icon: Package         },
  { to: "/admin/categories",  label: "Categories",      icon: Tag             },
  { to: "/admin/banners",     label: "Banners",         icon: Image           },
  { to: "/admin/reviews",     label: "Reviews",         icon: MessageSquare   },
]

export default function AdminLayout({ children }) {
  const { pathname } = useLocation()
  const navigate     = useNavigate()
  const [sideOpen,   setSideOpen] = useState(false)

  async function signOut() {
    await supabase.auth.signOut()
    navigate("/admin/login")
  }

  const activeLabel = navItems.find(n =>
    n.to === "/admin" ? pathname === "/admin" : pathname.startsWith(n.to)
  )?.label || "Admin"

  const SidebarContent = () => (
    <div className="flex flex-col h-full" style={{ backgroundColor: DARK }}>

      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: "rgba(95,199,244,0.2)" }}>
        <img src="/mekal_logo.png" alt="Mekal" className="h-14 w-auto object-contain mb-2"
          onError={e => { e.target.style.display = "none" }} />
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: BRAND }}>
          Admin Panel
        </p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-3 py-4 flex-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = to === "/admin" ? pathname === "/admin" : pathname.startsWith(to)
          return (
            <Link key={to} to={to} onClick={() => setSideOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active ? "text-white" : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
              style={active ? { backgroundColor: "rgba(95,199,244,0.25)" } : {}}>
              <Icon size={17} className={active ? "text-white" : "text-white/50"} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t" style={{ borderColor: "rgba(95,199,244,0.2)" }}>
        <button onClick={signOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all">
          <LogOut size={16} className="text-white/50" />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sideOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-56 flex-shrink-0 flex flex-col"><SidebarContent /></div>
          <div className="flex-1 bg-black/40" onClick={() => setSideOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="flex items-center justify-between px-4 md:px-6 h-14 bg-white border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSideOpen(true)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-zinc-100">
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-semibold text-zinc-800">{activeLabel}</h1>
          </div>
          <Link to="/" target="_blank"
            className="text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-500">
            View Site →
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}