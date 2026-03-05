import { useState, useEffect, useRef } from "react"
import AdminLayout from "@/components/AdminLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  Trash2, Plus, Loader2, Pencil, Check, X,
  ChevronDown, ChevronUp, Tag, FolderOpen, Layers
} from "lucide-react"
import { supabase } from "@/lib/supabase"

/**
 * 3-Level hierarchy:
 *   Level 0 — Categories       (parent_id = null)
 *   Level 1 — Sub-Categories   (parent_id = category.id)
 *   Level 2 — Items / Products (parent_id = sub-category.id)
 *
 * All three levels live in the same "Categories" table.
 * We distinguish them by how many ancestors they have.
 */

export default function ManageCategories() {
  const [allRows, setAllRows] = useState([])
  const [loading, setLoading] = useState(true)

  // Expanded state for categories and sub-categories
  const [expandedCat, setExpandedCat] = useState({})
  const [expandedSub, setExpandedSub] = useState({})

  // ── Add state ──────────────────────────────────────────────────────────────
  const [newCat, setNewCat] = useState("")
  const [addingCat, setAddingCat] = useState(false)

  const [newSub, setNewSub] = useState("")
  const [selectedParentForSub, setSelectedParentForSub] = useState("")
  const [addingSub, setAddingSub] = useState(false)

  const [newItem, setNewItem] = useState("")
  const [selectedCatForItem, setSelectedCatForItem] = useState("")
  const [selectedSubForItem, setSelectedSubForItem] = useState("")
  const [addingItem, setAddingItem] = useState(false)

  // ── Edit / Delete state ────────────────────────────────────────────────────
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState("")
  const [savingEdit, setSavingEdit] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const editRef = useRef()

  // ── Fetch ──────────────────────────────────────────────────────────────────
  async function fetchAll() {
    const { data, error } = await supabase
      .from("Categories")
      .select("*")
      .order("name")
    if (error) { console.error(error); return }
    setAllRows(data)
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  // ── Realtime ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel("categories-v3")
      .on("postgres_changes", { event: "*", schema: "public", table: "Categories" }, fetchAll)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  useEffect(() => {
    if (editingId && editRef.current) editRef.current.focus()
  }, [editingId])

  // ── Derived data ───────────────────────────────────────────────────────────
  const categories = allRows.filter((r) => r.parent_id === null)

  // sub-categories: rows whose parent is a category (level-0)
  const categoryIds = new Set(categories.map((c) => c.id))
  const subCategories = allRows.filter((r) => r.parent_id !== null && categoryIds.has(r.parent_id))

  // items: rows whose parent is a sub-category (level-1)
  const subCategoryIds = new Set(subCategories.map((s) => s.id))
  const items = allRows.filter((r) => r.parent_id !== null && subCategoryIds.has(r.parent_id))

  const subsOf = (catId) => subCategories.filter((s) => s.parent_id === catId)
  const itemsOf = (subId) => items.filter((i) => i.parent_id === subId)

  // Sub-categories that belong to a given category (for the item-add dropdown)
  const subsForCat = (catId) => subCategories.filter((s) => s.parent_id === Number(catId))

  // ── Add handlers ───────────────────────────────────────────────────────────
  async function addCategory() {
    if (!newCat.trim()) return
    setAddingCat(true)
    const { error } = await supabase.from("Categories").insert({ name: newCat.trim(), parent_id: null })
    if (error) alert(error.message)
    else setNewCat("")
    setAddingCat(false)
  }

  async function addSubCategory() {
    if (!newSub.trim() || !selectedParentForSub) return
    setAddingSub(true)
    const { error } = await supabase.from("Categories").insert({ name: newSub.trim(), parent_id: Number(selectedParentForSub) })
    if (error) alert(error.message)
    else {
      setNewSub("")
      setExpandedCat((prev) => ({ ...prev, [selectedParentForSub]: true }))
    }
    setAddingSub(false)
  }

  async function addItem() {
    if (!newItem.trim() || !selectedSubForItem) return
    setAddingItem(true)
    const { error } = await supabase.from("Categories").insert({ name: newItem.trim(), parent_id: Number(selectedSubForItem) })
    if (error) alert(error.message)
    else {
      setNewItem("")
      setExpandedCat((prev) => ({ ...prev, [selectedCatForItem]: true }))
      setExpandedSub((prev) => ({ ...prev, [selectedSubForItem]: true }))
    }
    setAddingItem(false)
  }

  // ── Edit handlers ──────────────────────────────────────────────────────────
  function startEdit(row) { setEditingId(row.id); setEditName(row.name) }

  async function saveEdit(id) {
    if (!editName.trim()) return
    setSavingEdit(true)
    const { error } = await supabase.from("Categories").update({ name: editName.trim() }).eq("id", id)
    if (error) alert(error.message)
    else setEditingId(null)
    setSavingEdit(false)
  }

  function cancelEdit() { setEditingId(null); setEditName("") }

  // ── Delete handler ─────────────────────────────────────────────────────────
  async function deleteRow(id, name) {
    if (!confirm(`Delete "${name}"? All children will also be deleted.`)) return
    setDeletingId(id)
    const { error } = await supabase.from("Categories").delete().eq("id", id)
    if (error) alert(error.message)
    setDeletingId(null)
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  const onKey = (e, fn) => e.key === "Enter" && fn()

  // ── Inline edit input (reusable) ───────────────────────────────────────────
  function EditInput({ id, size = "sm" }) {
    return (
      <div className="flex items-center gap-1">
        <Input
          ref={editRef}
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") saveEdit(id); if (e.key === "Escape") cancelEdit() }}
          className={size === "sm" ? "h-7 text-sm w-36 bg-transparent" : "h-8 text-sm max-w-xs"}
        />
        <button onClick={() => saveEdit(id)} disabled={savingEdit} className="text-green-600 hover:text-green-700">
          {savingEdit ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
        </button>
        <button onClick={cancelEdit} className="text-muted-foreground hover:text-foreground">
          <X size={13} />
        </button>
      </div>
    )
  }

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {categories.length} categories · {subCategories.length} sub-categories · {items.length} items · Changes sync live.
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
            <div>
              <h2 className="font-medium text-sm">Add Category</h2>
              <p className="text-xs text-muted-foreground">Level 1</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. Apparel"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              onKeyDown={(e) => onKey(e, addCategory)}
            />
            <Button onClick={addCategory} disabled={addingCat || !newCat.trim()} size="sm" className="flex-shrink-0">
              {addingCat ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
            </Button>
          </div>
        </Card>

        {/* Add Sub-Category */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <Tag size={15} className="text-blue-600" />
            </div>
            <div>
              <h2 className="font-medium text-sm">Add Sub-Category</h2>
              <p className="text-xs text-muted-foreground">Level 2</p>
            </div>
          </div>
          <div className="space-y-2">
            <select
              className="w-full border rounded-md px-3 py-2 text-sm bg-background"
              value={selectedParentForSub}
              onChange={(e) => setSelectedParentForSub(e.target.value)}
            >
              <option value="">Select category…</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. Polo T-Shirts"
                value={newSub}
                onChange={(e) => setNewSub(e.target.value)}
                onKeyDown={(e) => onKey(e, addSubCategory)}
              />
              <Button onClick={addSubCategory} disabled={addingSub || !newSub.trim() || !selectedParentForSub} size="sm" className="flex-shrink-0">
                {addingSub ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
              </Button>
            </div>
          </div>
        </Card>

        {/* Add Item */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-emerald-100 rounded-lg">
              <Layers size={15} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="font-medium text-sm">Add Item / Product</h2>
              <p className="text-xs text-muted-foreground">Level 3</p>
            </div>
          </div>
          <div className="space-y-2">
            <select
              className="w-full border rounded-md px-3 py-2 text-sm bg-background"
              value={selectedCatForItem}
              onChange={(e) => { setSelectedCatForItem(e.target.value); setSelectedSubForItem("") }}
            >
              <option value="">Select category…</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm bg-background"
              value={selectedSubForItem}
              onChange={(e) => setSelectedSubForItem(e.target.value)}
              disabled={!selectedCatForItem}
            >
              <option value="">Select sub-category…</option>
              {subsForCat(selectedCatForItem).map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. Polo Matty 240 GSM"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => onKey(e, addItem)}
                disabled={!selectedSubForItem}
              />
              <Button onClick={addItem} disabled={addingItem || !newItem.trim() || !selectedSubForItem} size="sm" className="flex-shrink-0">
                {addingItem ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Tree List ── */}
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
            const subs = subsOf(cat.id)
            const isCatExpanded = expandedCat[cat.id] ?? true
            const isEditingCat = editingId === cat.id

            return (
              <Card key={cat.id} className="overflow-hidden">

                {/* ── Category row (Level 1) ── */}
                <div className="flex items-center gap-3 px-5 py-4 bg-background">
                  <button
                    onClick={() => setExpandedCat((prev) => ({ ...prev, [cat.id]: !isCatExpanded }))}
                    className="text-muted-foreground hover:text-foreground flex-shrink-0"
                  >
                    {isCatExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {isEditingCat ? (
                    <div className="flex-1">
                      <EditInput id={cat.id} size="md" />
                    </div>
                  ) : (
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold">{cat.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {subs.length} sub-categor{subs.length === 1 ? "y" : "ies"}
                      </span>
                    </div>
                  )}

                  {!isEditingCat && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(cat)} title="Rename">
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        disabled={deletingId === cat.id}
                        onClick={() => deleteRow(cat.id, cat.name)}
                      >
                        {deletingId === cat.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </Button>
                    </div>
                  )}
                </div>

                {/* ── Sub-categories (Level 2) ── */}
                {isCatExpanded && subs.length > 0 && (
                  <div className="border-t bg-muted/20">
                    {subs.map((sub) => {
                      const subItems = itemsOf(sub.id)
                      const isSubExpanded = expandedSub[sub.id] ?? true
                      const isEditingSub = editingId === sub.id

                      return (
                        <div key={sub.id} className="border-b last:border-b-0">

                          {/* Sub-category row */}
                          <div className="flex items-center gap-2 px-8 py-3">
                            <button
                              onClick={() => setExpandedSub((prev) => ({ ...prev, [sub.id]: !isSubExpanded }))}
                              className="text-muted-foreground hover:text-foreground flex-shrink-0"
                            >
                              {isSubExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>

                            {isEditingSub ? (
                              <div className="flex-1">
                                <EditInput id={sub.id} size="md" />
                              </div>
                            ) : (
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-medium">{sub.name}</span>
                                <span className="ml-2 text-xs text-muted-foreground">
                                  {subItems.length} item{subItems.length !== 1 ? "s" : ""}
                                </span>
                              </div>
                            )}

                            {!isEditingSub && (
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(sub)} title="Rename">
                                  <Pencil size={12} />
                                </Button>
                                <Button
                                  variant="ghost" size="icon"
                                  className="h-7 w-7 text-destructive hover:text-destructive"
                                  disabled={deletingId === sub.id}
                                  onClick={() => deleteRow(sub.id, sub.name)}
                                >
                                  {deletingId === sub.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                                </Button>
                              </div>
                            )}
                          </div>

                          {/* Items / Products (Level 3) */}
                          {isSubExpanded && subItems.length > 0 && (
                            <div className="px-12 pb-3 flex flex-wrap gap-2">
                              {subItems.map((item) => {
                                const isEditingItem = editingId === item.id
                                return isEditingItem ? (
                                  <div key={item.id} className="flex items-center gap-1 bg-background border rounded-full px-3 py-1">
                                    <input
                                      ref={editRef}
                                      value={editName}
                                      onChange={(e) => setEditName(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") saveEdit(item.id)
                                        if (e.key === "Escape") cancelEdit()
                                      }}
                                      className="text-sm outline-none w-32 bg-transparent"
                                    />
                                    <button onClick={() => saveEdit(item.id)} className="text-green-600">
                                      {savingEdit ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                                    </button>
                                    <button onClick={cancelEdit} className="text-muted-foreground">
                                      <X size={11} />
                                    </button>
                                  </div>
                                ) : (
                                  <div
                                    key={item.id}
                                    className="group flex items-center gap-1 bg-background border px-3 py-1 rounded-full text-sm hover:border-primary/50 transition-colors"
                                  >
                                    <span>{item.name}</span>
                                    <button
                                      onClick={() => startEdit(item)}
                                      className="ml-1 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <Pencil size={10} />
                                    </button>
                                    <button
                                      onClick={() => deleteRow(item.id, item.name)}
                                      disabled={deletingId === item.id}
                                      className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      {deletingId === item.id ? <Loader2 size={10} className="animate-spin" /> : <X size={10} />}
                                    </button>
                                  </div>
                                )
                              })}
                            </div>
                          )}

                          {isSubExpanded && subItems.length === 0 && (
                            <p className="px-12 pb-3 text-xs text-muted-foreground italic">No items yet.</p>
                          )}
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