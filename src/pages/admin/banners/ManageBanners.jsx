import { useEffect, useState, useRef } from "react"
import AdminLayout from "@/components/AdminLayout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { Trash2, ImagePlus, Loader2, CheckCircle2 } from "lucide-react"

export default function ManageBanners() {
  const [banners, setBanners] = useState([])
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [buttonText, setButtonText] = useState("")
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const fileRef = useRef()

  // ── Fetch existing banners ──────────────────────────────────────────────────
  useEffect(() => {
    fetchBanners()
  }, [])

  async function fetchBanners() {
    const { data, error } = await supabase
      .from("Banners")
      .select("*")
      .order("id")
    if (!error) setBanners(data)
  }

  // ── Realtime subscription ───────────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel("banners-admin")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Banners" },
        () => fetchBanners()
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  // ── File preview ────────────────────────────────────────────────────────────
  function handleFileChange(e) {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  // ── Upload banner ───────────────────────────────────────────────────────────
  async function handleUpload() {
    if (!title || !file) return alert("Title and image are required.")

    setUploading(true)
    try {
      // 1. Upload image to Storage
      const ext = file.name.split(".").pop()
      const fileName = `banner_${Date.now()}.${ext}`

      const { error: storageError } = await supabase.storage
        .from("banners")                // ← your bucket name
        .upload(fileName, file, { upsert: false })

      if (storageError) throw storageError

      // 2. Get public URL
      const { data: urlData } = supabase.storage
        .from("banners")
        .getPublicUrl(fileName)

      // 3. Insert row into Banners table
      const { error: dbError } = await supabase.from("Banners").insert({
        title,
        subtitle,
        button_text: buttonText,
        image_url: urlData.publicUrl,
      })

      if (dbError) throw dbError

      // 4. Reset form
      setTitle("")
      setSubtitle("")
      setButtonText("")
      setFile(null)
      setPreview(null)
      if (fileRef.current) fileRef.current.value = ""
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      alert("Upload failed: " + err.message)
    } finally {
      setUploading(false)
    }
  }

  // ── Delete banner ───────────────────────────────────────────────────────────
  async function handleDelete(banner) {
    setDeletingId(banner.id)
    try {
      // Extract filename from URL
      const parts = banner.image_url.split("/")
      const fileName = parts[parts.length - 1]

      // Delete from storage
      await supabase.storage.from("banners").remove([fileName])

      // Delete from DB
      await supabase.from("Banners").delete().eq("id", banner.id)
    } catch (err) {
      alert("Delete failed: " + err.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-1">Homepage Banners</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Changes appear on the live site instantly.
        </p>

        {/* ── Upload Form ── */}
        <div className="border rounded-xl p-6 bg-card mb-10 shadow-sm">
          <h2 className="text-base font-medium mb-4">Add New Banner</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: inputs */}
            <div className="space-y-3">
              <Input
                placeholder="Banner Title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input
                placeholder="Subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
              />
              <Input
                placeholder="Button Text (e.g. Shop Now)"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
              />
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="banner-file"
                />
                <label
                  htmlFor="banner-file"
                  className="flex items-center gap-2 cursor-pointer border border-dashed rounded-lg px-4 py-3 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <ImagePlus size={16} />
                  {file ? file.name : "Choose image *"}
                </label>
              </div>
            </div>

            {/* Right: preview */}
            <div className="flex items-center justify-center border rounded-lg overflow-hidden bg-muted min-h-[160px]">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover max-h-48"
                />
              ) : (
                <p className="text-xs text-muted-foreground">Image preview</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-5">
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="rounded-full px-6"
            >
              {uploading ? (
                <>
                  <Loader2 size={14} className="mr-2 animate-spin" />
                  Uploading…
                </>
              ) : (
                "Upload Banner"
              )}
            </Button>

            {success && (
              <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                <CheckCircle2 size={15} />
                Banner published live!
              </span>
            )}
          </div>
        </div>

        {/* ── Existing Banners ── */}
        <h2 className="text-base font-medium mb-4">
          Live Banners ({banners.length})
        </h2>

        {banners.length === 0 ? (
          <p className="text-sm text-muted-foreground">No banners yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="relative rounded-xl overflow-hidden border shadow-sm group"
              >
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-sm font-semibold leading-tight line-clamp-1">
                    {banner.title}
                  </p>
                  {banner.subtitle && (
                    <p className="text-white/70 text-xs line-clamp-1 mt-0.5">
                      {banner.subtitle}
                    </p>
                  )}
                </div>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(banner)}
                  disabled={deletingId === banner.id}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all"
                >
                  {deletingId === banner.id ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Trash2 size={13} />
                  )}
                </button>

                {/* ID badge */}
                <span className="absolute top-2 left-2 text-[10px] bg-black/40 text-white px-1.5 py-0.5 rounded">
                  #{banner.id}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}