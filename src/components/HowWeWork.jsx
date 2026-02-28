// HowWeWork.jsx
// Drop your own videos/images into the `mediaItems` array below.
// For videos: set type: "video" and provide a src (mp4 URL or hosted link)
// For images: set type: "image" and provide a src (URL)

const steps = [
    {
      number: "01",
      title: "Share Your Design",
      desc: "Send us your artwork, logo, or idea. Our team helps you finalize the perfect design.",
    },
    {
      number: "02",
      title: "We Prepare & Print",
      desc: "Your order goes into production using premium materials and precision printing equipment.",
    },
    {
      number: "03",
      title: "Quality Check",
      desc: "Every item is inspected before packing to make sure it meets our standards.",
    },
    {
      number: "04",
      title: "Delivered to You",
      desc: "Packed securely and shipped directly to your doorstep — on time, every time.",
    },
  ]
  
  // ── Replace these with your actual photos/videos ──────────────────────────────
  const mediaItems = [
    {
      type: "image",
      src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800",
      caption: "Design Consultation",
      span: "col-span-2 row-span-2", // large
    },
    {
      type: "image",
      src: "https://images.unsplash.com/photo-1581093588401-22d4a6d18a44?q=80&w=800",
      caption: "Screen Printing",
      span: "col-span-1 row-span-1",
    },
    {
      type: "image",
      src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800",
      caption: "Embroidery Work",
      span: "col-span-1 row-span-1",
    },
    {
      type: "image",
      src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800",
      caption: "Quality Inspection",
      span: "col-span-1 row-span-1",
    },
    {
      type: "image",
      src: "https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=800",
      caption: "Final Packaging",
      span: "col-span-1 row-span-1",
    },
  ]
  
  export default function HowWeWork() {
    return (
      <section className="py-20 bg-zinc-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
  
          {/* Header */}
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
  
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
  
            {/* Left — steps */}
            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={step.number} className="flex gap-5 group">
                  {/* Number + line */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full border border-zinc-600 group-hover:border-white group-hover:bg-white group-hover:text-zinc-900 flex items-center justify-center text-xs font-bold text-zinc-400 transition-all duration-300 flex-shrink-0">
                      {step.number}
                    </div>
                    {i < steps.length - 1 && (
                      <div className="w-px flex-1 bg-zinc-700 mt-3 min-h-[32px]" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-2">
                    <h3 className="text-base font-semibold mb-1 group-hover:text-white transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
  
            {/* Right — media mosaic */}
            <div className="grid grid-cols-2 grid-rows-3 gap-3 h-[480px]">
              {mediaItems.map((item, i) => (
                <div
                  key={i}
                  className={`relative rounded-xl overflow-hidden group ${item.span}`}
                >
                  {item.type === "video" ? (
                    <video
                      src={item.src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={item.src}
                      alt={item.caption}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  {/* Caption on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
                    <p className="text-white text-xs font-medium px-3 py-2 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      {item.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
  
          </div>
        </div>
      </section>
    )
  }