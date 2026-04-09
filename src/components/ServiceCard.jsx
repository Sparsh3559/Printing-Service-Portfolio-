import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

export default function ServiceCard({ title, image, path }) {
  return (
    <Link to={path} className="group block">
      <Card className="overflow-hidden border bg-white transition-all duration-300 hover:shadow-md">

        {/* IMAGE — faster scale + subtle brightness lift */}
        <div className="overflow-hidden relative">
          <img
            src={image}
            alt={title}
            className="w-full h-56 object-cover transition-all duration-300 ease-out group-hover:scale-105 group-hover:brightness-105"
          />
          {/* Soft overlay that fades in on hover — adds depth without changing layout */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* CONTENT */}
        <CardContent className="p-6 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 transition-colors duration-200 group-hover:text-[#065999]">
            {title}
          </h3>
          <ArrowRight
            size={18}
            className="text-gray-400 transition-all duration-200 group-hover:text-[#065999] group-hover:translate-x-1.5"
          />
        </CardContent>

      </Card>
    </Link>
  )
}