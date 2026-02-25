import AdminLayout from "@/components/AdminLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ManageProducts() {
  const dummyProducts = [
    { id: 1, title: "Polo Matty 240 GSM" },
    { id: 2, title: "Magic Mug" },
  ]

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-6">
        Manage Products
      </h1>

      <div className="space-y-4">
        {dummyProducts.map((p) => (
          <Card key={p.id} className="p-4 flex justify-between">
            <span>{p.title}</span>

            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                Edit
              </Button>

              <Button size="sm" variant="destructive">
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </AdminLayout>
  )
}