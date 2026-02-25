import AdminLayout from "../../components/AdminLayout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ManageBanners() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-6">
        Homepage Banners
      </h1>

      <div className="space-y-4 max-w-xl">

        <Input placeholder="Banner Title" />

        <Input placeholder="Subtitle" />

        <Input type="file" />

        <Button className="rounded-full">
          Upload Banner
        </Button>

      </div>
    </AdminLayout>
  )
}