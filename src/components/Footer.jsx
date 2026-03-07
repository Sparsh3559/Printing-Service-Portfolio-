import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin } from "lucide-react"


export default function Footer() {
  const whatsappNumber = "919999999999" // replace with real number

  return (
    <footer style={{ backgroundColor: "#5fc7f4" }} className="text-white relative">

      {/* ── Wave top edge ── */}
      <div className="w-full overflow-hidden leading-none -mt-1">
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="w-full h-16 md:h-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,0 L0,0 Z"
            fill="white"
          />
        </svg>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-6 pb-12 pt-4 grid gap-12 md:grid-cols-4">

        {/* Brand */}
        <div>
          <img
            src="/mekal_logo.png"
            alt="Mekal Enterprises"
            className="h-16 w-auto object-contain mb-4"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <p className="text-sm leading-relaxed text-white/70">
            Premium custom printing solutions for businesses, events, and personal needs.
          </p>
          {/* Social icons placeholder */}
          <div className="flex gap-3 mt-5">
            {["in", "fb", "ig"].map((s) => (
              <div
                key={s}
                className="w-8 h-8 rounded-full border border-[#065999]/30 flex items-center justify-center text-[10px] font-bold text-[#065999]/70 hover:border-[#065999] hover:text-[#065999] cursor-pointer transition-colors"
              >
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest">
            Services
          </h4>
          <ul className="space-y-2.5 text-sm text-white/70">
            {["Custom Apparel", "Drinkware", "Corporate Gifting", "Merchandise", "Caps & Badges", "ID Cards"].map((s) => (
              <li key={s} className="hover:text-white cursor-pointer transition-colors">{s}</li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-sm text-white/70">
            {[
              { label: "Home", to: "/" },
              { label: "Services", to: "/" },
              { label: "About", to: "/" },
              { label: "Contact", to: "/" },
            ].map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest">
            Contact
          </h4>
          <div className="space-y-3 text-sm text-white/70">
            <p className="flex items-center gap-2.5">
              <Phone size={15} className="flex-shrink-0 text-white/50" />
              +91 99999 99999
            </p>
            <p className="flex items-center gap-2.5">
              <Mail size={15} className="flex-shrink-0 text-white/50" />
              info@printhub.com
            </p>
            <p className="flex items-center gap-2.5">
              <MapPin size={15} className="flex-shrink-0 text-white/50" />
              Indore, India
            </p>
          </div>

          <Button
            className="mt-6 w-full rounded-full bg-green-400 hover:bg-green-300 text-green-950 font-semibold text-sm"
            onClick={() => window.open(`https://wa.me/${whatsappNumber}`, "_blank")}
          >
            Chat on WhatsApp
          </Button>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-[#065999]/15 text-center text-xs text-[#065999]/60 py-5">
        © {new Date().getFullYear()} Print Hub. All rights reserved.
      </div>
    </footer>
  )
}