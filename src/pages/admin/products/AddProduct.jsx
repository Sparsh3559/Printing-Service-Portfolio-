import { useState, useEffect } from "react"
import AdminLayout from "../../../components/AdminLayout"
import { supabase } from "@/lib/supabase"
import { Plus, Loader2, CheckCircle } from "lucide-react"

export default function AddProduct() {
  const [categories, setCategories] = useState([])
  const [parents, setParents]       = useState([])
  const [loading, setLoading]       = useState(false)
  const [success, setSuccess]       = useState(false)
  const [error, setError]           = useState("")

  const [form, setForm] = useState({
    name: "", description: "", category_id: "",
    image_url: "", price: "", tag: "", whatsapp_message: "",
  })

  useEffect(() => {
    supabase.from("Categories").select("*").order("name").then(({ data }) => {
      if (data) {
        setParents(data.filter((c) => !c.parent_id))
        setCategories(data)
      }
    })
  }, [])

  const subsOf = (pid) => categories.filter((c) => c.parent_id === pid)
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true); setError(""); setSuccess(false)
    if (!form.name.trim())    { setError("Product name is required."); setLoading(false); return }
    if (!form.category_id)    { setError("Please select a category."); setLoading(false); return }
    if (!form.image_url.trim()){ setError("Image URL is required."); setLoading(false); return }

    const whatsapp_message = form.whatsapp_message.trim() ||
      `Hello, I'm interested in ${form.name}. Please share details and pricing.`

    const { error: err } = await supabase.from("Products").insert([{
      name:              form.name.trim(),
      description:       form.description.trim() || null,
      category_id:       Number(form.category_id),
      image_url:         form.image_url.trim(),
      price:             form.price ? Number(form.price) : null,
      tag:               form.tag || null,
      whatsapp_message,
      is_active:         true,
      is_featured:       false,
    }])

    setLoading(false)
    if (err) { setError(err.message); return }
    setSuccess(true)
    setForm({ name: "", description: "", category_id: "", image_url: "", price: "", tag: "", whatsapp_message: "" })
    setTimeout(() => setSuccess(false), 3000)
  }

  const field = (label, key, props = {}) => (
    <div>
      <label className="block text-sm font-medium text-zinc-700 mb-1.5">{label}</label>
      <input
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
        {...props}
      />
    </div>
  )

  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-zinc-900 mb-1">Add Product</h1>
        <p className="text-sm text-zinc-500 mb-8">Add a new product to the catalog.</p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {field("Product Name *", "name", { placeholder: "e.g. Polo Matty 240 GSM" })}

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Category *</label>
            <select
              value={form.category_id}
              onChange={(e) => set("category_id", e.target.value)}
              className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
            >
              <option value="">Select a category...</option>
              {parents.map((parent) => (
                <optgroup key={parent.id} label={parent.name}>
                  <option value={parent.id}>{parent.name} (general)</option>
                  {subsOf(parent.id).map((sub) => (
                    <option key={sub.id} value={sub.id}>↳ {sub.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Brief description of the product..."
              rows={3}
              className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none"
            />
          </div>

          {field("Image URL *", "image_url", { type: "url", placeholder: "https://example.com/image.jpg" })}
          {field("Price (₹)", "price", { type: "number", placeholder: "e.g. 299" })}

          {/* Tag */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Tag</label>
            <select
              value={form.tag}
              onChange={(e) => set("tag", e.target.value)}
              className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
            >
              <option value="">No tag</option>
              {["Best Seller", "Popular", "Premium", "Corporate", "New"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          {field("Custom WhatsApp Message", "whatsapp_message", {
            placeholder: "Leave blank to auto-generate from product name"
          })}

          {error   && <p className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>}
          {success && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-2.5 rounded-xl">
              <CheckCircle size={15} /> Product added successfully!
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </AdminLayout>
  )
}