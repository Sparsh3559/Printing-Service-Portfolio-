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
    { label: "Custom Apparel",                       to: "/category/16" },
    { label: "Custom Drinkware",                     to: "/category/17" },
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
    { label: "About Us",           to: "/about" },
    { label: "Working with Mekal", to: "/working-with-mekal" },
  ]

  const socials = [
    { icon: <Instagram size={16} />, href: "https://www.instagram.com/mekal.in?igsh=bDVvdXNiaW02Nzlh", label: "Instagram" },
    { icon: <Facebook  size={16} />, href: "https://www.facebook.com/p/Mekal-Enterprises-100067034525784/", label: "Facebook" },
    { icon: <Youtube   size={16} />, href: "https://www.youtube.com/@MekalEnterprises", label: "YouTube" },
    { icon: <Linkedin  size={16} />, href: "https://www.linkedin.com/company/mekal-enterprises/", label: "LinkedIn" },
    {
      icon: <img src="data:image/png;base64,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" alt="IndiaMart" style={{ width: 20, height: 20, objectFit: "contain" }} />,
      href: "https://www.indiamart.com/mekal-enterprises/photos.html",
      label: "IndiaMart",
    },
    {
      icon: <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAADLElEQVR42u2VT2hcRRzHP7+Z9/Zv0nSTVkoRtaQeqqXWlDYVarDYnhp6KPYiRVKQFtSD4MGr9KIXvetV8GYJioJCBUFD0dooqC2WGNLSlN26JMtu3759+2Z+Ht4m3WrRgkoP7heGefP7zW++M7+Z3/cJoNwHGO4TBsQD4gHxf0QsAnIPezEGkDtMVsBI1v8RsuY3BhFZt2n2IWhPxOSv5EwE9G5e+RsRvNMf3F4MhrftIRgepfHjF6CKqu/LgGSx3vHA5HM0fjpH0lrBiFAKLSd3j3C16QlwnL3cxIiuU41X8hx+pMDi1mdYqd9kbm6ul2oxKIp57DC5/SdQ71D1WTLV95oD7yhueojw0GtUJqZRApwKiuXMPs/MDsuR7Tm8CqkXul5IPewaE96Zsvx24zrVWg2RtRP34LoJ2m6xefI4jSvn8VGDyr5jxFe+pjBxjNzQRgqVrax0Inj8KAdXv+XV8SViLRMlET/Xy1xeTXmwUuDtqZBOalloGQp0qbWV+YsXSDx9xCKIsVlvA8xTM1BfJrA3CCdPMrR7mtgbOgvniX75Ct3zPEPz7/PB3l/5rpHHJB02hilHtoccFeWVJ8q4tMV8NeCN/Z7PF3J4VYbKZVZaEaAYQcClqHeYbowD0riJtpv4uIVLmtS/+RDXqmGCgHjpeyIfsHPUM1pQps+mHP+oQyMt0Ox6xvLCk5uVFz6Dl85FXKoaxIDH4L1Dew8zAGV42wThpodhy6NIEmOLo5TGJ5HV60hpA7nAklycJTz4MiPFEW5Zx9UoxDvlzIE8qLClFFN3hrZTbnaU1/daLtSG2FFJqMY5hnOslxJAoIDkyhQOvIimXZqfvoktbqA4dRpjhPjL97D5EvmnT6Gry0TzsxR3TXNp8RozVeGtZ2Gp4ZldzLF0y+F8l08WUt49ZNk5Jnx8rcgPNVhuB3QSl7FqdquqKIEJEGNJ0w4KGBNirMF1OwhgwhL4lNQlWALA4xAEg+J6WuT7xsGf6lrwKL6vqvtFYa1utTdBbBaurjc26/dkBZxm4aKgPT0w/XbWDpn57iJSt6fci/L8U/y7qw1+iwPiAfH/ivh3Xyte7XkJ3FYAAAAASUVORK5CYII=" alt="JustDial" style={{ width: 26, height: 16, objectFit: "contain" }} />,
      href: "https://www.justdial.com/Dewas/Mekal-Enterprises-Mekal-Enteerprises-Mishrilal-Nagar/9999P7272-7272-230421193507-M5G2_BZDET",
      label: "JustDial",
    },
  ]

  return (
    <>
      <LocationSection />

      <footer style={{ backgroundColor: "#5fc7f4" }} className="text-white relative overflow-hidden">

        {/* ── Wave SVG divider from white to footer ── */}
        <div className="w-full overflow-hidden leading-none -mt-1">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none"
            className="w-full h-10 md:h-16" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,0 L0,0 Z" fill="white" />
          </svg>
        </div>

        {/* ── Full-width wave banner: two images side by side, no gap, logo centred above ── */}
        <div className="relative w-full border-b border-white/20 pb-6">

          {/* Two wave images joined full-width — zero gap */}
          <div className="flex w-full" style={{ height: "clamp(80px, 16vw, 130px)" }}>
            <img
              src={WAVE_URL}
              alt=""
              className="flex-1 object-fill"
              style={{ minWidth: 0 }}
            />
            <img
              src={WAVE_URL}
              alt=""
              className="flex-1 object-fill"
              style={{ minWidth: 0, transform: "scaleX(-1)" }}
            />
          </div>

          {/* Logo centred — sits on top of the wave images */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
            <img
              src="/mekal_logo.png"
              alt="Mekal Enterprises"
              className="object-contain drop-shadow-lg"
              style={{ height: "clamp(52px, 10vw, 90px)", width: "auto" }}
            />
            <span
              className="font-bold tracking-widest uppercase"
              style={{
                color:         "#0a2a5e",
                fontSize:      "clamp(9px, 1.4vw, 13px)",
                letterSpacing: "0.22em",
              }}>
              Mekal Enterprises
            </span>
          </div>

          {/* Contact info */}
          <div className="text-center px-4 mt-4">
            <p className="text-sm md:text-base font-medium max-w-2xl mx-auto mb-4 leading-relaxed" style={{ color: "#0a2a5e" }}>
              We are the best Gifting Solutions Company in India.&nbsp;
              We have a wide range of products for any budget provided to us.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm" style={{ color: "#0a2a5e" }}>
              <a href="tel:+919131387559" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                <Phone size={14} className="flex-shrink-0" />
                +91 9131387559
              </a>
              <span className="hidden sm:block opacity-30">•</span>
              <a href="mailto:mekal.enterprises@gmail.com" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                <Mail size={14} className="flex-shrink-0" />
                mekal.enterprises@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* ── Three-column links ── */}
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">

            <div>
              <h4 className="font-semibold mb-5 text-xs uppercase tracking-widest" style={{ color: "#0a2a5e" }}>All Products</h4>
              <ul className="space-y-2.5 text-sm" style={{ color: "#0a2a5e" }}>
                {allProducts.map(item => (
                  <li key={item.label}>
                    <Link to={item.to} className="hover:opacity-60 transition-opacity">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-5 text-xs uppercase tracking-widest" style={{ color: "#0a2a5e" }}>Customer Support</h4>
              <ul className="space-y-2.5 text-sm" style={{ color: "#0a2a5e" }}>
                {customerSupport.map(item => (
                  <li key={item.label}>
                    <Link to={item.to} className="hover:opacity-60 transition-opacity">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-5 text-xs uppercase tracking-widest" style={{ color: "#0a2a5e" }}>Company Info</h4>
              <ul className="space-y-2.5 text-sm mb-8" style={{ color: "#0a2a5e" }}>
                {companyInfo.map(item => (
                  <li key={item.label}>
                    <Link to={item.to} className="hover:opacity-60 transition-opacity">{item.label}</Link>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3 mt-2">
                {socials.map(s => (
                  <a key={s.label} href={s.href} aria-label={s.label}
                    target="_blank" rel="noreferrer"
                    className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-white/20 transition-colors"
                    style={{ borderColor: "rgba(10,42,94,0.4)", color: "#0a2a5e" }}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/20 text-center text-xs py-4 px-4" style={{ color: "#0a2a5e", opacity: 0.7 }}>
          © {new Date().getFullYear()} Mekal Enterprises. All rights reserved.
        </div>

      </footer>
    </>
  )
}