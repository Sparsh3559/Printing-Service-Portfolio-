import { useState, useEffect, useRef } from "react"
import AdminLayout from "@/components/AdminLayout"
import { supabase } from "@/lib/supabase"
import { Trash2, Search, Loader2, Pencil, X, Check, Upload, Star, Plus } from "lucide-react"

export default function ManageProducts() {
  const [products,   setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState("")
  const [filterCat,  setFilterCat]  = useState("")
  const [deleting,   setDeleting]   = useState(null)
  const [editingId,  setEditingId]  = useState(null)
  const [editData,   setEditData]   = useState({})
  const [saving,     setSaving]     = useState(false)

  // Multi-image state
  const [imageList,     setImageList]     = useState([])  // [{url, file?, preview?, isNew?}]
  const [uploadingIdx,  setUploadingIdx]  = useState(null)
  const fileRef    = useRef(null)
  const urlInputRef = useRef(null)
  const [urlInput, setUrlInput] = useState("")

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
    })
    // Build imageList from existing data
    const existing = p.images?.length
      ? p.images.map(url => ({ url, isNew: false }))
      : p.image_url
      ? [{ url: p.image_url, isNew: false }]
      : []
    setImageList(existing)
    setUrlInput("")
  }

  function cancelEdit() {
    setEditingId(null)
    setEditData({})
    setImageList([])
    setUrlInput("")
  }

  // ── Upload a single file to Supabase storage ──────────────────────────────
  async function uploadFile(file) {
    const ext  = file.name.split(".").pop()
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from("products").upload(path, file, { cacheControl: "3600" })
    if (error) throw new Error(error.message)
    return supabase.storage.from("products").getPublicUrl(path).data.publicUrl
  }

  // ── Handle file picker (multiple files) ──────────────────────────────────
  function handleFilePick(e) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const tooBig = files.find(f => f.size > 5 * 1024 * 1024)
    if (tooBig) { alert(`${tooBig.name} is over 5MB`); return }
    const newItems = files.map(file => ({
      url:     URL.createObjectURL(file),
      file,
      isNew:   true,
    }))
    setImageList(prev => [...prev, ...newItems])
    e.target.value = ""
  }

  // ── Add image by URL ──────────────────────────────────────────────────────
  function addByUrl() {
    const trimmed = urlInput.trim()
    if (!trimmed) return
    if (imageList.find(i => i.url === trimmed)) { alert("Already added"); return }
    setImageList(prev => [...prev, { url: trimmed, isNew: false }])
    setUrlInput("")
  }

  // ── Remove image from list ────────────────────────────────────────────────
  function removeImage(idx) {
    setImageList(prev => prev.filter((_, i) => i !== idx))
  }

  // ── Set as primary (move to index 0) ─────────────────────────────────────
  function setPrimary(idx) {
    setImageList(prev => {
      const copy = [...prev]
      const [item] = copy.splice(idx, 1)
      return [item, ...copy]
    })
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  async function saveEdit(id) {
    setSaving(true)
    try {
      // Upload any new files
      const resolvedList = []
      for (let i = 0; i < imageList.length; i++) {
        const item = imageList[i]
        if (item.file) {
          setUploadingIdx(i)
          const uploaded = await uploadFile(item.file)
          resolvedList.push(uploaded)
        } else {
          resolvedList.push(item.url)
        }
      }
      setUploadingIdx(null)

      const primaryUrl = resolvedList[0] || null

      const { error } = await supabase.from("Products").update({
        name:        editData.name.trim(),
        description: editData.description.trim() || null,
        price:       editData.price ? parseFloat(editData.price) : null,
        tag:         editData.tag.trim() || null,
        category_id: editData.category_id ? parseInt(editData.category_id) : null,
        image_url:   primaryUrl,
        images:      resolvedList,
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
        image_url:   primaryUrl,
        images:      resolvedList,
        Categories:  matchedCat ? { name: matchedCat.name } : p.Categories,
      } : p))

      cancelEdit()
    } catch (e) {
      setUploadingIdx(null)
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
                    {/* Thumbnail — show up to 3 stacked */}
                    <div className="flex -space-x-2 flex-shrink-0">
                      {(p.images?.length ? p.images.slice(0, 3) : p.image_url ? [p.image_url] : []).map((url, i) => (
                        <div key={i} className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-100 border-2 border-white flex-shrink-0"
                          style={{ zIndex: 3 - i }}>
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {!p.image_url && !p.images?.length && (
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-[9px] text-zinc-300">No img</div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-zinc-900 text-sm line-clamp-1">{p.name}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {p.Categories?.name || "—"}
                        {p.images?.length > 1 && <span className="ml-2 text-[#5fc7f4] font-medium">{p.images.length} photos</span>}
                      </p>
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
                      <button onClick={() => startEdit(p)} title="Edit"
                        className="w-8 h-8 rounded-lg hover:bg-blue-50 flex items-center justify-center transition-colors">
                        <Pencil size={14} className="text-zinc-400 hover:text-blue-500" />
                      </button>
                      <button onClick={() => deleteProduct(p.id)} disabled={deleting === p.id} title="Delete"
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
                      <button onClick={cancelEdit} className="text-zinc-400 hover:text-zinc-700"><X size={16} /></button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                      {/* ── Left: fields ── */}
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
                            rows={5} className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
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

                      {/* ── Right: multi-image manager ── */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-semibold text-zinc-500">
                            Product Images
                            <span className="ml-1 font-normal text-zinc-400">({imageList.length})</span>
                          </label>
                          {imageList.length > 0 && (
                            <span className="text-[10px] text-zinc-400">⭐ = primary · click to reorder</span>
                          )}
                        </div>

                        {/* Image grid */}
                        {imageList.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            {imageList.map((img, idx) => (
                              <div key={idx} className={`relative rounded-xl overflow-hidden aspect-square bg-zinc-100 group ${idx === 0 ? "ring-2 ring-[#5fc7f4]" : ""}`}>
                                <img src={img.url} alt="" className="w-full h-full object-cover" />

                                {/* Primary star */}
                                {idx === 0 && (
                                  <div className="absolute top-1 left-1 bg-[#5fc7f4] rounded-full p-0.5">
                                    <Star size={10} className="text-white fill-white" />
                                  </div>
                                )}

                                {/* Upload indicator */}
                                {uploadingIdx === idx && (
                                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                                    <Loader2 size={18} className="animate-spin text-blue-500" />
                                  </div>
                                )}

                                {/* Hover actions */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                                  {idx !== 0 && (
                                    <button onClick={() => setPrimary(idx)}
                                      title="Set as primary"
                                      className="w-7 h-7 bg-white rounded-full flex items-center justify-center hover:bg-yellow-50">
                                      <Star size={12} className="text-amber-500" />
                                    </button>
                                  )}
                                  <button onClick={() => removeImage(idx)}
                                    title="Remove"
                                    className="w-7 h-7 bg-white rounded-full flex items-center justify-center hover:bg-red-50">
                                    <X size={12} className="text-red-500" />
                                  </button>
                                </div>
                              </div>
                            ))}

                            {/* Add more slot */}
                            <button onClick={() => fileRef.current?.click()}
                              className="aspect-square rounded-xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-1 hover:border-blue-300 hover:bg-blue-50/50 transition-colors group">
                              <Plus size={18} className="text-zinc-300 group-hover:text-blue-400" />
                              <span className="text-[10px] text-zinc-300 group-hover:text-blue-400">Add more</span>
                            </button>
                          </div>
                        )}

                        {/* Empty state */}
                        {imageList.length === 0 && (
                          <div className="w-full aspect-video rounded-xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-2 mb-3 bg-white">
                            <Upload size={20} className="text-zinc-300" />
                            <p className="text-xs text-zinc-400">No images yet — upload or paste URLs below</p>
                          </div>
                        )}

                        {/* Upload button */}
                        <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFilePick} className="hidden" />
                        <button onClick={() => fileRef.current?.click()}
                          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-zinc-200 rounded-xl py-2.5 text-sm text-zinc-400 hover:border-blue-300 hover:text-blue-500 transition-colors bg-white mb-2">
                          <Upload size={14} /> Upload images from computer
                        </button>

                        {/* URL input */}
                        <div className="flex gap-2">
                          <input
                            ref={urlInputRef}
                            value={urlInput}
                            onChange={e => setUrlInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && addByUrl()}
                            placeholder="Or paste image URL and press Add"
                            className="flex-1 border border-zinc-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                          <button onClick={addByUrl}
                            className="px-3 py-2 bg-zinc-900 text-white text-xs font-semibold rounded-xl hover:bg-zinc-700 transition-colors flex-shrink-0">
                            Add
                          </button>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-1.5">
                          First image = primary (shown in listings). Hover any image to set as primary or remove.
                        </p>
                      </div>
                    </div>

                    {/* Save / Cancel */}
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