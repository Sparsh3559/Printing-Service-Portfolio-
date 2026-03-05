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

export default function ManageCategories() {
  const [allRows,     setAllRows]     = useState([])
  const [loading,     setLoading]     = useState(true)
  const [expandedCat, setExpandedCat] = useState({})
  const [expandedSub, setExpandedSub] = useState({})

  const [newCat,  setNewCat]  = useState("")
  const [addingCat, setAddingCat] = useState(false)

  const [newSub,  setNewSub]  = useState("")
  const [selectedParentForSub, setSelectedParentForSub] = useState("")
  const [addingSub, setAddingSub] = useState(false)

  const [newItem, setNewItem] = useState("")
  const [selectedCatForItem,  setSelectedCatForItem]  = useState("")
  const [selectedSubForItem,  setSelectedSubForItem]  = useState("")
  const [addingItem, setAddingItem] = useState(false)

  const [editingId,  setEditingId]  = useState(null)
  const [editName,   setEditName]   = useState("")
  const [savingEdit, setSavingEdit] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const editRef = useRef()

  async function fetchAll() {
    const { data, error } = await supabase
      .from("Categories")
      .select("*")
      .order("name")
    if (error) { console.error("Fetch error:", error); return }
    setAllRows(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

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

  // ── Derive 3 levels from flat list ─────────────────────────────────────────
  const categories    = allRows.filter((r) => r.parent_id === null)
  const categoryIds   = new Set(categories.map((c) => c.id))
  const subCategories = allRows.filter((r) => r.parent_id !== null && categoryIds.has(r.parent_id))
  const subCatIds     = new Set(subCategories.map((s) => s.id))
  const items         = allRows.filter((r) => r.parent_id !== null && subCatIds.has(r.parent_id))

  const subsOf     = (catId) => subCategories.filter((s) => s.parent_id === catId)
  const itemsOf    = (subId) => items.filter((i) => i.parent_id === subId)
  const subsForCat = (catId) => subCategories.filter((s) => s.parent_id === Number(catId))

  // ── Add handlers ───────────────────────────────────────────────────────────
  async function addCategory() {
    if (!newCat.trim()) return
    setAddingCat(true)
    const { error } = await supabase
      .from("Categories")
      .insert([{ name: newCat.trim(), parent_id: null }])
    if (error) {
      alert(`Insert failed: ${error.message}\n\nFix RLS – run in Supabase SQL editor:\nCREATE POLICY "allow_all" ON "Categories" FOR ALL USING (true) WITH CHECK (true);`)
    } else { setNewCat("") }
    setAddingCat(false)
  }

  async function addSubCategory() {
    if (!newSub.trim() || !selectedParentForSub) return
    setAddingSub(true)
    const { error } = await supabase
      .from("Categories")
      .insert([{ name: newSub.trim(), parent_id: Number(selectedParentForSub) }])
    if (error) { alert(error.message) }
    else {
      setNewSub("")
      setExpandedCat((p) => ({ ...p, [selectedParentForSub]: true }))
    }
    setAddingSub(false)
  }

  async function addItem() {
    if (!newItem.trim() || !selectedSubForItem) return
    setAddingItem(true)
    const { error } = await supabase
      .from("Categories")
      .insert([{ name: newItem.trim(), parent_id: Number(selectedSubForItem) }])
    if (error) { alert(error.message) }
    else {
      setNewItem("")
      setExpandedCat((p) => ({ ...p, [selectedCatForItem]: true }))
      setExpandedSub((p) => ({ ...p, [selectedSubForItem]: true }))
    }
    setAddingItem(false)
  }

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

  async function deleteRow(id, name) {
    if (!confirm(`Delete "${name}"? All children will also be deleted.`)) return
    setDeletingId(id)
    const { error } = await supabase.from("Categories").delete().eq("id", id)
    if (error) alert(error.message)
    setDeletingId(null)
  }

  const onKey = (e, fn) => e.key === "Enter" && fn()

  function EditInput({ id, inputClass = "h-8 text-sm max-w-xs" }) {
    return (
      <div className="flex items-center gap-1">
        <Input ref={editRef} value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") saveEdit(id); if (e.key === "Escape") cancelEdit() }}
          className={inputClass} />
        <button onClick={() => saveEdit(id)} disabled={savingEdit} className="text-green-600 hover:text-green-700">
          {savingEdit ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
        </button>
        <button onClick={cancelEdit} className="text-muted-foreground hover:text-foreground"><X size={13} /></button>
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {categories.length} categories · {subCategories.length} sub-categories · {items.length} items · Changes sync live.
        </p>
      </div>

      {/* RLS fix banner */}
      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900">
        <strong>⚠️ If you see "row-level security" errors</strong>, run this once in your{" "}
        <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="underline">Supabase SQL editor</a>:
        <pre className="mt-2 bg-amber-100 rounded px-3 py-2 text-xs font-mono whitespace-pre-wrap select-all">
{`ALTER TABLE "Categories" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_admin_all" ON "Categories"
  FOR ALL USING (true) WITH CHECK (true);`}
        </pre>
      </div>

      {/* ── Add Forms ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">

        {/* Level 1 */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-violet-100 rounded-lg"><FolderOpen size={15} className="text-violet-600" /></div>
            <div>
              <h2 className="font-medium text-sm">Add Category</h2>
              <p className="text-xs text-muted-foreground">Level 1</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Input placeholder="e.g. Apparel" value={newCat}
              onChange={(e) => setNewCat(e.target.value)} onKeyDown={(e) => onKey(e, addCategory)} />
            <Button onClick={addCategory} disabled={addingCat || !newCat.trim()} size="sm" className="flex-shrink-0">
              {addingCat ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
            </Button>
          </div>
        </Card>

        {/* Level 2 */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-blue-100 rounded-lg"><Tag size={15} className="text-blue-600" /></div>
            <div>
              <h2 className="font-medium text-sm">Add Sub-Category</h2>
              <p className="text-xs text-muted-foreground">Level 2</p>
            </div>
          </div>
          <div className="space-y-2">
            <select className="w-full border rounded-md px-3 py-2 text-sm bg-background"
              value={selectedParentForSub} onChange={(e) => setSelectedParentForSub(e.target.value)}>
              <option value="">Select category…</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <div className="flex gap-2">
              <Input placeholder="e.g. Polo T-Shirts" value={newSub}
                onChange={(e) => setNewSub(e.target.value)} onKeyDown={(e) => onKey(e, addSubCategory)} />
              <Button onClick={addSubCategory} disabled={addingSub || !newSub.trim() || !selectedParentForSub} size="sm" className="flex-shrink-0">
                {addingSub ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
              </Button>
            </div>
          </div>
        </Card>

        {/* Level 3 */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-emerald-100 rounded-lg"><Layers size={15} className="text-emerald-600" /></div>
            <div>
              <h2 className="font-medium text-sm">Add Item / Product</h2>
              <p className="text-xs text-muted-foreground">Level 3</p>
            </div>
          </div>
          <div className="space-y-2">
            <select className="w-full border rounded-md px-3 py-2 text-sm bg-background"
              value={selectedCatForItem}
              onChange={(e) => { setSelectedCatForItem(e.target.value); setSelectedSubForItem("") }}>
              <option value="">Select category…</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select className="w-full border rounded-md px-3 py-2 text-sm bg-background"
              value={selectedSubForItem} onChange={(e) => setSelectedSubForItem(e.target.value)}
              disabled={!selectedCatForItem}>
              <option value="">Select sub-category…</option>
              {subsForCat(selectedCatForItem).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <div className="flex gap-2">
              <Input placeholder="e.g. Polo Matty 240 GSM" value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => onKey(e, addItem)}
                disabled={!selectedSubForItem} />
              <Button onClick={addItem} disabled={addingItem || !newItem.trim() || !selectedSubForItem} size="sm" className="flex-shrink-0">
                {addingItem ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Tree ── */}
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 size={15} className="animate-spin" /> Loading…
        </div>
      ) : categories.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">No categories yet.</Card>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => {
            const subs = subsOf(cat.id)
            const isCatExpanded = expandedCat[cat.id] ?? true

            return (
              <Card key={cat.id} className="overflow-hidden">
                {/* Level 1 row */}
                <div className="flex items-center gap-3 px-5 py-4">
                  <button onClick={() => setExpandedCat((p) => ({ ...p, [cat.id]: !isCatExpanded }))}
                    className="text-muted-foreground hover:text-foreground flex-shrink-0">
                    {isCatExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {editingId === cat.id ? (
                    <div className="flex-1"><EditInput id={cat.id} /></div>
                  ) : (
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold">{cat.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {subs.length} sub-categor{subs.length === 1 ? "y" : "ies"}
                      </span>
                    </div>
                  )}

                  {editingId !== cat.id && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(cat)}><Pencil size={14} /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                        disabled={deletingId === cat.id} onClick={() => deleteRow(cat.id, cat.name)}>
                        {deletingId === cat.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Level 2 rows */}
                {isCatExpanded && (
                  <div className="border-t bg-muted/20">
                    {subs.length === 0 ? (
                      <p className="px-14 py-3 text-xs text-muted-foreground italic">No sub-categories yet.</p>
                    ) : subs.map((sub) => {
                      const subItems = itemsOf(sub.id)
                      const isSubExpanded = expandedSub[sub.id] ?? true

                      return (
                        <div key={sub.id} className="border-b last:border-b-0">
                          <div className="flex items-center gap-2 px-8 py-3">
                            <button onClick={() => setExpandedSub((p) => ({ ...p, [sub.id]: !isSubExpanded }))}
                              className="text-muted-foreground hover:text-foreground flex-shrink-0">
                              {isSubExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>

                            {editingId === sub.id ? (
                              <div className="flex-1"><EditInput id={sub.id} inputClass="h-7 text-sm max-w-xs" /></div>
                            ) : (
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-medium">{sub.name}</span>
                                <span className="ml-2 text-xs text-muted-foreground">
                                  {subItems.length} item{subItems.length !== 1 ? "s" : ""}
                                </span>
                              </div>
                            )}

                            {editingId !== sub.id && (
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(sub)}><Pencil size={12} /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"
                                  disabled={deletingId === sub.id} onClick={() => deleteRow(sub.id, sub.name)}>
                                  {deletingId === sub.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                                </Button>
                              </div>
                            )}
                          </div>

                          {/* Level 3 chips */}
                          {isSubExpanded && (
                            <div className="px-12 pb-3">
                              {subItems.length === 0 ? (
                                <p className="text-xs text-muted-foreground italic">No items yet.</p>
                              ) : (
                                <div className="flex flex-wrap gap-2">
                                  {subItems.map((item) =>
                                    editingId === item.id ? (
                                      <div key={item.id} className="flex items-center gap-1 bg-background border rounded-full px-3 py-1">
                                        <input ref={editRef} value={editName}
                                          onChange={(e) => setEditName(e.target.value)}
                                          onKeyDown={(e) => { if (e.key === "Enter") saveEdit(item.id); if (e.key === "Escape") cancelEdit() }}
                                          className="text-sm outline-none w-32 bg-transparent" />
                                        <button onClick={() => saveEdit(item.id)} className="text-green-600">
                                          {savingEdit ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                                        </button>
                                        <button onClick={cancelEdit} className="text-muted-foreground"><X size={11} /></button>
                                      </div>
                                    ) : (
                                      <div key={item.id}
                                        className="group flex items-center gap-1 bg-background border px-3 py-1 rounded-full text-sm hover:border-primary/50 transition-colors">
                                        <span>{item.name}</span>
                                        <button onClick={() => startEdit(item)}
                                          className="ml-1 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                          <Pencil size={10} />
                                        </button>
                                        <button onClick={() => deleteRow(item.id, item.name)} disabled={deletingId === item.id}
                                          className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                          {deletingId === item.id ? <Loader2 size={10} className="animate-spin" /> : <X size={10} />}
                                        </button>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
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