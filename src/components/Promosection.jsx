import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"

export default function PromoSection({
  tag,
  heading,
  description,
  ctaText = "View Range",
  ctaPath = "/",
  heroImage,
  tiles = [],
}) {
  return (
    <section className="overflow-hidden">

      {/* ── Top split: text left / image right ── */}
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ backgroundColor: "#e8f6fd" }}>

        {/* Left — text */}
        <div className="flex flex-col justify-center px-8 md:px-14 py-12 md:py-16">
          {tag && (
            <span className="inline-block text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: "#5fc7f4" }}>
              {tag}
            </span>
          )}
          <h2 className="text-2xl md:text-4xl font-bold leading-tight mb-4"
            style={{ color: "#065999" }}>
            {heading}
          </h2>
          <p className="text-sm leading-relaxed mb-8 max-w-sm" style={{ color: "#065999cc" }}>
            {description}
          </p>
          <Link to={ctaPath}
            className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-full w-fit transition-all duration-200 hover:gap-3"
            style={{ backgroundColor: "#065999", color: "#fff" }}>
            {ctaText}
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* Right — hero image */}
        <div className="relative h-64 md:h-auto overflow-hidden">
          <img src={heroImage} alt={heading} className="w-full h-full object-cover" />
          {/* Subtle brand overlay */}
          <div className="absolute inset-0 opacity-10"
            style={{ background: "linear-gradient(135deg, #065999, #5fc7f4)" }} />
        </div>
      </div>

      {/* ── Equal-height tiles ── */}
      <div className="grid grid-cols-2 md:grid-cols-4">
        {tiles.map((tile, i) => (
          <Link key={i} to={tile.path}
            className="group relative overflow-hidden"
            style={{ height: "clamp(150px, 28vw, 240px)" }}>
            <img src={tile.image} alt={tile.label}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

            {/* Theme-coloured gradient overlay */}
            <div className="absolute inset-0 transition-opacity duration-300"
              style={{
                background: "linear-gradient(to top, rgba(6,89,153,0.85) 0%, rgba(6,89,153,0.2) 50%, transparent 100%)"
              }} />

            {/* Hover tint */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
              style={{ backgroundColor: "#5fc7f4" }} />

            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white text-xs uppercase tracking-[0.15em] font-semibold leading-snug">
                {tile.label}
              </p>
            </div>

            {/* Number badge */}
            <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(95,199,244,0.3)", backdropFilter: "blur(4px)" }}>
              <span className="text-white text-[10px] font-bold">{i + 1}</span>
            </div>
          </Link>
        ))}
      </div>

    </section>
  )
}