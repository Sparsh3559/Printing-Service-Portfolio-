import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboard, PackagePlus, Package,
  Image, Tag, LogOut, ChevronRight,
} from "lucide-react"
import { supabase } from "@/lib/supabase"

const BRAND   = "#5fc7f4"
const DARK    = "#065999"

const navItems = [
  { to: "/admin",             label: "Dashboard",       icon: LayoutDashboard },
  { to: "/admin/add-product", label: "Add Product",     icon: PackagePlus     },
  { to: "/admin/products",    label: "Manage Products", icon: Package         },
  { to: "/admin/categories",  label: "Categories",      icon: Tag             },
  { to: "/admin/banners",     label: "Banners",         icon: Image           },
]

export default function AdminLayout({ children }) {
  const { pathname } = useLocation()
  const navigate     = useNavigate()
  const [userEmail, setUserEmail]   = useState("")
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user?.email || "")
    })
  }, [])

  async function handleLogout() {
    setLoggingOut(true)
    await supabase.auth.signOut()
    navigate("/admin/login")
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#f0f9ff" }}>

      {/* ── Sidebar ── */}
      <aside
        className="w-64 flex flex-col flex-shrink-0 shadow-lg"
        style={{ backgroundColor: DARK }}
      >
        {/* Top accent bar */}
        <div className="h-1 w-full" style={{ backgroundColor: BRAND }} />

        {/* Logo area */}
        <div className="px-6 py-5 border-b" style={{ borderColor: "rgba(95,199,244,0.2)" }}>
          <img
            src="/mekal_logo.png"
            alt="Mekal"
            className="h-16 w-auto object-contain"
            onError={e => { e.target.style.display = "none" }}
          />
          <p className="text-xs mt-2 font-semibold uppercase tracking-widest" style={{ color: BRAND }}>
            Admin Panel
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-0.5 px-3 py-4 flex-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = to === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(to)

            return (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group"
                style={isActive
                  ? { backgroundColor: BRAND, color: DARK }
                  : { color: "rgba(255,255,255,0.65)" }
                }
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = "rgba(95,199,244,0.12)" }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent" }}
              >
                <Icon size={16} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} style={{ color: DARK }} />}
              </Link>
            )
          })}
        </nav>

        {/* User + logout */}
        <div className="px-3 pb-5 pt-3 border-t" style={{ borderColor: "rgba(95,199,244,0.2)" }}>
          {userEmail && (
            <div className="px-3 py-2 mb-1 rounded-lg" style={{ backgroundColor: "rgba(95,199,244,0.08)" }}>
              <p className="text-[11px] font-medium truncate" style={{ color: BRAND }} title={userEmail}>
                {userEmail}
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
            style={{ color: "rgba(255,255,255,0.55)" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.15)"; e.currentTarget.style.color = "#f87171" }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.55)" }}
          >
            <LogOut size={16} />
            {loggingOut ? "Signing out…" : "Sign Out"}
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">

        {/* Top header bar */}
        <header
          className="flex items-center justify-between px-8 py-4 border-b bg-white shadow-sm flex-shrink-0"
        >
          {/* Page title derived from current path */}
          <div>
            <h1 className="text-lg font-bold" style={{ color: DARK }}>
              {navItems.find(n =>
                n.to === "/admin" ? pathname === "/admin" : pathname.startsWith(n.to)
              )?.label ?? "Admin"}
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">Mekal Enterprises</p>
          </div>

          {/* Right side — accent pill */}
          <div
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: `${BRAND}22`, color: DARK }}
          >
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: BRAND }} />
            Live
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>

    </div>
  )
}