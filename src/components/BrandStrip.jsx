// BrandStrip.jsx — smooth infinite scroll brand logos

const logos = [
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/Zomato_Logo.svg.png",                                                                            alt: "Zomato" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/weas%20ahgshags.png",                                                                            alt: "Brand" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/Vivo_(technology_company)-Logo.wine.png",                                                        alt: "Vivo" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/testimonial-2.jpg",                                                                             alt: "Brand" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/Sport_since_center_logo.png",                                                                   alt: "Sport Since Center" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/SBI-Logo.png",                                                                                  alt: "SBI" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/pnb.png",                                                                                       alt: "PNB" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/maxresdefault.png",                                                                             alt: "Brand" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/Logo_Sun_Pharmaceutical.png",                                                                   alt: "Sun Pharma" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/logo.png",                                                                                      alt: "Brand" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/logo.jpg",                                                                                      alt: "Brand" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/lic-logo-life-insurance-corporation-of-india-vector-50150578%20(1).png",                        alt: "LIC" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/kksjdkjakjfakjsfkajsf%20(1).png",                                                              alt: "Brand" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/Kirloskar_Group-Logo.wine.png",                                                                 alt: "Kirloskar" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/jjsoeos.jpg",                                                                                   alt: "Brand" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/Jio-bp_logo.png",                                                                               alt: "Jio BP" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/ITG_logo-(1)-thumb-webp.png",                                                                   alt: "ITG" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/Indian_Oil_Logo.svg.png",                                                                       alt: "Indian Oil" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/images%20(2)%20(1).png",                                                                        alt: "Brand" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/images%20(1).png",                                                                              alt: "Brand" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/hdfc-logo.png",                                                                                 alt: "HDFC" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/fit-india-fit-india-01-01.png",                                                                 alt: "Fit India" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/Blinkit-yellow-rounded.svg.png",                                                                alt: "Blinkit" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/Bajaj_Finserv_Logo.png",                                                                        alt: "Bajaj Finserv" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/AU-Bank-new-logo-for-GBM_1024X1024_(cropped).png",                                              alt: "AU Bank" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/308119154_155576693769875_253814155051058336_n.png",                                            alt: "Brand" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/446ef49dc08bfae77996e617509a1815.jpg",                                                          alt: "Brand" },
]

// Duplicate twice for seamless loop — translate -50% = back to start
const TRACK = [...logos, ...logos]

export default function BrandStrip() {
  return (
    <section className="bg-white border-b border-zinc-100 py-8 overflow-hidden">

      {/* Header */}
      <div className="text-center mb-6 px-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#5fc7f4" }}>
          Trusted By
        </p>
        <h3 className="text-lg md:text-xl font-bold mt-1" style={{ color: "#065999" }}>
          Collaborated with <span style={{ color: "#5fc7f4" }}>100+ Brands</span>
        </h3>
      </div>

      {/* Scrolling strip */}
      <div className="relative w-full overflow-hidden">

        {/* Fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-24 z-10"
          style={{ background: "linear-gradient(to right, #ffffff, transparent)" }} />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-24 z-10"
          style={{ background: "linear-gradient(to left, #ffffff, transparent)" }} />

        {/*
          KEY FIX for smoothness:
          - All logo slots are EXACTLY the same fixed width (140px) and height (64px)
          - Images use object-contain inside — no layout shifting
          - Animation moves -50% (exactly one copy width) so loop is invisible
          - will-change: transform + translateZ(0) forces GPU compositing
        */}
        <div
          className="brand-track flex items-center"
          style={{ width: "max-content" }}>
          {TRACK.map((logo, i) => (
            <div
              key={i}
              className="brand-item flex items-center justify-center flex-shrink-0"
              style={{ width: "140px", height: "64px", padding: "0 20px" }}>
              <img
                src={logo.src}
                alt={logo.alt}
                loading="lazy"
                decoding="async"
                style={{
                  width:      "100%",
                  height:     "100%",
                  objectFit:  "contain",
                  opacity:    0.75,
                  transition: "opacity 0.25s ease",
                  display:    "block",
                  flexShrink: 0,
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                onMouseLeave={e => e.currentTarget.style.opacity = "0.75"}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .brand-track {
          animation: marquee 30s linear infinite;
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        .brand-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0%   { transform: translateX(0) translateZ(0); }
          100% { transform: translateX(-50%) translateZ(0); }
        }
      `}</style>

    </section>
  )
}