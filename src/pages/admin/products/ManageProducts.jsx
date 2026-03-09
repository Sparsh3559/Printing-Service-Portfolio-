import { useState, useEffect, useRef } from "react"
import AdminLayout from "../../components/AdminLayout"
import { supabase } from "@/lib/supabase"
import { Trash2, Search, Loader2, Pencil, X, Check, Upload } from "lucide-react"

export default function ManageProducts() {
  const [products,        setProducts]        = useState([])
  const [categories,      setCategories]      = useState([])
  const [loading,         setLoading]         = useState(true)
  const [search,          setSearch]          = useState("")
  const [filterCat,       setFilterCat]       = useState("")
  const [deleting,        setDeleting]        = useState(null)
  const [editingId,       setEditingId]       = useState(null)
  const [editData,        setEditData]        = useState({})
  const [saving,          setSaving]          = useState(false)
  const [newImageFile,    setNewImageFile]    = useState(null)
  const [newImagePreview, setNewImagePreview] = useState(null)
  const fileRef = useRef(null)

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
    if (!confirm("Delete this product? This cannot be undone.")) return
    setDeleting(id)
    await supabase.from("Products").delete().eq("id", id)
    setProducts(prev => prev.filter(p => p.id !== id))
    setDeleting(null)
  }

  async function toggleActive(id, current) {
    await supabase.from("Products").update({ is_active: !current }).eq("id", id)
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !current } : p))
  }

  function startEdit(p) {
    setEditingId(p.id)
    setEditData({
      name:        p.name        || "",
      description: p.description || "",
      price:       p.price       || "",
      tag:         p.tag         || "",
      category_id: String(p.category_id || ""),
      image_url:   p.image_url   || "",
    })
    setNewImageFile(null)
    setNewImagePreview(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditData({})
    setNewImageFile(null)
    setNewImagePreview(null)
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert("Image must be under 5MB"); return }
    setNewImageFile(file)
    setNewImagePreview(URL.createObjectURL(file))
  }

  async function uploadImage(file) {
    const ext  = file.name.split(".").pop()
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, file, { cacheControl: "3600" })
    if (error) throw new Error(error.message)
    return supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl
  }

  async function saveEdit(id) {
    setSaving(true)
    try {
      let image_url = editData.image_url
      if (newImageFile) image_url = await uploadImage(newImageFile)

      const { error } = await supabase.from("Products").update({
        name:        editData.name.trim(),
        description: editData.description.trim() || null,
        price:       editData.price ? parseFloat(editData.price) : null,
        tag:         editData.tag.trim() || null,
        category_id: editData.category_id ? parseInt(editData.category_id) : null,
        image_url:   image_url || null,
      }).eq("id", id)

      if (error) throw new Error(error.message)

      const matchedCat = categories.find(c => c.id === parseInt(editData.category_id))
      setProducts(prev => prev.map(p => p.id === id ? {
        ...p,
        name:        editData.name.trim(),
        description: editData.description.trim() || null,
        price:       editData.price ? parseFloat(editData.price) : null,
        tag:         editData.tag.trim() || null,
        category_id: editData.category_id ? parseInt(editData.category_id) : null,
        image_url:   image_url || null,
        Categories:  matchedCat ? { name: matchedCat.name } : p.Categories,
      } : p))

      cancelEdit()
    } catch (e) {
      alert("Save failed: " + e.message)
    }
    setSaving(false)
  }

  const filtered = products.filter(p => {
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
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900" />
          </div>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
            className="border border-zinc-200 rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900">
            <option value="">All categories</option>
            {categories.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-zinc-400 py-12">
            <Loader2 size={18} className="animate-spin" /> Loading products...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-zinc-400 text-sm">No products found.</div>
        ) : (
          <div className="space-y-2">
            {filtered.map(p => (
              <div key={p.id} className="border border-zinc-100 rounded-2xl overflow-hidden bg-white">

                {/* ── Normal row ── */}
                {editingId !== p.id ? (
                  <div className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0">
                      {p.image_url
                        ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-zinc-300 text-[9px] text-center px-1">No image</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-zinc-900 text-sm line-clamp-1">{p.name}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">{p.Categories?.name || "—"}</p>
                    </div>
                    <div className="text-sm text-zinc-500 w-20 text-right hidden md:block">
                      {p.price ? `₹${p.price}` : "—"}
                    </div>
                    <div className="w-28 hidden md:block">
                      {p.tag
                        ? <span className="text-[10px] font-semibold uppercase tracking-wide bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">{p.tag}</span>
                        : <span className="text-zinc-300 text-xs">no tag</span>}
                    </div>
                    <button onClick={() => toggleActive(p.id, p.is_active)}
                      className={`text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full transition-colors ${
                        p.is_active ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                      }`}>
                      {p.is_active ? "Active" : "Hidden"}
                    </button>
                    <div className="flex items-center gap-1">
                      <button onClick={() => startEdit(p)}
                        title="Edit product"
                        className="w-8 h-8 rounded-lg hover:bg-blue-50 flex items-center justify-center transition-colors">
                        <Pencil size={14} className="text-zinc-400 hover:text-blue-500" />
                      </button>
                      <button onClick={() => deleteProduct(p.id)} disabled={deleting === p.id}
                        title="Delete product"
                        className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors">
                        {deleting === p.id
                          ? <Loader2 size={14} className="animate-spin text-zinc-400" />
                          : <Trash2 size={14} className="text-zinc-400 hover:text-red-500" />}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ── Edit panel ── */
                  <div className="p-5 bg-blue-50/40">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-semibold text-zinc-700">Editing: <span className="text-blue-600">{p.name}</span></p>
                      <button onClick={cancelEdit} className="text-zinc-400 hover:text-zinc-700 transition-colors">
                        <X size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Left */}
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-semibold text-zinc-500 mb-1 block">Product Name *</label>
                          <input value={editData.name}
                            onChange={e => setEditData(d => ({ ...d, name: e.target.value }))}
                            className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-zinc-500 mb-1 block">Description</label>
                          <textarea value={editData.description}
                            onChange={e => setEditData(d => ({ ...d, description: e.target.value }))}
                            rows={5}
                            className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold text-zinc-500 mb-1 block">Price (₹)</label>
                            <input type="number" value={editData.price}
                              onChange={e => setEditData(d => ({ ...d, price: e.target.value }))}
                              placeholder="e.g. 299"
                              className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-zinc-500 mb-1 block">Tag</label>
                            <input value={editData.tag}
                              onChange={e => setEditData(d => ({ ...d, tag: e.target.value }))}
                              placeholder="e.g. corporate-gift"
                              className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400" />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-zinc-500 mb-1 block">Category</label>
                          <select value={editData.category_id}
                            onChange={e => setEditData(d => ({ ...d, category_id: e.target.value }))}
                            className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400">
                            <option value="">Select category</option>
                            {categories.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
                          </select>
                        </div>
                      </div>

                      {/* Right — Image */}
                      <div>
                        <label className="text-xs font-semibold text-zinc-500 mb-1 block">Product Image</label>
                        <div className="w-full aspect-video rounded-xl overflow-hidden bg-zinc-100 mb-3">
                          {(newImagePreview || editData.image_url)
                            ? <img src={newImagePreview || editData.image_url} alt="Preview" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-zinc-300 text-sm">No image</div>}
                        </div>
                        <input value={editData.image_url}
                          onChange={e => { setEditData(d => ({ ...d, image_url: e.target.value })); setNewImagePreview(null); setNewImageFile(null) }}
                          placeholder="Paste image URL here"
                          className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2" />
                        <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        <button onClick={() => fileRef.current?.click()}
                          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-zinc-200 rounded-xl py-3 text-sm text-zinc-400 hover:border-blue-300 hover:text-blue-500 transition-colors bg-white">
                          <Upload size={14} /> Upload new image from computer
                        </button>
                        {newImageFile && <p className="text-xs text-green-600 mt-1.5">✓ Ready to upload: {newImageFile.name}</p>}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-5 pt-4 border-t border-zinc-200">
                      <button onClick={() => saveEdit(p.id)} disabled={saving || !editData.name.trim()}
                        className="inline-flex items-center gap-2 bg-zinc-900 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-zinc-700 transition-colors disabled:opacity-50">
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                        {saving ? "Saving…" : "Save Changes"}
                      </button>
                      <button onClick={cancelEdit}
                        className="text-sm text-zinc-500 hover:text-zinc-800 px-4 py-2.5 rounded-xl hover:bg-zinc-100 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}