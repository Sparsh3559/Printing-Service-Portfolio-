import { useState, useEffect } from "react"
import AdminLayout from "@/components/AdminLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Trash2, Plus, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function ManageCategories() {
  const [categories, setCategories] = useState([])   // parent rows
  const [children, setChildren] = useState([])        // child rows
  const [loading, setLoading] = useState(true)

  const [newCategory, setNewCategory] = useState("")
  const [subCategory, setSubCategory] = useState("")
  const [selectedParent, setSelectedParent] = useState("")

  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  // ── Fetch ──────────────────────────────────────────────────────────────────
  async function fetchAll() {
    const { data, error } = await supabase
      .from("Categories")
      .select("*")
      .order("created_at")

    if (error) { console.error(error); return }

    setCategories(data.filter((c) => c.parent_id === null))
    setChildren(data.filter((c) => c.parent_id !== null))
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  // ── Realtime ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel("categories-admin")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Categories" },
        () => fetchAll()
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  // ── Add parent category ────────────────────────────────────────────────────
  async function addCategory() {
    if (!newCategory.trim()) return
    setSaving(true)
    const { error } = await supabase
      .from("Categories")
      .insert({ name: newCategory.trim(), parent_id: null })
    if (error) alert(error.message)
    else setNewCategory("")
    setSaving(false)
  }

  // ── Add sub-category ───────────────────────────────────────────────────────
  async function addSubCategory() {
    if (!subCategory.trim() || !selectedParent) return
    setSaving(true)
    const { error } = await supabase
      .from("Categories")
      .insert({ name: subCategory.trim(), parent_id: Number(selectedParent) })
    if (error) alert(error.message)
    else setSubCategory("")
    setSaving(false)
  }

  // ── Delete (cascade handles children automatically) ────────────────────────
  async function deleteCategory(id) {
    setDeletingId(id)
    const { error } = await supabase
      .from("Categories")
      .delete()
      .eq("id", id)
    if (error) alert(error.message)
    setDeletingId(null)
  }

  // ── helpers ────────────────────────────────────────────────────────────────
  const childrenOf = (parentId) =>
    children.filter((c) => c.parent_id === parentId)

  const handleKey = (e, fn) => e.key === "Enter" && fn()

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-1">Manage Categories</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Changes sync to the live site in real time.
      </p>

      {/* ── Add parent ── */}
      <Card className="p-6 mb-4">
        <h2 className="font-medium mb-3">Add Category</h2>
        <div className="flex gap-3">
          <Input
            placeholder="e.g. Apparel"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => handleKey(e, addCategory)}
          />
          <Button onClick={addCategory} disabled={saving || !newCategory.trim()}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} className="mr-1" />}
            Add
          </Button>
        </div>
      </Card>

      {/* ── Add sub-category ── */}
      <Card className="p-6 mb-8">
        <h2 className="font-medium mb-3">Add Sub-Category</h2>
        <div className="flex flex-wrap gap-3">
          <select
            className="border rounded-md px-3 py-2 text-sm bg-background"
            value={selectedParent}
            onChange={(e) => setSelectedParent(e.target.value)}
          >
            <option value="">Select parent category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <Input
            className="max-w-xs"
            placeholder="e.g. Polo T-Shirts"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            onKeyDown={(e) => handleKey(e, addSubCategory)}
          />

          <Button
            onClick={addSubCategory}
            disabled={saving || !subCategory.trim() || !selectedParent}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} className="mr-1" />}
            Add
          </Button>
        </div>
      </Card>

      {/* ── Category list ── */}
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 size={15} className="animate-spin" /> Loading categories…
        </div>
      ) : categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No categories yet. Add one above.
        </p>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => {
            const subs = childrenOf(cat.id)
            return (
              <Card key={cat.id} className="p-5">
                {/* Parent row */}
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="text-base font-semibold">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {subs.length} sub-categor{subs.length === 1 ? "y" : "ies"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={deletingId === cat.id}
                    onClick={() => deleteCategory(cat.id)}
                    title="Delete category and all sub-categories"
                  >
                    {deletingId === cat.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </Button>
                </div>

                {/* Sub-category chips */}
                {subs.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {subs.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center bg-muted px-3 py-1 rounded-full text-sm"
                      >
                        {sub.name}
                        <button
                          className="ml-2 text-muted-foreground hover:text-red-500 transition-colors"
                          onClick={() => deleteCategory(sub.id)}
                          disabled={deletingId === sub.id}
                        >
                          {deletingId === sub.id ? (
                            <Loader2 size={11} className="animate-spin" />
                          ) : (
                            "✕"
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </AdminLayout>
  )
}