import { useState, useEffect, useRef } from "react"
import AdminLayout from "@/components/AdminLayout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ImagePlus, Loader2, CheckCircle2 } from "lucide-react"
import { supabase } from "@/lib/supabase"


export default function AddProduct() {
  // ── Form state ────────────────────────────────────────────────────────────
  const [title, setTitle] = useState("")

  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [inStock, setInStock] = useState(true)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)

  // ── UI state ──────────────────────────────────────────────────────────────
  const [categories, setCategories] = useState([])
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})
  const fileRef = useRef()

  // ── Fetch parent categories for dropdown ──────────────────────────────────
  useEffect(() => {
    supabase
      .from("Categories")
      .select("id, name")
      .is("parent_id", null)
      .order("name")
      .then(({ data }) => data && setCategories(data))
  }, [])



  // ── File preview ──────────────────────────────────────────────────────────
  function handleFileChange(e) {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  // ── Validation ────────────────────────────────────────────────────────────
  function validate() {
    const e = {}
    if (!title.trim()) e.title = "Name is required"
    if (price && isNaN(Number(price))) e.price = "Price must be a number"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    try {
      let image_url = null

      // 1. Upload image if provided
      if (file) {
        const ext = file.name.split(".").pop()
        const fileName = `product_${Date.now()}.${ext}`
        const { error: storageError } = await supabase.storage
          .from("products") // ← your bucket name
          .upload(fileName, file, { upsert: false })

        if (storageError) throw storageError

        const { data: urlData } = supabase.storage
          .from("products")
          .getPublicUrl(fileName)
        image_url = urlData.publicUrl
      }

      // 2. Insert product row
      const { error: dbError } = await supabase.from("Products").insert({
        name: title.trim(),
        description: description.trim() || null,
        price: price ? Number(price) : null,
        category_id: categoryId ? Number(categoryId) : null,
        image_url,
        is_featured: inStock,
      })

      if (dbError) throw dbError

      // 3. Reset
      setTitle("")
      setDescription("")
      setPrice("")
      setCategoryId("")
      setInStock(true)
      setFile(null)
      setPreview(null)
      if (fileRef.current) fileRef.current.value = ""
      setErrors({})
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3500)
    } catch (err) {
      alert("Failed to save product: " + err.message)
    } finally {
      setSaving(false)
    }
  }

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-1">Add New Product</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Fill in the details below and click Save.
      </p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">

        {/* ── Left column ── */}
        <div className="space-y-5">

          {/* Title */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Product Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="e.g. Premium Polo T-Shirt"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Price */}
          <div>
            <label className="text-sm font-medium mb-1 block">Price (₹)</label>
            <Input
              placeholder="e.g. 499"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium mb-1 block">Category</label>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm bg-background"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_featured"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            <label htmlFor="is_featured" className="text-sm font-medium">
              Featured Product
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <Textarea
              placeholder="Describe the product…"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

        </div>

        {/* ── Right column: image ── */}
        <div className="space-y-4">
          <label className="text-sm font-medium block">Product Image</label>

          {/* Drop zone */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="product-image"
          />
          <label
            htmlFor="product-image"
            className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer hover:border-primary hover:bg-muted/40 transition-colors"
            style={{ minHeight: "220px" }}
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-xl"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground p-8">
                <ImagePlus size={32} />
                <p className="text-sm">Click to upload image</p>
                <p className="text-xs">PNG, JPG, WEBP up to 5MB</p>
              </div>
            )}
          </label>

          {preview && (
            <button
              type="button"
              className="text-xs text-red-500 hover:underline"
              onClick={() => {
                setFile(null)
                setPreview(null)
                if (fileRef.current) fileRef.current.value = ""
              }}
            >
              Remove image
            </button>
          )}

          {/* Submit */}
          <div className="pt-4 flex items-center gap-4">
            <Button
              type="submit"
              disabled={saving}
              className="rounded-full px-8"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="mr-2 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Product"
              )}
            </Button>

            {success && (
              <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                <CheckCircle2 size={15} />
                Product saved!
              </span>
            )}
          </div>
        </div>

      </form>
    </AdminLayout>
  )
}