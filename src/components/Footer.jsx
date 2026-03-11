import { Link } from "react-router-dom"
import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin } from "lucide-react"


export default function Footer() {
  const whatsappNumber = "919999999999"

  return (
    <footer style={{ backgroundColor: "#5fc7f4" }} className="text-white relative">

      {/* Wave top edge */}
      <div className="w-full overflow-hidden leading-none -mt-1">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none"
          className="w-full h-10 md:h-16" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,0 L0,0 Z" fill="white" />
        </svg>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-5 md:px-6 pb-8 md:pb-12 pt-2 md:pt-4">

        {/* Mobile: 2-col grid | Desktop: 4-col grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">

          {/* Brand — full width on mobile */}
          <div className="col-span-2 md:col-span-1">
            <img src="/mekal_logo.png" alt="Mekal Enterprises"
              className="h-12 md:h-16 w-auto object-contain mb-3 md:mb-4"
              style={{ filter: "brightness(0) invert(1)" }} />
            <p className="text-sm leading-relaxed text-white/70 mb-4 max-w-xs">
              Premium custom printing solutions for businesses, events, and personal needs.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Instagram size={15} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Facebook size={15} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Linkedin size={15} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">Services</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              {["Custom Apparel", "Drinkware", "Visiting Cards", "Corporate Gifting", "Stationery", "Labels & Bags"].map(s => (
                <li key={s} className="hover:text-white cursor-pointer transition-colors">{s}</li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              {[
                { label: "Home",               to: "/" },
                { label: "Corporate Gifting",  to: "/corporate-giftings" },
                { label: "Women's Gifting",    to: "/womens-gifting" },
                { label: "Contact Us",         to: "/" },
              ].map(l => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">Contact</h4>
            <div className="space-y-3 text-sm text-white/70 mb-5">
              <a href="tel:+919999999999" className="flex items-center gap-2.5 hover:text-white transition-colors">
                <Phone size={14} className="flex-shrink-0" />
                +91 99999 99999
              </a>
              <a href="mailto:info@mekal.in" className="flex items-center gap-2.5 hover:text-white transition-colors">
                <Mail size={14} className="flex-shrink-0" />
                info@mekal.in
              </a>
              <p className="flex items-start gap-2.5">
                <MapPin size={14} className="flex-shrink-0 mt-0.5" />
                Indore, Madhya Pradesh, India
              </p>
            </div>
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-green-400 hover:bg-green-300 text-green-950 font-semibold text-sm py-2.5 transition-colors">
              💬 Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#065999]/15 text-center text-xs text-white/50 py-4 px-4">
        © {new Date().getFullYear()} Mekal Enterprises. All rights reserved.
      </div>
    </footer>
  )
}