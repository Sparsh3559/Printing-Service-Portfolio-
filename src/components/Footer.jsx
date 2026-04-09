import { Link } from "react-router-dom"
import { Phone, Mail, Instagram, Facebook, Linkedin, Youtube, Twitter, MapPin } from "lucide-react"

const WAVE_URL = "https://mzkizexagitatacuwwxj.supabase.co/storage/v1/object/public/products/products/wave%20(1)-Photoroom.png"

function LocationSection() {
  const valueProps = [
    { title: "Even Low Quantities @ Best Prices",    desc: "We offer low / single product quantities at affordable prices." },
    { title: "High Quality Products and Easy Design", desc: "Our wide selection of high-quality products and online design tools make it easy for you to customize and order your favourite products." },
    { title: "Free Replacement or Full Refund",       desc: "We stand by everything we sell. So if you're not satisfied, we'll make it right." },
  ]
  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">Mekal Enterprises: The Leader in Customisation</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-8">
              For more than 10 years, Mekal Enterprises has helped business owners, entrepreneurs and individuals create their identities with custom designs and professional marketing. Our online printing services are intended to help you find high-quality customised products you need – visiting cards, personalized clothing, gifting products, and much more.
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
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" title="Mekal Enterprises Location" />
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
    { label: "Custom Apparel",                       to: "/apparels" },
    { label: "Custom Drinkware",                     to: "/drinkware" },
    { label: "Stationery, Letterheads & Notebooks",  to: "/stationery" },
    { label: "Stamps and Ink",                       to: "/stationery" },
    { label: "Signs, Posters & Marketing Materials", to: "/" },
    { label: "Corporate Gifts",                      to: "/corporate-giftings" },
    { label: "Custom Package Water Bottle",          to: "/drinkware" },
    { label: "Custom Bags",                          to: "/labels-stickers" },
    { label: "Labels & Stickers",                    to: "/labels-stickers" },
    { label: "Visiting Cards & ID Cards",            to: "/visiting-cards" },
  ]
  const customerSupport = [
    { label: "Help Desk",                to: "/help" },
    { label: "Privacy Policy",           to: "/privacy-policy" },
    { label: "Return & Shipping Policy", to: "/shipping-policy" },
    { label: "Terms & Conditions",       to: "/terms" },
    { label: "Payment",                  to: "/payment" },
    { label: "Contact Us",               to: "/contact" },
    { label: "FAQs",                     to: "/faqs" },
  ]
  const companyInfo = [
    { label: "About Us",          to: "/about" },
    { label: "Working with Mekal",to: "/about" },
    { label: "Privacy Policy",    to: "/privacy-policy" },
  ]
  const socials = [
    { icon: <Instagram size={15} />, href: "https://www.instagram.com/mekal.in?igsh=bDVvdXNiaW02Nzlh", label: "Instagram" },
    { icon: <Facebook  size={15} />, href: "https://www.facebook.com/p/Mekal-Enterprises-100067034525784/", label: "Facebook" },
    { icon: <Youtube   size={15} />, href: "#", label: "YouTube" },
    { icon: <Linkedin  size={15} />, href: "https://www.linkedin.com/company/mekal-enterprises/", label: "LinkedIn" },
    { icon: <span className="text-[9px] font-bold">IM</span>, href: "https://www.indiamart.com/mekal-enterprises/photos.html", label: "IndiaMart" },
    { icon: <span className="text-[9px] font-bold">JD</span>, href: "https://www.justdial.com/Dewas/Mekal-Enterprises-Mekal-Enteerprises-Mishrilal-Nagar/9999P7272-7272-230421193507-M5G2_BZDET", label: "JustDial" },
  ]

  return (
    <>
      <LocationSection />

      <footer style={{ backgroundColor: "#5fc7f4" }} className="text-white relative overflow-hidden">

        {/* White wave divider from page */}
        <div className="w-full overflow-hidden leading-none -mt-1">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-10 md:h-14" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,0 L0,0 Z" fill="white" />
          </svg>
        </div>

        {/* ── Logo emerging from connected wave ── */}
        <div className="relative flex flex-col items-center pt-2 pb-6 px-4 border-b border-white/20">

          {/*
            WAVE DESIGN:
            Left wave image + right wave image (mirrored) sit side by side
            They overlap in the centre to form one continuous wave.
            The logo sits ABOVE on top of them, appearing to emerge from the wave.
            Both waves are faded (opacity) to feel like water/river behind the logo.
          */}
          <div className="relative flex items-end justify-center w-full max-w-md mx-auto mb-3">
            {/* Left wave — faded */}
            <img src={WAVE_URL} alt=""
              className="flex-shrink-0 object-contain select-none pointer-events-none"
              style={{ height: "clamp(60px, 14vw, 100px)", width: "auto", opacity: 0.45, marginRight: "-8%" }} />

            {/* Logo — sits above waves, bigger and bold */}
            <div className="relative z-10 flex-shrink-0 flex flex-col items-center" style={{ marginBottom: "4px" }}>
              <img src="/mekal_logo.png" alt="Mekal Enterprises"
                className="object-contain"
                style={{ height: "clamp(72px, 16vw, 120px)", width: "auto", filter: "drop-shadow(0 4px 12px rgba(6,89,153,0.25))" }} />
            </div>

            {/* Right wave — faded + mirrored */}
            <img src={WAVE_URL} alt=""
              className="flex-shrink-0 object-contain select-none pointer-events-none"
              style={{ height: "clamp(60px, 14vw, 100px)", width: "auto", opacity: 0.45, marginLeft: "-8%", transform: "scaleX(-1)" }} />
          </div>

          {/* Brand name */}
          <h2 className="font-bold tracking-wider text-center leading-none mb-0.5"
            style={{ color: "#065999", fontSize: "clamp(16px, 4vw, 26px)", fontFamily: "'Plus Jakarta Sans', Georgia, serif", letterSpacing: "0.06em" }}>
            Mekal Enterprises<sup className="text-[10px] ml-0.5 align-super">™</sup>
          </h2>

          {/* Tagline */}
          <p className="text-[10px] uppercase tracking-[0.2em] font-medium mb-4" style={{ color: "#065999aa" }}>
            Custom Printing Solutions
          </p>

          <p className="text-sm text-white/80 font-medium max-w-xl mx-auto mb-4 leading-relaxed text-center">
            We are the best Gifting Solutions Company in India.&nbsp;
            We have a wide range of products for any budget provided to us.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm text-white/80">
            <a href="tel:+919131387559" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone size={13} className="flex-shrink-0" /> +91 9131387559
            </a>
            <span className="hidden sm:block text-white/30">•</span>
            <a href="mailto:mekal.enterprises@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail size={13} className="flex-shrink-0" /> mekal.enterprises@gmail.com
            </a>
          </div>
        </div>

        {/* Three-column links */}
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            <div>
              <h4 className="text-white font-semibold mb-5 text-xs uppercase tracking-widest">All Products</h4>
              <ul className="space-y-2.5 text-sm text-white/75">
                {allProducts.map(item => (
                  <li key={item.label}><Link to={item.to} className="hover:text-white transition-colors">{item.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-5 text-xs uppercase tracking-widest">Customer Support</h4>
              <ul className="space-y-2.5 text-sm text-white/75">
                {customerSupport.map(item => (
                  <li key={item.label}><Link to={item.to} className="hover:text-white transition-colors">{item.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-5 text-xs uppercase tracking-widest">Company Info</h4>
              <ul className="space-y-2.5 text-sm text-white/75 mb-8">
                {companyInfo.map(item => (
                  <li key={item.label}><Link to={item.to} className="hover:text-white transition-colors">{item.label}</Link></li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                {socials.map(s => (
                  <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noreferrer"
                    className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/20 transition-colors text-white">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 text-center text-xs text-white/50 py-4 px-4">
          © {new Date().getFullYear()} Mekal Enterprises™. All rights reserved.
        </div>
      </footer>
    </>
  )
}