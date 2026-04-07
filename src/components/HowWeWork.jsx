import { useEffect, useRef } from "react"

const steps = [
  { number: "01", title: "Share Your Design",  desc: "Send us your artwork, logo, or idea. Our team helps you finalize the perfect design." },
  { number: "02", title: "We Prepare & Print", desc: "Your order goes into production using premium materials and precision printing equipment." },
  { number: "03", title: "Quality Check",      desc: "Every item is inspected before packing to make sure it meets our standards." },
  { number: "04", title: "Delivered to You",   desc: "Packed securely and shipped directly to your doorstep — on time, every time." },
]

// ── Replace these two src values with your Supabase video URLs ────────────────
const VIDEOS = [
  {
    src:     "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/IMG_6868.MP4",
    caption: "Our Printing Process",
  },
  {
    src:     "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/IMG_6869.MP4",
    caption: "Quality & Packaging",
  },
]

function ReelVideo({ src, caption }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.muted = true
    el.play().catch(() => {})
  }, [src])

  return (
    <div className="relative rounded-2xl overflow-hidden bg-zinc-800 flex-1" style={{ aspectRatio: "9/16" }}>
      <video
        ref={ref}
        src={src}
        loop
        muted
        playsInline
        autoPlay
        // preload metadata only — avoids buffering the full video = less lag
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      <p className="absolute bottom-3 left-0 right-0 text-center text-white text-[11px] font-medium px-3 leading-tight">
        {caption}
      </p>
    </div>
  )
}

export default function HowWeWork() {
  return (
    <section className="py-12 md:py-20 bg-zinc-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        <div className="mb-14 max-w-xl">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400 mb-3">
            Behind the Scenes
          </p>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            How We Bring Your<br />
            <span className="text-zinc-400">Ideas to Life</span>
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            From design to delivery — here's a look at our printing process and the craftsmanship that goes into every order.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, i) => (
              <div key={step.number} className="flex gap-5 group">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border border-zinc-600 group-hover:border-white group-hover:bg-white group-hover:text-zinc-900 flex items-center justify-center text-xs font-bold text-zinc-400 transition-all duration-300 flex-shrink-0">
                    {step.number}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 bg-zinc-700 mt-3 min-h-[32px]" />
                  )}
                </div>
                <div className="pb-2">
                  <h3 className="text-base font-semibold mb-1 group-hover:text-white transition-colors">{step.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/*
            Mobile: fixed width per video so both fit side by side within the screen
            Desktop: flex-1 per video inside a fixed 480px tall container
          */}
          <div className="flex gap-3 justify-center items-center lg:items-stretch lg:h-[480px]">
            {VIDEOS.map((v, i) => (
              <div
                key={i}
                /* Mobile: fixed 44vw width, auto height via aspect-ratio
                   Desktop: flex-1, height driven by container         */
                className="relative rounded-2xl overflow-hidden bg-zinc-800 flex-shrink-0 lg:flex-1 lg:flex-shrink lg:w-auto"
                style={{ aspectRatio: "9/16", width: "44vw", maxWidth: "270px" }}>
                <video
                  ref={null}
                  src={v.src}
                  loop
                  muted
                  playsInline
                  autoPlay
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover"
                  // force play via onCanPlay for reliability across browsers
                  onCanPlay={e => { e.target.muted = true; e.target.play().catch(() => {}) }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <p className="absolute bottom-3 left-0 right-0 text-center text-white text-[10px] md:text-[11px] font-medium px-2 leading-tight">
                  {v.caption}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}