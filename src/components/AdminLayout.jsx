import { Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  PackagePlus,
  Package,
  Image,
  Tag,
} from "lucide-react"

const navItems = [
  { to: "/admin",             label: "Dashboard",          icon: LayoutDashboard },
  { to: "/admin/add-product", label: "Add Product",         icon: PackagePlus     },
  { to: "/admin/products",    label: "Manage Products",     icon: Package         },
  { to: "/admin/categories",  label: "Categories",          icon: Tag             },
  { to: "/admin/banners",     label: "Banners",             icon: Image           },
]

export default function AdminLayout({ children }) {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen flex bg-zinc-50">

      {/* ── Sidebar ── */}
      <aside className="w-60 bg-white border-r flex flex-col p-5 flex-shrink-0">
        <h2 className="text-lg font-semibold mb-8 px-2">Admin Panel</h2>

        <nav className="flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            // exact match for dashboard, startsWith for others
            const isActive =
              to === "/admin" ? pathname === "/admin" : pathname.startsWith(to)

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
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>

    </div>
  )
}