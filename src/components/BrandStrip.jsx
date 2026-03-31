// BrandStrip.jsx
// ─────────────────────────────────────────────────────────────────
// Infinite auto-scrolling brand logo strip.
// Replace the `logos` array with your 27 actual image URLs.
// ─────────────────────────────────────────────────────────────────

// ── Paste your 27 logo URLs here ──────────────────────────────────
// BrandStrip.jsx
// ─────────────────────────────────────────────────────────────────
// Infinite auto-scrolling brand logo strip.
// Replace the `logos` array with your 27 actual image URLs.
// ─────────────────────────────────────────────────────────────────

const logos = [
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/Zomato_Logo.svg.png",  alt: "HUL" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/weas%20ahgshags.png",                                  alt: "Apple" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/wave%20(1)-Photoroom.png",                                            alt: "Amazon" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/Vivo_(technology_company)-Logo.wine.png",                                  alt: "Google" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/testimonial-2.jpg",                                      alt: "Microsoft" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/Sport_since_center_logo.png",                                            alt: "Nike" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/SBI-Logo.png",                                            alt: "Adidas" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/pnb.png",               alt: "Spotify" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/maxresdefault.png",               alt: "Spotify" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/Logo_Sun_Pharmaceutical.png",               alt: "Spotify" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/logo.png",               alt: "Spotify" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/logo.jpg",               alt: "Spotify" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/lic-logo-life-insurance-corporation-of-india-vector-50150578%20(1).png",               alt: "Spotify" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/kksjdkjakjfakjsfkajsf%20(1).png",               alt: "Spotify" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/Kirloskar_Group-Logo.wine.png",               alt: "Spotify" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/jjsoeos.jpg",               alt: "Spotify" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/Jio-bp_logo.png",               alt: "Spotify" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/ITG_logo-(1)-thumb-webp.png",               alt: "Spotify" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/Indian_Oil_Logo.svg.png",               alt: "Spotify" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/images%20(2)%20(1).png",               alt: "Spotify" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/images%20(1).png",               alt: "Spotify" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/hdfc-logo.png",               alt: "Spotify" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/fit-india-fit-india-01-01.png",               alt: "Spotify" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/Blinkit-yellow-rounded.svg.png",               alt: "Spotify" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/Bajaj_Finserv_Logo.png",               alt: "Spotify" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/AU-Bank-new-logo-for-GBM_1024X1024_(cropped).png",               alt: "Spotify" },
  { src: "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/308119154_155576693769875_253814155051058336_n.png",               alt: "Spotify" },
  
  // ── Add your remaining logos below ──
  // { src: "YOUR_LOGO_URL", alt: "Brand Name" },
]


export default function BrandStrip() {
  return (
    <section className="bg-white border-b border-zinc-100 py-6 overflow-hidden">

      {/* ── Header ── */}
      <div className="text-center mb-5 px-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#5fc7f4" }}>
          Trusted By
        </p>
        <h3 className="text-lg md:text-xl font-bold mt-1" style={{ color: "#065999" }}>
          Collaborated with <span style={{ color: "#5fc7f4" }}>100+ Brands</span>
        </h3>
      </div>

      {/* ── Scrolling strip ── */}
      <div className="relative w-full overflow-hidden">

        {/* Left + right fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 md:w-32 z-10"
          style={{ background: "linear-gradient(to right, white, transparent)" }} />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 md:w-32 z-10"
          style={{ background: "linear-gradient(to left, white, transparent)" }} />

        {/* Scroll track */}
        <div className="brand-scroll-track flex gap-10 md:gap-14 items-center w-max">
          {DOUBLED.map((logo, i) => (
            <div key={i}
              className="flex-shrink-0 flex items-center justify-center"
              style={{ width: "clamp(80px, 10vw, 130px)", height: "60px" }}>
              <img
                src={logo.src}
                alt={logo.alt}
                className="w-full h-full object-contain"
                style={{
                  filter:    "opacity(80%)",
                  transition: "filter 0.3s ease",
                }}
                onMouseEnter={e => e.currentTarget.style.filter = "opacity(100%)"}
                onMouseLeave={e => e.currentTarget.style.filter = "opacity(80%)"}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Animation ── */}
      <style>{`
        .brand-scroll-track {
          animation: brandScroll 35s linear infinite;
        }
        .brand-scroll-track:hover {
          animation-play-state: paused;
        }
        @keyframes brandScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>

    </section>
  )
}
  
  // Duplicate the array so the scroll loops seamlessly
  const DOUBLED = [...logos, ...logos, ...logos]
  
  export default function BrandStrip() {
    return (
      <section className="bg-white border-b border-zinc-100 py-6 overflow-hidden">
  
        {/* ── Header ── */}
        <div className="text-center mb-5 px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#5fc7f4" }}>
            Trusted By
          </p>
          <h3 className="text-lg md:text-xl font-bold mt-1" style={{ color: "#065999" }}>
            Collaborated with <span style={{ color: "#5fc7f4" }}>100+ Brands</span>
          </h3>
        </div>
  
        {/* ── Scrolling strip ── */}
        <div className="relative w-full overflow-hidden">
  
          {/* Left + right fade masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 md:w-32 z-10"
            style={{ background: "linear-gradient(to right, white, transparent)" }} />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 md:w-32 z-10"
            style={{ background: "linear-gradient(to left, white, transparent)" }} />
  
          {/* Scroll track */}
          <div className="brand-scroll-track flex gap-10 md:gap-14 items-center w-max">
            {DOUBLED.map((logo, i) => (
              <div key={i}
                className="flex-shrink-0 flex items-center justify-center"
                style={{ width: "clamp(80px, 10vw, 130px)", height: "60px" }}>
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="w-full h-full object-contain"
                  style={{
                    filter:    "grayscale(100%) opacity(55%)",
                    transition: "filter 0.3s ease",
                  }}
                  onMouseEnter={e => e.currentTarget.style.filter = "grayscale(0%) opacity(100%)"}
                  onMouseLeave={e => e.currentTarget.style.filter = "grayscale(100%) opacity(55%)"}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
  
        {/* ── Animation ── */}
        <style>{`
          .brand-scroll-track {
            animation: brandScroll 35s linear infinite;
          }
          .brand-scroll-track:hover {
            animation-play-state: paused;
          }
          @keyframes brandScroll {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }
        `}</style>
  
      </section>
    )
  }