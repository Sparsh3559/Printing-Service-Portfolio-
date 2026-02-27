import { useState, useEffect } from "react"
import AdminLayout from "@/components/AdminLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Pencil, Loader2, X, Check, Search, PackageX } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function ManageProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [deletingId, setDeletingId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [saving, setSaving] = useState(false)

  // ── Fetch ─────────────────────────────────────────────────────────────────
  async function fetchProducts() {
    const { data, error } = await supabase
      .from("Products")
      .select("*, Categories(name)")
      .order("created_at", { ascending: false })
    if (!error) setProducts(data)
    setLoading(false)
  }

  async function fetchCategories() {
    const { data } = await supabase
      .from("Categories")
      .select("id, name")
      .is("parent_id", null)
      .order("name")
    if (data) setCategories(data)
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  // ── Realtime ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel("products-admin")
      .on("postgres_changes", { event: "*", schema: "public", table: "Products" }, fetchProducts)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  // ── Delete ────────────────────────────────────────────────────────────────
  async function handleDelete(product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    setDeletingId(product.id)

    // Remove image from storage if exists
    if (product.image_url) {
      const parts = product.image_url.split("/")
      const fileName = parts[parts.length - 1]
      await supabase.storage.from("products").remove([fileName])
    }

    const { error } = await supabase.from("Products").delete().eq("id", product.id)
    if (error) alert("Delete failed: " + error.message)
    setDeletingId(null)
  }

  // ── Edit ──────────────────────────────────────────────────────────────────
  function startEdit(product) {
    setEditingId(product.id)
    setEditData({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      category_id: product.category_id ?? "",
      is_featured: product.is_featured ?? false,
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setEditData({})
  }

  async function saveEdit(id) {
    if (!editData.name.trim()) return
    setSaving(true)
    const { error } = await supabase
      .from("Products")
      .update({
        name: editData.name.trim(),
        description: editData.description.trim() || null,
        price: editData.price !== "" ? Number(editData.price) : null,
        category_id: editData.category_id ? Number(editData.category_id) : null,
        is_featured: editData.is_featured,
      })
      .eq("id", id)

    if (error) alert("Save failed: " + error.message)
    else cancelEdit()
    setSaving(false)
  }

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  )

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-semibold">Manage Products</h1>
        <span className="text-sm text-muted-foreground">{products.length} total</span>
      </div>
      <p className="text-sm text-muted-foreground mb-6">Edit or delete products. Changes sync live.</p>

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products…"
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 size={15} className="animate-spin" /> Loading products…
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
          <PackageX size={36} strokeWidth={1.5} />
          <p className="text-sm">
            {search ? `No products match "${search}"` : "No products yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((product) =>
            editingId === product.id ? (
              // ── EDIT MODE ────────────────────────────────────────────────
              <Card key={product.id} className="p-5 border-primary/40">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Name *</label>
                    <Input
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Price (₹)</label>
                    <Input
                      type="number"
                      value={editData.price}
                      onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
                    <select
                      className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                      value={editData.category_id}
                      onChange={(e) => setEditData({ ...editData, category_id: e.target.value })}
                    >
                      <option value="">No category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id={`feat-${product.id}`}
                      checked={editData.is_featured}
                      onChange={(e) => setEditData({ ...editData, is_featured: e.target.checked })}
                      className="w-4 h-4 accent-primary"
                    />
                    <label htmlFor={`feat-${product.id}`} className="text-sm">Featured Product</label>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
                    <Textarea
                      rows={3}
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" onClick={() => saveEdit(product.id)} disabled={saving}>
                    {saving ? <Loader2 size={13} className="animate-spin mr-1" /> : <Check size={13} className="mr-1" />}
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={cancelEdit}>
                    <X size={13} className="mr-1" /> Cancel
                  </Button>
                </div>
              </Card>
            ) : (
              // ── VIEW MODE ────────────────────────────────────────────────
              <Card key={product.id} className="p-4">
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 text-muted-foreground text-xs">
                      No img
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium truncate">{product.name}</p>
                      {product.is_featured && (
                        <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-sm text-muted-foreground flex-wrap">
                      {product.price != null && (
                        <span>₹{Number(product.price).toLocaleString("en-IN")}</span>
                      )}
                      {product.Categories?.name && (
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                          {product.Categories.name}
                        </span>
                      )}
                    </div>
                    {product.description && (
                      <p className="text-xs text-muted-foreground mt-1 truncate max-w-md">
                        {product.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" onClick={() => startEdit(product)}>
                      <Pencil size={13} className="mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={deletingId === product.id}
                      onClick={() => handleDelete(product)}
                    >
                      {deletingId === product.id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Trash2 size={13} />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            )
          )}
        </div>
      )}
    </AdminLayout>
  )
}