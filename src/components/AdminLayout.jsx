import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboard, PackagePlus, Package,
  Image, Tag, LogOut,
} from "lucide-react"
import { supabase } from "@/lib/supabase"

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
    <div className="min-h-screen flex bg-zinc-50">

      {/* ── Sidebar ── */}
      <aside className="w-60 bg-white border-r flex flex-col p-5 flex-shrink-0">

        {/* Logo */}
        <div className="mb-8 px-2">
          <img
            src="/mekal_logo.png"
            alt="Mekal"
            className="h-10 w-auto object-contain"
            onError={e => { e.target.style.display = "none" }}
          />
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = to === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(to)
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* User info + logout */}
        <div className="border-t pt-4 mt-4 space-y-1">
          {userEmail && (
            <div className="px-3 py-1">
              <p className="text-[11px] text-zinc-400 truncate" title={userEmail}>
                {userEmail}
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
          >
            <LogOut size={16} />
            {loggingOut ? "Signing out…" : "Sign Out"}
          </button>
        </div>

      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>

    </div>
  )
}