import AdminLayout from "@/components/AdminLayout"
import { Card } from "@/components/ui/card"

export default function Dashboard() {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-semibold mb-8">
        Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-lg font-medium">
            Products
          </h3>
          <p className="text-3xl font-bold mt-2">—</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium">
            Categories
          </h3>
          <p className="text-3xl font-bold mt-2">—</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium">
            Active Banners
          </h3>
          <p className="text-3xl font-bold mt-2">—</p>
        </Card>
      </div>
    </AdminLayout>
  )
}