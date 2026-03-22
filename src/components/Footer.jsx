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

          {/* Left: Company text */}
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

          {/* Right: Map — searching for Mekal Enterprises, Indore directly */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Location</h3>
            <div
              className="rounded-2xl overflow-hidden shadow-xl border border-gray-100"
              style={{ height: "380px" }}
            >
              <iframe
                src="https://www.google.com/maps/embed/v1/search?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=Mekal+Enterprises+Indore+Madhya+Pradesh"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mekal Enterprises Location"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Replace the map embed with your exact Google Maps share link for a precise pin.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}

/* ─── Footer ────────────────────────────────────────────────────────────────── */
export default function Footer() {
  const navy      = "#0a3d6b"
  const navyMid   = "#1a5276"
  const navyLight = "#2e6fa3"

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
    { icon: <Instagram size={17} />, href: "#", label: "Instagram"   },
    { icon: <Facebook  size={17} />, href: "#", label: "Facebook"    },
    { icon: <Twitter   size={17} />, href: "#", label: "X / Twitter" },
    { icon: <Youtube   size={17} />, href: "#", label: "YouTube"     },
    { icon: <Linkedin  size={17} />, href: "#", label: "LinkedIn"    },
  ]

  return (
    <>
      <LocationSection />

      <footer style={{ backgroundColor: "#5fc7f4" }} className="relative">

        {/* ══════════════════════════════════════════════════════
            LOGO HERO — actual wave.png split left + mirrored right
            ══════════════════════════════════════════════════════ */}
        <div
          className="relative overflow-hidden bg-white"
          style={{ minHeight: "260px" }}
        >
          {/* LEFT wave — original */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              width: "50%",
              backgroundImage: "url('/wave.png')",
              backgroundSize: "200% 100%",   /* show only left half of image */
              backgroundPosition: "left center",
              backgroundRepeat: "no-repeat",
            }}
          />

          {/* RIGHT wave — horizontally mirrored */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              left: "50%",
              width: "50%",
              backgroundImage: "url('/wave.png')",
              backgroundSize: "200% 100%",   /* show only left half of image, then flip it */
              backgroundPosition: "left center",
              backgroundRepeat: "no-repeat",
              transform: "scaleX(-1)",
              transformOrigin: "left center",
            }}
          />

          {/* Logo + tagline + contact — sits above wave layers */}
          <div className="relative z-10 text-center py-12 md:py-16 px-4">
            <img
              src="/mekal_logo.png"
              alt="Mekal Enterprises"
              className="mx-auto mb-6 w-auto object-contain drop-shadow-sm"
              style={{ height: "clamp(90px, 13vw, 150px)" }}
            />
            <p
              className="font-semibold text-sm md:text-base max-w-2xl mx-auto mb-5 leading-relaxed"
              style={{ color: navy }}
            >
              We are the best Gifting Solutions Company in India.&nbsp;
              We have a wide range of products for any budget provided to us.
            </p>
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-sm font-medium"
              style={{ color: navyMid }}
            >
              <a
                href="tel:+919999999999"
                className="flex items-center gap-2 transition-opacity hover:opacity-60"
              >
                <Phone size={14} className="flex-shrink-0" />
                +91 99999 99999&nbsp;|&nbsp;+91 99999 99999
              </a>
              <span className="hidden sm:block opacity-40" style={{ color: navy }}>•</span>
              <a
                href="mailto:mekal.enterprises@gmail.com"
                className="flex items-center gap-2 transition-opacity hover:opacity-60"
              >
                <Mail size={14} className="flex-shrink-0" />
                mekal.enterprises@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Wave transition: white → #5fc7f4 */}
        <div className="w-full overflow-hidden leading-none -mt-px">
          <svg
            viewBox="0 0 1440 70"
            preserveAspectRatio="none"
            className="w-full h-10 md:h-16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,35 C240,70 480,0 720,35 C960,70 1200,0 1440,35 L1440,0 L0,0 Z"
              fill="white"
            />
          </svg>
        </div>

        {/* ══════════════════════════════════════════
            THREE-COLUMN LINKS
            ══════════════════════════════════════════ */}
        <div className="max-w-7xl mx-auto px-5 md:px-10 pt-4 pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">

            {/* All Products */}
            <div>
              <h4
                className="font-bold mb-5 text-xs uppercase tracking-widest"
                style={{ color: navy }}
              >
                All Products
              </h4>
              <ul className="space-y-2.5 text-sm" style={{ color: navyMid }}>
                {allProducts.map(item => (
                  <li key={item}>
                    <span className="cursor-pointer transition-opacity hover:opacity-60">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Support */}
            <div>
              <h4
                className="font-bold mb-5 text-xs uppercase tracking-widest"
                style={{ color: navy }}
              >
                Customer Support
              </h4>
              <ul className="space-y-2.5 text-sm" style={{ color: navyMid }}>
                {customerSupport.map(item => (
                  <li key={item.label}>
                    <Link to={item.to} className="transition-opacity hover:opacity-60">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Info + Socials */}
            <div>
              <h4
                className="font-bold mb-5 text-xs uppercase tracking-widest"
                style={{ color: navy }}
              >
                Company Info
              </h4>
              <ul className="space-y-2.5 text-sm mb-8" style={{ color: navyMid }}>
                {companyInfo.map(item => (
                  <li key={item.label}>
                    <Link to={item.to} className="transition-opacity hover:opacity-60">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3">
                {socials.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-white/30"
                    style={{ border: `1.5px solid ${navyLight}`, color: navy }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="border-t text-center text-xs py-4 px-4"
          style={{ borderColor: `${navy}30`, color: navyLight }}
        >
          © {new Date().getFullYear()} Mekal Enterprises. All rights reserved.
        </div>

      </footer>
    </>
  )
}