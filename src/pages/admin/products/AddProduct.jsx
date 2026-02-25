import AdminLayout from "@/components/AdminLayout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function AddProduct() {
  const handleSubmit = (e) => {
    e.preventDefault()
    alert("Product saved (connect Supabase later)")
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-6">

        Add New Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">

        <Input placeholder="Product Title" />

        <Input placeholder="Slug (unique URL name)" />

        <Input placeholder="Category" />

        <Textarea placeholder="Description" />

        <Input type="file" />

        <Button type="submit" className="rounded-full">
          Save Product
        </Button>

      </form>
    </AdminLayout>
  )
}