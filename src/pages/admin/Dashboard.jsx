import { useState, useEffect } from "react"
import AdminLayout from "@/components/AdminLayout"
import { Card } from "@/components/ui/card"
import { Package, Tag, Image, TrendingUp, Star, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <Card className="p-6 flex items-start gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold mt-0.5">
          {value === null ? (
            <Loader2 size={22} className="animate-spin text-muted-foreground mt-1" />
          ) : (
            value
          )}
        </p>
      </div>
    </Card>
  )
}

export default function Dashboard() {
  const [counts, setCounts] = useState({
    products: null,
    categories: null,
    banners: null,
    featured: null,
  })
  const [recentProducts, setRecentProducts] = useState([])
  const [loadingRecent, setLoadingRecent] = useState(true)

  // ── Fetch counts ──────────────────────────────────────────────────────────
  async function fetchCounts() {
    const [products, categories, banners, featured] = await Promise.all([
      supabase.from("Products").select("*", { count: "exact", head: true }),
      supabase.from("Categories").select("*", { count: "exact", head: true }),
      supabase.from("Banners").select("*", { count: "exact", head: true }),
      supabase.from("Products").select("*", { count: "exact", head: true }).eq("is_featured", true),
    ])

    setCounts({
      products: products.count ?? 0,
      categories: categories.count ?? 0,
      banners: banners.count ?? 0,
      featured: featured.count ?? 0,
    })
  }

  // ── Fetch recent products ─────────────────────────────────────────────────
  async function fetchRecent() {
    const { data } = await supabase
      .from("Products")
      .select("id, name, price, image_url, is_featured, created_at, Categories(name)")
      .order("created_at", { ascending: false })
      .limit(5)
    if (data) setRecentProducts(data)
    setLoadingRecent(false)
  }

  useEffect(() => {
    fetchCounts()
    fetchRecent()
  }, [])

  // ── Realtime ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel("dashboard-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "Products" }, () => {
        fetchCounts()
        fetchRecent()
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "Categories" }, fetchCounts)
      .on("postgres_changes", { event: "*", schema: "public", table: "Banners" }, fetchCounts)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Live overview of your print store.
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <StatCard
          icon={Package}
          label="Total Products"
          value={counts.products}
          color="bg-blue-500"
        />
        <StatCard
          icon={Tag}
          label="Categories"
          value={counts.categories}
          color="bg-violet-500"
        />
        <StatCard
          icon={Image}
          label="Active Banners"
          value={counts.banners}
          color="bg-emerald-500"
        />
        <StatCard
          icon={Star}
          label="Featured Products"
          value={counts.featured}
          color="bg-amber-500"
        />
      </div>

      {/* ── Recent products ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-muted-foreground" />
          <h2 className="text-base font-semibold">Recently Added Products</h2>
        </div>

        {loadingRecent ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 size={14} className="animate-spin" /> Loading…
          </div>
        ) : recentProducts.length === 0 ? (
          <Card className="p-8 text-center text-sm text-muted-foreground">
            No products yet. Go to <strong>Add Product</strong> to get started.
          </Card>
        ) : (
          <Card className="divide-y overflow-hidden">
            {recentProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-muted/40 transition-colors">
                {/* Thumbnail */}
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-11 h-11 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-lg bg-muted flex-shrink-0" />
                )}

                {/* Name + category */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{p.name}</p>
                    {p.is_featured && (
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {p.Categories?.name ?? "Uncategorized"}
                  </p>
                </div>

                {/* Price */}
                <div className="text-sm font-medium flex-shrink-0">
                  {p.price != null
                    ? `₹${Number(p.price).toLocaleString("en-IN")}`
                    : <span className="text-muted-foreground">—</span>
                  }
                </div>

                {/* Date */}
                <div className="text-xs text-muted-foreground flex-shrink-0 hidden sm:block">
                  {new Date(p.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}