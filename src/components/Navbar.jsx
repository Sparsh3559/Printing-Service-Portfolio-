import { Link } from "react-router-dom"
import { Phone, Mail, Instagram, Facebook, Linkedin, Youtube, Twitter } from "lucide-react"

/* ─── Location Section ─────────────────────────────────────────────────────── */
function LocationSection() {
  const valueProps = [
    {
      title: "Even Low Quantities @ Best Prices",
      desc: "We offer low / single product quantities at affordable prices.",
    },
    {
      title: "High Quality Products and Easy Design",
      desc: "Our wide selection of high-quality products and online design tools make it easy for you to customize and order your favourite products.",
    },
    {
      title: "Free Replacement or Full Refund",
      desc: "We stand by everything we sell. So if you're not satisfied, we'll make it right.",
    },
  ]

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

          {/* ── Left: Company text ── */}
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

            {/* Value propositions */}
            <div className="space-y-5">
              {valueProps.map(vp => (
                <div key={vp.title}>
                  <h3 className="font-bold text-gray-800 text-sm md:text-base mb-1">{vp.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{vp.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Map ── */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Location</h3>
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100" style={{ height: "380px" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3994.042952435717!2d76.03016567555798!3d22.966320918424515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396317c4317fe813%3A0x6ad9188d8f033095!2zTUVLQUwgRU5URVJQUklTRVPihKLvuI8!5e1!3m2!1sen!2sin!4v1774326786901!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mekal Enterprises Location – Indore"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

/* ─── Footer ────────────────────────────────────────────────────────────────── */
export default function Footer() {
  const allProducts = [
    "Custom Apparel",
    "Custom Drinkware",
    "Stationery, Letterheads & Notebooks",
    "Stamps and Ink",
    "Signs, Posters & Marketing Materials",
    "Corporate Gifts",
    "Custom Package Water Bottle",
    "Custom Bags",
    "Machine",
    "Blank Products",
  ]

  const customerSupport = [
    { label: "Help Desk",                to: "/" },
    { label: "Privacy Policy",           to: "/" },
    { label: "Return & Shipping Policy", to: "/" },
    { label: "Terms & Conditions",       to: "/" },
    { label: "Payment",                  to: "/" },
    { label: "Contact Us",               to: "/" },
    { label: "FAQs",                     to: "/" },
  ]

  const companyInfo = [
    { label: "About Us",               to: "/" },
    { label: "Working with Printstop", to: "/" },
    { label: "Mekal Blog",             to: "/" },
    { label: "Privacy Policy",         to: "/" },
  ]

  const socials = [
    { icon: <Instagram size={16} />, href: "#", label: "Instagram"   },
    { icon: <Facebook  size={16} />, href: "#", label: "Facebook"    },
    { icon: <Twitter   size={16} />, href: "#", label: "X / Twitter" },
    { icon: <Youtube   size={16} />, href: "#", label: "YouTube"     },
    { icon: <Linkedin  size={16} />, href: "#", label: "LinkedIn"    },
  ]

  return (
    <>
      <LocationSection />

      <footer style={{ backgroundColor: "#5fc7f4" }} className="text-white relative">

        {/* ── Wave divider ── */}
        <div className="w-full overflow-hidden leading-none -mt-1">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none"
            className="w-full h-10 md:h-16" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,0 L0,0 Z" fill="white" />
          </svg>
        </div>

        {/* ── Logo + tagline + contact bar ── */}
        <div className="text-center py-8 border-b border-white/20 px-4">
          <img
            src="/mekal_logo.png"
            alt="Mekal Enterprises"
            className="h-20 md:h-24 w-auto object-contain mx-auto mb-4"
          />
          <p className="text-sm md:text-base text-white font-medium max-w-2xl mx-auto mb-4 leading-relaxed">
            We are the best Gifting Solutions Company in India.&nbsp;
            We have a wide range of products for any budget provided to us.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm text-white/80">
            <a href="tel:+919999999999"
              className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone size={14} className="flex-shrink-0" />
              +91 99999 99999&nbsp;&nbsp;|&nbsp;&nbsp;+91 99999 99999
            </a>
            <span className="hidden sm:block text-white/30">•</span>
            <a href="mailto:mekal.enterprises@gmail.com"
              className="flex items-center gap-2 hover:text-white transition-colors">
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
              <h4 className="text-white font-semibold mb-5 text-xs uppercase tracking-widest">
                All Products
              </h4>
              <ul className="space-y-2.5 text-sm text-white/75">
                {allProducts.map(item => (
                  <li key={item}>
                    <span className="hover:text-white cursor-pointer transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Support */}
            <div>
              <h4 className="text-white font-semibold mb-5 text-xs uppercase tracking-widest">
                Customer Support
              </h4>
              <ul className="space-y-2.5 text-sm text-white/75">
                {customerSupport.map(item => (
                  <li key={item.label}>
                    <Link to={item.to} className="hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Info + Socials */}
            <div>
              <h4 className="text-white font-semibold mb-5 text-xs uppercase tracking-widest">
                Company Info
              </h4>
              <ul className="space-y-2.5 text-sm text-white/75 mb-8">
                {companyInfo.map(item => (
                  <li key={item.label}>
                    <Link to={item.to} className="hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Social icons */}
              <div className="flex flex-wrap gap-3 mt-2">
                {socials.map(s => (
                  <a key={s.label} href={s.href} aria-label={s.label}
                    className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/20 transition-colors">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/20 text-center text-xs text-white/50 py-4 px-4">
          © {new Date().getFullYear()} Mekal Enterprises. All rights reserved.
        </div>

      </footer>
    </>
  )
}