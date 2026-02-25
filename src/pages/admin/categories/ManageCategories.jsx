import { useState } from "react"
import AdminLayout from "@/components/AdminLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Trash2, Plus } from "lucide-react"

export default function ManageCategories() {
  // Demo nested categories
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Apparel",
      children: ["Polo T-Shirts", "Round Neck", "Winter Collection"],
    },
    {
      id: 2,
      name: "Drinkware",
      children: ["Water Bottles", "Tumblers", "Ceramic Mugs"],
    },
  ])

  const [newCategory, setNewCategory] = useState("")
  const [subCategory, setSubCategory] = useState("")
  const [selectedParent, setSelectedParent] = useState(null)

  // Add main category
  const addCategory = () => {
    if (!newCategory.trim()) return

    setCategories([
      ...categories,
      {
        id: Date.now(),
        name: newCategory,
        children: [],
      },
    ])

    setNewCategory("")
  }

  // Add sub-category
  const addSubCategory = () => {
    if (!subCategory.trim() || selectedParent === null) return

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === selectedParent
          ? { ...cat, children: [...cat.children, subCategory] }
          : cat
      )
    )

    setSubCategory("")
  }

  // Delete main category
  const deleteCategory = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id))
  }

  // Delete sub category
  const deleteSub = (parentId, name) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === parentId
          ? {
              ...cat,
              children: cat.children.filter((c) => c !== name),
            }
          : cat
      )
    )
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-6">
        Manage Categories
      </h1>

      {/* ADD MAIN CATEGORY */}
      <Card className="p-6 mb-6">
        <h2 className="font-medium mb-3">Add Category</h2>

        <div className="flex gap-3">
          <Input
            placeholder="Category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />

          <Button onClick={addCategory}>
            <Plus size={16} className="mr-1" />
            Add
          </Button>
        </div>
      </Card>

      {/* ADD SUB CATEGORY */}
      <Card className="p-6 mb-8">
        <h2 className="font-medium mb-3">Add Sub-Category</h2>

        <div className="flex flex-wrap gap-3">
          <select
            className="border rounded-md px-3 py-2"
            onChange={(e) =>
              setSelectedParent(Number(e.target.value))
            }
          >
            <option>Select parent category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <Input
            placeholder="Sub-category name"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
          />

          <Button onClick={addSubCategory}>
            <Plus size={16} className="mr-1" />
            Add
          </Button>
        </div>
      </Card>

      {/* CATEGORY LIST */}
      <div className="space-y-4">
        {categories.map((cat) => (
          <Card key={cat.id} className="p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">
                {cat.name}
              </h3>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteCategory(cat.id)}
              >
                <Trash2 size={18} />
              </Button>
            </div>

            {/* Sub categories */}
            {cat.children.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {cat.children.map((sub) => (
                  <div
                    key={sub}
                    className="flex items-center bg-muted px-3 py-1 rounded-full text-sm"
                  >
                    {sub}

                    <button
                      className="ml-2 text-red-500"
                      onClick={() => deleteSub(cat.id, sub)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </AdminLayout>
  )
}