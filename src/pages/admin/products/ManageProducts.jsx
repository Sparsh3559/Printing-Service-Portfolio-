import { useState, useEffect } from "react"
import AdminLayout from "../../../components/AdminLayout"
import { supabase } from "@/lib/supabase"
import { Trash2, Search, Loader2 } from "lucide-react"

export default function ManageProducts() {
  const [products,   setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState("")
  const [filterCat,  setFilterCat]  = useState("")
  const [deleting,   setDeleting]   = useState(null)

  async function fetchAll() {
    setLoading(true)
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from("Products").select("*, Categories(name)").order("created_at", { ascending: false }),
      supabase.from("Categories").select("*").order("name"),
    ])
    if (prods) setProducts(prods)
    if (cats)  setCategories(cats)
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return
    setDeleting(id)
    await supabase.from("Products").delete().eq("id", id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
    setDeleting(null)
  }

  async function toggleActive(id, current) {
    await supabase.from("Products").update({ is_active: !current }).eq("id", id)
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, is_active: !current } : p))
  }

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat    = filterCat ? String(p.category_id) === filterCat : true
    return matchSearch && matchCat
  })

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Manage Products</h1>
            <p className="text-sm text-zinc-500 mt-0.5">{products.length} products total</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900" />
          </div>
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
            className="border border-zinc-200 rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900">
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-zinc-400 py-12">
            <Loader2 size={18} className="animate-spin" /> Loading products...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-zinc-400 text-sm">No products found.</div>
        ) : (
          <div className="border border-zinc-100 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 border-b border-zinc-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-zinc-500">Product</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-500">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-500">Price</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-500">Tag</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-500">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id}
                    className={`border-b border-zinc-50 hover:bg-zinc-50 transition-colors ${i === filtered.length - 1 ? "border-b-0" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.image_url && (
                          <img src={p.image_url} alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-zinc-100 flex-shrink-0" />
                        )}
                        <span className="font-medium text-zinc-900 line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{p.Categories?.name || "—"}</td>
                    <td className="px-4 py-3 text-zinc-500">
                      {p.price ? `₹${p.price}` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {p.tag ? (
                        <span className="text-[11px] font-semibold uppercase tracking-wide bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">
                          {p.tag}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(p.id, p.is_active)}
                        className={`text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full transition-colors ${
                          p.is_active
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                        }`}>
                        {p.is_active ? "Active" : "Hidden"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => deleteProduct(p.id)} disabled={deleting === p.id}
                        className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors ml-auto">
                        {deleting === p.id
                          ? <Loader2 size={14} className="animate-spin text-zinc-400" />
                          : <Trash2 size={14} className="text-zinc-400 hover:text-red-500" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}