import { useState, useEffect } from "react"
import AdminLayout from "@/components/AdminLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { Star, Check, X, Trash2, Loader2, Eye, EyeOff } from "lucide-react"

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} className={i < count ? "fill-amber-400 text-amber-400" : "fill-zinc-200 text-zinc-200"} />
      ))}
    </div>
  )
}

export default function ManageReviews() {
  const [reviews,    setReviews]    = useState([])
  const [loading,    setLoading]    = useState(true)
  const [filter,     setFilter]     = useState("all")   // "all" | "pending" | "approved"
  const [deletingId, setDeletingId] = useState(null)
  const [togglingId, setTogglingId] = useState(null)

  async function fetchReviews() {
    setLoading(true)
    const q = supabase.from("Reviews").select("*").order("created_at", { ascending: false })
    const { data } = await q
    if (data) setReviews(data)
    setLoading(false)
  }

  useEffect(() => { fetchReviews() }, [])

  async function toggleApproval(r) {
    setTogglingId(r.id)
    await supabase.from("Reviews").update({ is_approved: !r.is_approved }).eq("id", r.id)
    setReviews(prev => prev.map(x => x.id === r.id ? { ...x, is_approved: !r.is_approved } : x))
    setTogglingId(null)
  }

  async function deleteReview(id) {
    if (!confirm("Delete this review permanently?")) return
    setDeletingId(id)
    await supabase.from("Reviews").delete().eq("id", id)
    setReviews(prev => prev.filter(r => r.id !== id))
    setDeletingId(null)
  }

  const filtered = reviews.filter(r => {
    if (filter === "pending")  return !r.is_approved
    if (filter === "approved") return r.is_approved
    return true
  })

  const pending  = reviews.filter(r => !r.is_approved).length
  const approved = reviews.filter(r =>  r.is_approved).length

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Reviews & Feedback</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Approve reviews to show them in the testimonials carousel on the website.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total",    count: reviews.length, color: "bg-zinc-100 text-zinc-700" },
          { label: "Pending",  count: pending,         color: "bg-amber-50 text-amber-700" },
          { label: "Approved", count: approved,        color: "bg-green-50 text-green-700" },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-4 text-center ${s.color}`}>
            <p className="text-2xl font-bold">{s.count}</p>
            <p className="text-xs font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {[["all", "All"], ["pending", "Pending"], ["approved", "Approved on Site"]].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === val ? "text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
            style={filter === val ? { backgroundColor: "#065999" } : {}}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-8">
          <Loader2 size={15} className="animate-spin" /> Loading reviews…
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">
          No {filter === "pending" ? "pending" : filter === "approved" ? "approved" : ""} reviews yet.
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <Card key={r.id} className={`p-5 transition-opacity ${!r.is_approved ? "border-amber-200 bg-amber-50/30" : "border-green-100"}`}>
              <div className="flex items-start gap-4">

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: "#065999" }}>
                  {r.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <p className="font-semibold text-sm text-zinc-900">{r.name}</p>
                    {r.mobile && <span className="text-xs text-zinc-400">{r.mobile}</span>}
                    <Stars count={r.rating} />
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      r.is_approved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {r.is_approved ? "Live on site" : "Pending approval"}
                    </span>
                  </div>
                  {r.product && <p className="text-xs text-zinc-400 mb-1">Product: {r.product}</p>}
                  <p className="text-sm text-zinc-600 leading-relaxed">"{r.review}"</p>
                  <p className="text-[10px] text-zinc-400 mt-2">
                    {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <Button
                    size="sm" variant="outline"
                    onClick={() => toggleApproval(r)}
                    disabled={togglingId === r.id}
                    className={`text-xs gap-1 ${r.is_approved ? "border-amber-300 text-amber-700 hover:bg-amber-50" : "border-green-300 text-green-700 hover:bg-green-50"}`}>
                    {togglingId === r.id
                      ? <Loader2 size={12} className="animate-spin" />
                      : r.is_approved
                      ? <><EyeOff size={12} /> Hide</>
                      : <><Check size={12} /> Approve</>}
                  </Button>
                  <Button size="sm" variant="ghost"
                    className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                    disabled={deletingId === r.id}
                    onClick={() => deleteReview(r.id)}>
                    {deletingId === r.id ? <Loader2 size={12} className="animate-spin" /> : <><Trash2 size={12} /> Delete</>}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}