import { useState, useEffect, useRef } from "react"
import AdminLayout from "@/components/AdminLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import {
  Plus, Trash2, Loader2, X, Check, Pencil,
  Eye, EyeOff, GripVertical,
} from "lucide-react"

export default function ManageBanners() {
  const [banners,     setBanners]     = useState([])
  const [loading,     setLoading]     = useState(true)
  const [uploading,   setUploading]   = useState(false)
  const [formError,   setFormError]   = useState("")
  const [formSuccess, setFormSuccess] = useState("")

  // New banner form
  const [imageFile,    setImageFile]    = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [title,        setTitle]        = useState("")
  const [subtitle,     setSubtitle]     = useState("")
  const [buttonText,   setButtonText]   = useState("")
  const [link,         setLink]         = useState("")
  const fileRef = useRef(null)

  // Edit state
  const [editingId,      setEditingId]      = useState(null)
  const [editTitle,      setEditTitle]      = useState("")
  const [editSubtitle,   setEditSubtitle]   = useState("")
  const [editButtonText, setEditButtonText] = useState("")
  const [editLink,       setEditLink]       = useState("")
  const [savingEdit,     setSavingEdit]     = useState(false)
  const [deletingId,     setDeletingId]     = useState(null)

  // Drag state
  const dragIdx    = useRef(null)
  const dragOverIdx = useRef(null)

  // ── Fetch ──────────────────────────────────────────────────────────────────
  async function fetchBanners() {
    const { data, error } = await supabase
      .from("Banners")
      .select("*")
      .order("sort_order", { ascending: true })
    if (error) {
      console.error("Banners fetch error:", error.message)
      // fallback: try without ordering
      const { data: d2 } = await supabase.from("Banners").select("*")
      if (d2) setBanners(d2)
    } else if (data) {
      setBanners(data)
    }
    setLoading(false)
  }

  useEffect(() => { fetchBanners() }, [])

  useEffect(() => {
    const ch = supabase.channel("banners-admin-v2")
      .on("postgres_changes", { event: "*", schema: "public", table: "Banners" }, fetchBanners)
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [])

  // ── Image ──────────────────────────────────────────────────────────────────
  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setFormError("Image must be under 5MB"); return }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setFormError("")
  }

  function removeImage() {
    setImageFile(null)
    setImagePreview(null)
    if (fileRef.current) fileRef.current.value = ""
  }

  async function uploadImage(file) {
    const ext  = file.name.split(".").pop()
    const path = `banners/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage
      .from("banners").upload(path, file, { cacheControl: "3600" })
    if (error) throw new Error(error.message)
    return supabase.storage.from("banners").getPublicUrl(path).data.publicUrl
  }

  // ── Add ────────────────────────────────────────────────────────────────────
  async function addBanner() {
    if (!imageFile) { setFormError("Please select an image"); return }
    setUploading(true); setFormError(""); setFormSuccess("")
    try {
      const image_url = await uploadImage(imageFile)
      const maxOrder  = banners.length ? Math.max(...banners.map(b => b.sort_order || 0)) : 0
      const { error } = await supabase.from("Banners").insert({
        image_url,
        title:       title.trim()      || null,
        subtitle:    subtitle.trim()   || null,
        button_text: buttonText.trim() || null,
        link:        link.trim()       || null,
        is_active:   true,
        sort_order:  maxOrder + 1,
      })
      if (error) throw new Error(error.message)
      setFormSuccess("Banner added!")
      setTitle(""); setSubtitle(""); setButtonText(""); setLink(""); removeImage()
      setTimeout(() => setFormSuccess(""), 3000)
    } catch (e) { setFormError(e.message) }
    finally { setUploading(false) }
  }

  // ── Toggle ─────────────────────────────────────────────────────────────────
  async function toggleActive(b) {
    const updated = !b.is_active
    await supabase.from("Banners").update({ is_active: updated }).eq("id", b.id)
    setBanners(prev => prev.map(x => x.id === b.id ? { ...x, is_active: updated } : x))
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  async function deleteBanner(id) {
    if (!confirm("Delete this banner? This cannot be undone.")) return
    setDeletingId(id)
    await supabase.from("Banners").delete().eq("id", id)
    setBanners(prev => prev.filter(b => b.id !== id))
    setDeletingId(null)
  }

  // ── Edit ───────────────────────────────────────────────────────────────────
  function startEdit(b) {
    setEditingId(b.id)
    setEditTitle(b.title || "")
    setEditSubtitle(b.subtitle || "")
    setEditButtonText(b.button_text || "")
    setEditLink(b.link || "")
  }

  async function saveEdit(id) {
    setSavingEdit(true)
    const { error } = await supabase.from("Banners").update({
      title:       editTitle.trim()      || null,
      subtitle:    editSubtitle.trim()   || null,
      button_text: editButtonText.trim() || null,
      link:        editLink.trim()       || null,
    }).eq("id", id)
    if (error) alert(error.message)
    else {
      setBanners(prev => prev.map(b => b.id === id ? {
        ...b,
        title:       editTitle.trim()      || null,
        subtitle:    editSubtitle.trim()   || null,
        button_text: editButtonText.trim() || null,
        link:        editLink.trim()       || null,
      } : b))
      setEditingId(null)
    }
    setSavingEdit(false)
  }

  // ── Drag to reorder ────────────────────────────────────────────────────────
  function onDragStart(idx) {
    dragIdx.current = idx
  }

  function onDragEnter(idx) {
    dragOverIdx.current = idx
    if (dragIdx.current === idx) return
    setBanners(prev => {
      const copy = [...prev]
      const [dragged] = copy.splice(dragIdx.current, 1)
      copy.splice(idx, 0, dragged)
      dragIdx.current = idx
      return copy
    })
  }

  async function onDragEnd() {
    dragIdx.current    = null
    dragOverIdx.current = null
    // Persist new order to DB
    const updates = banners.map((b, i) =>
      supabase.from("Banners").update({ sort_order: i }).eq("id", b.id)
    )
    await Promise.all(updates)
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Banners</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage homepage carousel banners. Drag to reorder · eye icon to show/hide.
        </p>
      </div>

      {/* ── Add Form ── */}
      <Card className="p-6 mb-10">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Plus size={16} /> Add New Banner
        </h2>

        {imagePreview ? (
          <div className="relative rounded-xl overflow-hidden mb-4 bg-zinc-100">
            <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
            <button onClick={removeImage}
              className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50 transition-colors">
              <X size={14} />
            </button>
          </div>
        ) : (
          <div onClick={() => fileRef.current?.click()}
            className="w-full h-36 rounded-xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-zinc-400 hover:bg-zinc-50 transition-all mb-4">
            <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
              <Plus size={18} className="text-zinc-400" />
            </div>
            <p className="text-sm text-zinc-400">Click to upload banner image</p>
            <p className="text-xs text-zinc-300">Recommended: 1400×500px · Max 5MB</p>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <Input placeholder="Banner Title (optional)"       value={title}      onChange={e => setTitle(e.target.value)} />
          <Input placeholder="Subtitle (optional)"           value={subtitle}   onChange={e => setSubtitle(e.target.value)} />
          <Input placeholder="Button Text e.g. Explore Now"  value={buttonText} onChange={e => setButtonText(e.target.value)} />
          <Input placeholder="Link URL e.g. /apparels"       value={link}       onChange={e => setLink(e.target.value)} />
        </div>

        {formError   && <p className="text-sm text-red-500 mb-3">{formError}</p>}
        {formSuccess && <p className="text-sm text-green-600 mb-3">{formSuccess}</p>}

        <Button onClick={addBanner} disabled={uploading || !imageFile}>
          {uploading
            ? <><Loader2 size={14} className="animate-spin mr-2" />Uploading…</>
            : <><Plus size={14} className="mr-2" />Add Banner</>}
        </Button>
      </Card>

      {/* ── List ── */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">All Banners</h2>
        <span className="text-sm text-muted-foreground">{banners.length} total</span>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-8">
          <Loader2 size={15} className="animate-spin" /> Loading banners…
        </div>
      ) : banners.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">
          No banners yet. Add one above.
        </Card>
      ) : (
        <>
          <p className="text-xs text-zinc-400 mb-3 flex items-center gap-1">
            <GripVertical size={12} /> Drag rows to reorder how they appear in the slider
          </p>
          <div className="space-y-3">
            {banners.map((b, idx) => (
              <Card
                key={b.id}
                draggable
                onDragStart={() => onDragStart(idx)}
                onDragEnter={() => onDragEnter(idx)}
                onDragEnd={onDragEnd}
                onDragOver={e => e.preventDefault()}
                className={`overflow-hidden transition-all cursor-grab active:cursor-grabbing ${
                  !b.is_active ? "opacity-50" : ""
                }`}>
                <div className="flex gap-3 p-4 items-start">

                  {/* Drag handle */}
                  <div className="flex-shrink-0 pt-1 text-zinc-300 hover:text-zinc-500 cursor-grab">
                    <GripVertical size={18} />
                  </div>

                  {/* Order badge */}
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-100 text-zinc-500 text-xs font-bold flex items-center justify-center mt-0.5">
                    {idx + 1}
                  </div>

                  {/* Thumbnail */}
                  <div className="hidden sm:block w-40 h-22 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-100">
                    <img src={b.image_url} alt="Banner" className="w-40 h-24 object-cover" />
                  </div>

                  {/* Info / Edit */}
                  <div className="flex-1 min-w-0">
                    {editingId === b.id ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="Title"       value={editTitle}      onChange={e => setEditTitle(e.target.value)}      className="h-8 text-sm" />
                          <Input placeholder="Subtitle"    value={editSubtitle}   onChange={e => setEditSubtitle(e.target.value)}   className="h-8 text-sm" />
                          <Input placeholder="Button Text" value={editButtonText} onChange={e => setEditButtonText(e.target.value)} className="h-8 text-sm" />
                          <Input placeholder="Link URL"    value={editLink}       onChange={e => setEditLink(e.target.value)}       className="h-8 text-sm" />
                        </div>
                        <div className="flex gap-2 pt-1">
                          <Button size="sm" onClick={() => saveEdit(b.id)} disabled={savingEdit}>
                            {savingEdit
                              ? <Loader2 size={13} className="animate-spin" />
                              : <><Check size={13} className="mr-1" />Save</>}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="font-semibold text-sm">
                          {b.title || <span className="text-zinc-400 italic font-normal">No title</span>}
                        </p>
                        {b.subtitle && <p className="text-xs text-zinc-500 mt-0.5">{b.subtitle}</p>}
                        {b.button_text && (
                          <p className="text-xs text-zinc-400 mt-0.5">
                            Button: <span className="font-medium">"{b.button_text}"</span>
                          </p>
                        )}
                        {b.link && <p className="text-xs text-[#065999] mt-0.5">→ {b.link}</p>}
                        <span className={`inline-flex items-center gap-1 text-xs mt-2 font-medium ${b.is_active ? "text-green-600" : "text-zinc-400"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${b.is_active ? "bg-green-500" : "bg-zinc-300"}`} />
                          {b.is_active ? "Active" : "Hidden"}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8"
                      onClick={() => toggleActive(b)} title={b.is_active ? "Hide" : "Show"}>
                      {b.is_active ? <EyeOff size={15} /> : <Eye size={15} />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"
                      onClick={() => startEdit(b)} title="Edit">
                      <Pencil size={15} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                      disabled={deletingId === b.id} onClick={() => deleteBanner(b.id)}>
                      {deletingId === b.id
                        ? <Loader2 size={15} className="animate-spin" />
                        : <Trash2 size={15} />}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  )
}