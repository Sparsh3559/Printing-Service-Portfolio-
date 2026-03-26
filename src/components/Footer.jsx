import { Link } from "react-router-dom"
import { Phone, Mail, Instagram, Facebook, Linkedin, Youtube, Twitter, MapPin } from "lucide-react"

// ── Location Section ──────────────────────────────────────────────────────────
function LocationSection() {
  const valueProps = [
    {
      title: "Even Low Quantities @ Best Prices",
      desc:  "We offer low / single product quantities at affordable prices.",
    },
    {
      title: "High Quality Products and Easy Design",
      desc:  "Our wide selection of high-quality products and online design tools make it easy for you to customize and order your favourite products.",
    },
    {
      title: "Free Replacement or Full Refund",
      desc:  "We stand by everything we sell. So if you're not satisfied, we'll make it right.",
    },
  ]

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

          {/* Left — company info */}
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

          {/* Right — map */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <MapPin size={18} style={{ color: "#065999" }} /> Our Location
            </h3>
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100" style={{ height: "380px" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3994.042952435717!2d76.03016567555798!3d22.966320918424515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396317c4317fe813%3A0x6ad9188d8f033095!2zTUVLQUwgRU5URVJQUklTRVPihKLvuI8!5e1!3m2!1sen!2sin!4v1774326786901!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
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

// ── Wave image from client ────────────────────────────────────────────────────
const WAVE_URL = "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/wave%20(1)-Photoroom.png"

// Original footer background — unchanged
const LOGO_BLUE = "#5fc7f4"

export default function Footer() {
  const allProducts = [
    { label: "Custom Apparel",                       to: "/category/16" },
    { label: "Custom Drinkware",                     to: "/category/17" },
    { label: "Stationery, Letterheads & Notebooks",  to: "/stationery" },
    { label: "Stamps and Ink",                       to: "/stationery" },
    { label: "Signs, Posters & Marketing Materials", to: "/category/42" },
    { label: "Corporate Gifts",                      to: "/corporate-giftings" },
    { label: "Custom Package Water Bottle",          to: "/drinkware" },
    { label: "Custom Bags",                          to: "/labels-stickers" },
    { label: "Labels & Stickers",                    to: "/labels-stickers" },
    { label: "Visiting Cards & ID Cards",            to: "/visiting-cards" },
  ]

  const customerSupport = [
    { label: "Privacy Policy",           to: "/privacy-policy" },
    { label: "Contact Us",               to: "/contact" },
  ]

  const companyInfo = [
    { label: "About Us",          to: "/about" },
    { label: "Working with Mekal",to: "/about" },
    { label: "Privacy Policy",    to: "/privacy-policy" },
  ]

  const socials = [
    { icon: <Instagram size={16} />, href: "https://www.instagram.com/mekal.in?igsh=bDVvdXNiaW02Nzlh", label: "Instagram" },
    { icon: <Facebook  size={16} />, href: "https://www.facebook.com/p/Mekal-Enterprises-100067034525784/", label: "Facebook" },
    { icon: <Twitter   size={16} />, href: "#", label: "X / Twitter" },
    { icon: <Youtube   size={16} />, href: "https://www.youtube.com/@MekalEnterprises", label: "YouTube"     },
    { icon: <Linkedin  size={16} />, href: "https://www.linkedin.com/company/mekal-enterprises/", label: "LinkedIn"    },
    {
      icon: <img src="https://img.logokit.com/indiamart.com" alt="IndiaMart" style={{ width: 20, height: 20, objectFit: "contain" }} />,
      href: "https://www.indiamart.com/mekal-enterprises/photos.html",
      label: "IndiaMart",
    },
    {
      icon: <img src="https://img.logokit.com/justdial.com" alt="JustDial" style={{ width: 20, height: 20, objectFit: "contain" }} />,
      href: "https://www.justdial.com/Dewas/Mekal-Enterprises-Mekal-Enteerprises-Mishrilal-Nagar/9999P7272-7272-230421193507-M5G2_BZDET",
      label: "JustDial",
    },
  ]

  return (
    <>
      <LocationSection />

      {/* Footer background — original sky blue, unchanged */}
      <footer style={{ backgroundColor: "#5fc7f4" }} className="text-white relative">

      {/* ── Wave divider — fill matches new footer background ── */}
      <div className="w-full overflow-hidden leading-none -mt-1">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none"
          className="w-full h-10 md:h-16" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,0 L0,0 Z" fill="white" />
        </svg>
      </div>

      {/* ── Logo + waves + contact ── */}
      <div className="text-center py-8 border-b px-4" style={{ borderColor: "rgba(255,255,255,0.2)" }}>

        {/* Logo flanked by decorative waves */}
        <div className="flex items-center justify-center mb-4">
          <img
            src={WAVE_URL}
            alt=""
            className="h-24 md:h-28 lg:h-32 w-auto object-contain opacity-90 -mr-3"
          />
          <img
            src="/mekal_logo.png"
            alt="Mekal Enterprises"
            className="h-24 md:h-28 lg:h-32 w-auto object-contain relative z-10"
          />
          <img
            src={WAVE_URL}
            alt=""
            className="h-24 md:h-28 lg:h-32 w-auto object-contain opacity-90 -ml-3"
            style={{ transform: "scaleX(-1)" }}
          />
        </div>

        {/* ── Navy text: changed from text-white to navy (#1a5fa8) via inline style ── */}
        <p className="text-sm md:text-base font-medium max-w-2xl mx-auto mb-4 leading-relaxed"
           style={{ color: "#1a5fa8" }}>
          We are the best Gifting Solutions Company in India.&nbsp;
          We have a wide range of products for any budget provided to us.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm"
             style={{ color: "rgba(26,95,168,0.85)" }}>
          <a href="tel:+919131387559"
            className="flex items-center gap-2 transition-colors"
            style={{ color: "inherit" }}
            onMouseEnter={e => e.currentTarget.style.color = "#1a5fa8"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(26,95,168,0.85)"}>
            <Phone size={14} className="flex-shrink-0" />
            +91 9131387559
          </a>
          <span style={{ color: "rgba(26,95,168,0.4)" }} className="hidden sm:block">•</span>
          <a href="mailto:mekal.enterprises@gmail.com"
            className="flex items-center gap-2 transition-colors"
            style={{ color: "inherit" }}
            onMouseEnter={e => e.currentTarget.style.color = "#1a5fa8"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(26,95,168,0.85)"}>
            <Mail size={14} className="flex-shrink-0" />
            mekal.enterprises@gmail.com
          </a>
        </div>
      </div>

      {/* ── Three-column links + socials ── */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">

          {/* All Products */}
          <div>
            <h4 className="font-semibold mb-5 text-xs uppercase tracking-widest"
                style={{ color: "#1a5fa8" }}>
              All Products
            </h4>
            <ul className="space-y-2.5 text-sm" style={{ color: "rgba(26,95,168,0.85)" }}>
              {allProducts.map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="transition-colors hover:opacity-100"
                        style={{ color: "inherit" }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="font-semibold mb-5 text-xs uppercase tracking-widest"
                style={{ color: "#1a5fa8" }}>
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-sm" style={{ color: "rgba(26,95,168,0.85)" }}>
              {customerSupport.map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="transition-colors"
                        style={{ color: "inherit" }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Info + Socials */}
          <div>
            <h4 className="font-semibold mb-5 text-xs uppercase tracking-widest"
                style={{ color: "#1a5fa8" }}>
              Company Info
            </h4>
            <ul className="space-y-2.5 text-sm mb-8" style={{ color: "rgba(26,95,168,0.85)" }}>
              {companyInfo.map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="transition-colors"
                        style={{ color: "inherit" }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social icons */}
            <div className="flex flex-wrap gap-3 mt-2">
              {socials.map(s => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                  style={{
                    border: "1px solid rgba(26,95,168,0.4)",
                    color: "#1a5fa8",
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(26,95,168,0.15)"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t text-center text-xs py-4 px-4"
           style={{ borderColor: "rgba(26,95,168,0.25)", color: "rgba(26,95,168,0.6)" }}>
        © {new Date().getFullYear()} Mekal Enterprises. All rights reserved.
      </div>

    </footer>
    </>
  )
}