import { Link } from "react-router-dom"

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-zinc-50">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r p-6">
        <h2 className="text-xl font-semibold mb-8">
          Admin Panel
        </h2>

        <nav className="flex flex-col gap-4 text-sm">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/add-product">Add Product</Link>
          <Link to="/admin/products">Manage Products</Link>
          <Link to="/admin/banners">Banners</Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}