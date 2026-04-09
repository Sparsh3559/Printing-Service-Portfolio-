import { useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Phone, Mail, Instagram, Facebook, Linkedin, Youtube, Twitter, MapPin } from "lucide-react"

// ── Scroll to top on every route change ──────────────────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }) }, [pathname])
  return null
}

const WAVE_URL = "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/wave%20(1)-Photoroom.png"

function LocationSection() {
  const valueProps = [
    { title: "Even Low Quantities @ Best Prices", desc: "We offer low / single product quantities at affordable prices." },
    { title: "High Quality Products and Easy Design", desc: "Our wide selection of high-quality products and online design tools make it easy for you to customize and order your favourite products." },
    { title: "Free Replacement or Full Refund", desc: "We stand by everything we sell. So if you're not satisfied, we'll make it right." },
  ]

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
              Mekal Enterprises: The Leader in Customisation
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-8">
              For more than 10 years, Mekal Enterprises has helped business owners, entrepreneurs
              and individuals create their identities with custom designs and professional marketing.
              Our online printing services are intended to help you find high-quality customised
              products you need – visiting cards, personalized clothing, gifting products, and much more.
            </p>
            <div className="space-y-5">
              {valueProps.map(vp => (
                <div key={vp.title}>
                  <h3 className="font-bold text-gray-800 text-sm md:text-base mb-1">{vp.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{vp.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <MapPin size={18} style={{ color: "#065999" }} /> Our Location
            </h3>
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100" style={{ height: "380px" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3994.042952435717!2d76.03016567555798!3d22.966320918424515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396317c4317fe813%3A0x6ad9188d8f033095!2zTUVLQUwgRU5URVJQUklTRVPihKLvuI8!5e1!3m2!1sen!2sin!4v1774326786901!5m2!1sen!2sin"
                width="100%" height="100%" style={{ border: 0 }}
                allowFullScreen="" loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mekal Enterprises Location"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <MapPin size={11} /> Dewas, Madhya Pradesh, India
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Footer() {
  const allProducts = [
    { label: "Custom Apparel", to: "/category/16" },
    { label: "Custom Drinkware", to: "/category/17" },
    { label: "Stationery, Letterheads & Notebooks", to: "/stationery" },
    { label: "Stamps and Ink", to: "/stationery" },
    { label: "Signs, Posters & Marketing Materials", to: "/" },
    { label: "Corporate Gifts", to: "/corporate-giftings" },
    { label: "Custom Package Water Bottle", to: "/drinkware" },
    { label: "Custom Bags", to: "/labels-stickers" },
    { label: "Labels & Stickers", to: "/labels-stickers" },
    { label: "Visiting Cards & ID Cards", to: "/visiting-cards" },
  ]

  const customerSupport = [
    { label: "Help Desk", to: "/help" },
    { label: "Privacy Policy", to: "/privacy-policy" },
    { label: "Return & Shipping Policy", to: "/shipping-policy" },
    { label: "Terms & Conditions", to: "/terms" },
    { label: "Payment", to: "/payment" },
    { label: "Contact Us", to: "/contact" },
    { label: "FAQs", to: "/faqs" },
  ]

  const companyInfo = [
    { label: "About Us", to: "/about" },
    { label: "Working with Mekal", to: "/working-with-mekal" },
  ]

  const socials = [
    { icon: <Instagram size={16} />, href: "https://www.instagram.com/mekal.in?igsh=bDVvdXNiaW02Nzlh", label: "Instagram" },
    { icon: <Facebook size={16} />, href: "https://www.facebook.com/p/Mekal-Enterprises-100067034525784/", label: "Facebook" },
    { icon: <Youtube size={16} />, href: "https://www.youtube.com/@MekalEnterprises", label: "YouTube" },
    { icon: <Linkedin size={16} />, href: "https://www.linkedin.com/company/mekal-enterprises/", label: "LinkedIn" },
    { icon: <span className="text-[9px] font-bold leading-none">IM</span>, href: "https://www.indiamart.com/mekal-enterprises/photos.html", label: "IndiaMart" },
    { icon: <span className="text-[9px] font-bold leading-none">JD</span>, href: "https://www.justdial.com/Dewas/Mekal-Enterprises-Mekal-Enteerprises-Mishrilal-Nagar/9999P7272-7272-230421193507-M5G2_BZDET", label: "JustDial" },
  ]

  return (
    <>
      <ScrollToTop />
      <LocationSection />

      <footer style={{ backgroundColor: "#5fc7f4" }} className="text-white relative overflow-hidden">

        <div className="w-full overflow-hidden leading-none -mt-1">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none"
            className="w-full h-10 md:h-16" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,0 L0,0 Z" fill="white" />
          </svg>
        </div>

        {/* ── UPDATED WAVE + LOGO SECTION ── */}
        <div className="relative w-full border-b border-white/20">

          <div className="relative flex w-full" style={{ height: "clamp(100px, 20vw, 160px)" }}>
            <img src={WAVE_URL} alt="" className="flex-1 object-fill" style={{ minWidth: 0 }} />
            <img src={WAVE_URL} alt="" className="flex-1 object-fill" style={{ minWidth: 0, transform: "scaleX(-1)" }} />

            {/* subtle center blend */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: 0,
                transform: "translateX(-50%)",
                width: "120px",
                height: "100%",
                background: "linear-gradient(to right, rgba(0,0,0,0.12), transparent 40%, transparent 60%, rgba(0,0,0,0.12))",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* logo higher, no fade */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "32%",
              transform: "translate(-50%, -50%)",
              zIndex: 20,
            }}
          >
            <img
              src="/mekal_logo.png"
              alt="Mekal Enterprises"
              style={{
                height: "clamp(100px, 18vw, 160px)",
                width: "auto",
                objectFit: "contain",
              }}
            />
          </div>

          <div className="text-center pt-6 pb-5 px-4">
            <p className="text-sm md:text-base font-medium max-w-2xl mx-auto mb-4 leading-relaxed" style={{ color: "#0a2a5e" }}>
              We are the best Gifting Solutions Company in India.&nbsp;
              We have a wide range of products for any budget provided to us.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm" style={{ color: "#0a2a5e" }}>
              <a href="tel:+919131387559" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                <Phone size={14} />
                +91 9131387559
              </a>
              <span className="hidden sm:block opacity-30">•</span>
              <a href="mailto:mekal.enterprises@gmail.com" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                <Mail size={14} />
                mekal.enterprises@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* rest untouched */}
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">

            <div>
              <h4 className="font-semibold mb-5 text-xs uppercase tracking-widest" style={{ color: "#0a2a5e" }}>All Products</h4>
              <ul className="space-y-2.5 text-sm" style={{ color: "#0a2a5e" }}>
                {allProducts.map(item => (
                  <li key={item.label}>
                    <Link to={item.to} className="hover:opacity-60">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-5 text-xs uppercase tracking-widest" style={{ color: "#0a2a5e" }}>Customer Support</h4>
              <ul className="space-y-2.5 text-sm" style={{ color: "#0a2a5e" }}>
                {customerSupport.map(item => (
                  <li key={item.label}>
                    <Link to={item.to} className="hover:opacity-60">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-5 text-xs uppercase tracking-widest" style={{ color: "#0a2a5e" }}>Company Info</h4>
              <ul className="space-y-2.5 text-sm mb-8" style={{ color: "#0a2a5e" }}>
                {companyInfo.map(item => (
                  <li key={item.label}>
                    <Link to={item.to} className="hover:opacity-60">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        <div className="border-t border-white/20 text-center text-xs py-4 px-4" style={{ color: "#0a2a5e", opacity: 0.7 }}>
          © {new Date().getFullYear()} Mekal Enterprises. All rights reserved.
        </div>

      </footer>
    </>
  )
}