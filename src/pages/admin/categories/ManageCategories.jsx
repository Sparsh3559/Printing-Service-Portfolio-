import { useState, useEffect, useRef } from "react"
import AdminLayout from "@/components/AdminLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  Trash2, Plus, Loader2, Pencil, Check, X,
  ChevronDown, ChevronUp, Tag, FolderOpen
} from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function ManageCategories() {
  const [categories, setCategories] = useState([])
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState({})

  // Add state
  const [newCat, setNewCat] = useState("")
  const [newSub, setNewSub] = useState("")
  const [selectedParent, setSelectedParent] = useState("")
  const [addingCat, setAddingCat] = useState(false)
  const [addingSub, setAddingSub] = useState(false)

  // Edit state
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState("")
  const [savingEdit, setSavingEdit] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const editRef = useRef()

  // ── Fetch ─────────────────────────────────────────────────────────────────
  async function fetchAll() {
    const { data, error } = await supabase
      .from("Categories")
      .select("*")
      .order("name")
    if (error) { console.error(error); return }
    setCategories(data.filter((c) => c.parent_id === null))
    setChildren(data.filter((c) => c.parent_id !== null))
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  // ── Realtime ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel("categories-v2")
      .on("postgres_changes", { event: "*", schema: "public", table: "Categories" }, fetchAll)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  useEffect(() => {
    if (editingId && editRef.current) editRef.current.focus()
  }, [editingId])

  // ── Add parent ────────────────────────────────────────────────────────────
  async function addCategory() {
    if (!newCat.trim()) return
    setAddingCat(true)
    const { error } = await supabase
      .from("Categories")
      .insert({ name: newCat.trim(), parent_id: null })
    if (error) alert(error.message)
    else setNewCat("")
    setAddingCat(false)
  }

  // ── Add sub ───────────────────────────────────────────────────────────────
  async function addSubCategory() {
    if (!newSub.trim() || !selectedParent) return
    setAddingSub(true)
    const { error } = await supabase
      .from("Categories")
      .insert({ name: newSub.trim(), parent_id: Number(selectedParent) })
    if (error) alert(error.message)
    else {
      setNewSub("")
      setExpanded((prev) => ({ ...prev, [selectedParent]: true }))
    }
    setAddingSub(false)
  }

  // ── Rename ────────────────────────────────────────────────────────────────
  function startEdit(item) {
    setEditingId(item.id)
    setEditName(item.name)
  }

  async function saveEdit(id) {
    if (!editName.trim()) return
    setSavingEdit(true)
    const { error } = await supabase
      .from("Categories")
      .update({ name: editName.trim() })
      .eq("id", id)
    if (error) alert(error.message)
    else setEditingId(null)
    setSavingEdit(false)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditName("")
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function deleteCategory(id, name) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeletingId(id)
    const { error } = await supabase.from("Categories").delete().eq("id", id)
    if (error) alert(error.message)
    setDeletingId(null)
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  const childrenOf = (parentId) => children.filter((c) => c.parent_id === parentId)
  const toggleExpand = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  const onKey = (e, fn) => e.key === "Enter" && fn()

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {categories.length} categories · {children.length} sub-categories · Changes sync live.
        </p>
      </div>

      {/* ── Add Forms ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">

        {/* Add Category */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-violet-100 rounded-lg">
              <FolderOpen size={15} className="text-violet-600" />
            </div>
            <h2 className="font-medium text-sm">Add Category</h2>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. Apparel"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              onKeyDown={(e) => onKey(e, addCategory)}
            />
            <Button
              onClick={addCategory}
              disabled={addingCat || !newCat.trim()}
              size="sm"
              className="flex-shrink-0"
            >
              {addingCat
                ? <Loader2 size={13} className="animate-spin" />
                : <Plus size={13} />}
            </Button>
          </div>
        </Card>

        {/* Add Sub-Category */}
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <Tag size={15} className="text-blue-600" />
            </div>
            <h2 className="font-medium text-sm">Add Sub-Category</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              className="border rounded-md px-3 py-2 text-sm bg-background"
              value={selectedParent}
              onChange={(e) => setSelectedParent(e.target.value)}
            >
              <option value="">Select parent…</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <Input
              className="flex-1 min-w-[150px]"
              placeholder="e.g. Polo T-Shirts"
              value={newSub}
              onChange={(e) => setNewSub(e.target.value)}
              onKeyDown={(e) => onKey(e, addSubCategory)}
            />
            <Button
              onClick={addSubCategory}
              disabled={addingSub || !newSub.trim() || !selectedParent}
              size="sm"
            >
              {addingSub
                ? <Loader2 size={13} className="animate-spin mr-1" />
                : <Plus size={13} className="mr-1" />}
              Add
            </Button>
          </div>
        </Card>
      </div>

      {/* ── List ── */}
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 size={15} className="animate-spin" /> Loading…
        </div>
      ) : categories.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">
          No categories yet. Add your first one above.
        </Card>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => {
            const subs = childrenOf(cat.id)
            const isExpanded = expanded[cat.id] ?? true
            const isEditingThis = editingId === cat.id

            return (
              <Card key={cat.id} className="overflow-hidden">

                {/* ── Parent row ── */}
                <div className="flex items-center gap-3 px-5 py-4">
                  <button
                    onClick={() => toggleExpand(cat.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {isEditingThis ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        ref={editRef}
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(cat.id)
                          if (e.key === "Escape") cancelEdit()
                        }}
                        className="h-8 text-sm font-medium max-w-xs"
                      />
                      <button onClick={() => saveEdit(cat.id)} disabled={savingEdit} className="text-green-600 hover:text-green-700">
                        {savingEdit ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                      </button>
                      <button onClick={cancelEdit} className="text-muted-foreground hover:text-foreground">
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold">{cat.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {subs.length} sub-categor{subs.length === 1 ? "y" : "ies"}
                      </span>
                    </div>
                  )}

                  {!isEditingThis && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(cat)} title="Rename">
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        disabled={deletingId === cat.id}
                        onClick={() => deleteCategory(cat.id, cat.name)}
                      >
                        {deletingId === cat.id
                          ? <Loader2 size={14} className="animate-spin" />
                          : <Trash2 size={14} />}
                      </Button>
                    </div>
                  )}
                </div>

                {/* ── Sub-category chips ── */}
                {isExpanded && subs.length > 0 && (
                  <div className="border-t bg-muted/30 px-5 py-3 flex flex-wrap gap-2">
                    {subs.map((sub) => {
                      const isEditingSub = editingId === sub.id
                      return isEditingSub ? (
                        <div key={sub.id} className="flex items-center gap-1 bg-background border rounded-full px-3 py-1">
                          <input
                            ref={editRef}
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEdit(sub.id)
                              if (e.key === "Escape") cancelEdit()
                            }}
                            className="text-sm outline-none w-28 bg-transparent"
                          />
                          <button onClick={() => saveEdit(sub.id)} className="text-green-600">
                            {savingEdit ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                          </button>
                          <button onClick={cancelEdit} className="text-muted-foreground">
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div
                          key={sub.id}
                          className="group flex items-center gap-1 bg-background border px-3 py-1 rounded-full text-sm hover:border-primary/50 transition-colors"
                        >
                          <span>{sub.name}</span>
                          <button
                            onClick={() => startEdit(sub)}
                            className="ml-1 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Pencil size={10} />
                          </button>
                          <button
                            onClick={() => deleteCategory(sub.id, sub.name)}
                            disabled={deletingId === sub.id}
                            className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {deletingId === sub.id
                              ? <Loader2 size={10} className="animate-spin" />
                              : <X size={10} />}
                          </button>
                        </div>
                      )
                    })}
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