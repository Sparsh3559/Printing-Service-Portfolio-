import { Link } from "react-router-dom"
import { Phone, Mail, MapPin, MessageCircle, Clock, Shield, Truck, FileText, CreditCard, HelpCircle, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import SideStrips from "../components/SideStrips"

const DARK  = "#065999"
const BRAND = "#5fc7f4"

// ── Shared page shell ─────────────────────────────────────────────────────────
function PageShell({ title, icon: Icon, children }) {
  return (
    <>
      <SideStrips />
      <Navbar />
      <div className="py-10 md:py-14 px-5 text-white text-center"
        style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${BRAND} 100%)` }}>
        {Icon && <Icon size={32} className="mx-auto mb-3 opacity-80" />}
        <h1 className="text-2xl md:text-4xl font-bold">{title}</h1>
      </div>
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-14">
        {children}
      </div>
      <Footer />
    </>
  )
}

// ── Reusable section heading ──────────────────────────────────────────────────
function SectionHeading({ children }) {
  return (
    <h2 className="text-lg md:text-xl font-bold mb-4 pb-2 border-b"
      style={{ color: DARK, borderColor: `${BRAND}50` }}>
      {children}
    </h2>
  )
}

// ── Info card ─────────────────────────────────────────────────────────────────
function InfoCard({ icon: Icon, label, value, href }) {
  const inner = (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ backgroundColor: `${BRAND}20`, color: DARK }}>
        <Icon size={16} />
      </div>
      <div>
        <p className="text-xs text-zinc-400 mb-0.5">{label}</p>
        <p className="text-sm font-semibold" style={{ color: DARK }}>{value}</p>
      </div>
    </div>
  )
  return href
    ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="block hover:opacity-80 transition-opacity">{inner}</a>
    : <div>{inner}</div>
}

// ── Help Desk ─────────────────────────────────────────────────────────────────
export function HelpDeskPage() {
  return (
    <PageShell title="Help Desk" icon={HelpCircle}>
      <p className="text-zinc-600 text-sm leading-relaxed mb-8">
        Need help with your order or customization? Our Help Desk ensures quick solutions for all your queries.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {["Order Tracking", "Custom Design Assistance", "Bulk Order Queries", "Complaint Resolution"].map(item => (
          <div key={item} className="rounded-2xl p-4 text-center text-sm font-medium"
            style={{ backgroundColor: `${BRAND}15`, color: DARK }}>
            {item}
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-6 mb-8 space-y-4" style={{ backgroundColor: `${DARK}08` }}>
        <SectionHeading>Contact Support</SectionHeading>
        <InfoCard icon={Phone}  label="Call / WhatsApp" value="+91 9131387559" href="tel:+919131387559" />
        <InfoCard icon={Mail}   label="Email"           value="mekalh2o@gmail.com" href="mailto:mekalh2o@gmail.com" />
        <InfoCard icon={Clock}  label="Support Hours"   value="10 AM – 8 PM (Monday to Saturday)" />
      </div>

      <div className="rounded-2xl p-5 text-sm text-center"
        style={{ backgroundColor: `${BRAND}15`, color: DARK }}>
        Contact us anytime — we'll resolve your issue as quickly as possible.
      </div>

      <div className="mt-8 flex flex-wrap gap-3 justify-center text-sm">
        {[
          { label: "FAQs",                    to: "/faqs" },
          { label: "Return & Shipping Policy",to: "/shipping-policy" },
          { label: "Terms & Conditions",      to: "/terms" },
          { label: "Privacy Policy",          to: "/privacy-policy" },
        ].map(l => (
          <Link key={l.label} to={l.to}
            className="px-4 py-2 rounded-full border text-sm font-medium transition-colors hover:text-white"
            style={{ borderColor: DARK, color: DARK }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = DARK; e.currentTarget.style.color = "#fff" }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = DARK }}>
            {l.label}
          </Link>
        ))}
      </div>
    </PageShell>
  )
}

// ── Privacy Policy ────────────────────────────────────────────────────────────
export function PrivacyPolicyPage() {
  return (
    <PageShell title="Privacy Policy" icon={Shield}>
      <p className="text-zinc-500 text-xs mb-8">Last updated: 2025</p>

      <p className="text-zinc-600 text-sm leading-relaxed mb-8">
        At Mekal Enterprises, we respect your privacy and are committed to ensuring your personal information remains safe and secure.
      </p>

      <div className="space-y-8">
        {[
          {
            heading: "Information We Collect",
            points: [
              "Basic details such as name, contact number and delivery address for order processing",
              "Email address for order confirmations and support communication",
              "Payment reference details for transaction verification (we do not store card details)",
            ],
          },
          {
            heading: "How We Use Your Information",
            points: [
              "To process and fulfil your orders",
              "To communicate order status and delivery updates",
              "To provide customer support",
              "Your data is never sold or shared with third parties for marketing",
            ],
          },
          {
            heading: "Data Security",
            points: [
              "Secure payment gateways are used for all transactions",
              "Our website uses HTTPS encryption to protect data in transit",
              "Access to personal data is strictly limited to authorised team members",
            ],
          },
          {
            heading: "Cookies",
            points: [
              "We use only essential cookies required for the website to function properly",
              "No advertising or tracking cookies are used",
            ],
          },
          {
            heading: "Your Rights",
            points: [
              "You may request access to or deletion of your personal data by contacting us",
              "For any privacy concerns, email: mekalh2o@gmail.com",
            ],
          },
        ].map(section => (
          <div key={section.heading}>
            <SectionHeading>{section.heading}</SectionHeading>
            <ul className="space-y-2">
              {section.points.map(p => (
                <li key={p} className="flex items-start gap-2 text-sm text-zinc-600">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: BRAND }} />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* GST & Trademark note */}
      <div className="mt-10 rounded-2xl p-5 border text-sm text-zinc-600 space-y-2"
        style={{ borderColor: `${BRAND}40`, backgroundColor: `${BRAND}08` }}>
        <p className="font-semibold" style={{ color: DARK }}>Legal Information</p>
        <p>Mekal Enterprises is a registered business entity operating under applicable Indian laws.</p>
        <p><span className="font-medium" style={{ color: DARK }}>GST Registration:</span> Registered under GST. GSTIN will be provided on invoice upon request.</p>
        <p><span className="font-medium" style={{ color: DARK }}>Trademark:</span> The Mekal Enterprises name and logo are proprietary marks. Unauthorised use is prohibited.</p>
      </div>
    </PageShell>
  )
}

// ── Return & Shipping Policy ──────────────────────────────────────────────────
export function ShippingPolicyPage() {
  return (
    <PageShell title="Return & Shipping Policy" icon={Truck}>
      <div className="space-y-10">

        <div>
          <SectionHeading>🚚 Shipping</SectionHeading>
          <ul className="space-y-3 text-sm text-zinc-600">
            {[
              "Orders are processed within 2–5 working days after design approval and payment confirmation",
              "Delivery time: 5–10 working days across India (metro cities may be faster)",
              "You will receive a tracking number via WhatsApp or email once dispatched",
              "We ship Pan India via trusted courier partners",
            ].map(p => (
              <li key={p} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: BRAND }} />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <SectionHeading>🔁 Returns & Replacements</SectionHeading>
          <ul className="space-y-3 text-sm text-zinc-600">
            {[
              "Customized products are non-returnable as they are made to your specifications",
              "Free replacement is available only for damaged or defective items",
              "The issue must be reported within 24 hours of delivery with photo evidence",
              "Replacement will be processed within 5–7 working days after verification",
            ].map(p => (
              <li key={p} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: BRAND }} />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl p-5 text-sm"
          style={{ backgroundColor: `${DARK}08`, color: DARK }}>
          <p className="font-semibold mb-1">Need help with a return?</p>
          <p className="text-zinc-600">Contact us within 24 hours of delivery at <a href="tel:+919131387559" className="font-semibold underline">+91 9131387559</a> or <a href="mailto:mekalh2o@gmail.com" className="font-semibold underline">mekalh2o@gmail.com</a></p>
        </div>
      </div>
    </PageShell>
  )
}

// ── Terms & Conditions ────────────────────────────────────────────────────────
export function TermsPage() {
  return (
    <PageShell title="Terms & Conditions" icon={FileText}>
      <p className="text-zinc-500 text-xs mb-8">Last updated: 2025</p>
      <p className="text-zinc-600 text-sm leading-relaxed mb-8">
        By using Mekal Enterprises' products and services, you agree to the following terms and conditions.
      </p>

      <div className="space-y-8">
        {[
          {
            heading: "Order Details",
            points: [
              "Provide accurate and complete order details at the time of placing the order",
              "Mekal Enterprises is not responsible for errors arising from incorrect information provided by the customer",
            ],
          },
          {
            heading: "Design Approval",
            points: [
              "A design proof will be shared before production begins",
              "Production starts only after written approval from the customer",
              "No changes can be made after design approval",
            ],
          },
          {
            heading: "Cancellation Policy",
            points: [
              "No cancellation is allowed once production has started",
              "Orders cancelled before production begins may be subject to a processing fee",
            ],
          },
          {
            heading: "Pricing",
            points: [
              "Prices may vary based on customization requirements, quantity and material",
              "All prices are exclusive of GST unless stated otherwise",
              "GST @ 18% applicable on all orders",
            ],
          },
          {
            heading: "Intellectual Property",
            points: [
              "By submitting a design or logo, you confirm that you own or have rights to use it",
              "Mekal Enterprises is not liable for copyright infringement arising from customer-supplied artwork",
              "The Mekal Enterprises brand name and logo are registered marks — unauthorised use is prohibited",
            ],
          },
          {
            heading: "Governing Law",
            points: [
              "These terms are governed by the laws of India",
              "Any disputes shall be subject to the jurisdiction of courts in Dewas, Madhya Pradesh",
            ],
          },
        ].map(section => (
          <div key={section.heading}>
            <SectionHeading>{section.heading}</SectionHeading>
            <ul className="space-y-2">
              {section.points.map(p => (
                <li key={p} className="flex items-start gap-2 text-sm text-zinc-600">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: BRAND }} />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </PageShell>
  )
}

// ── Payment ───────────────────────────────────────────────────────────────────
export function PaymentPage() {
  return (
    <PageShell title="Payment" icon={CreditCard}>
      <div className="space-y-8">

        <div>
          <SectionHeading>Accepted Payment Methods</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { method: "UPI", desc: "Google Pay, PhonePe, Paytm & all UPI apps" },
              { method: "Bank Transfer", desc: "NEFT / RTGS / IMPS to our business account" },
              { method: "Cash", desc: "Available for local orders in Dewas only" },
            ].map(item => (
              <div key={item.method} className="rounded-2xl p-4 border text-sm"
                style={{ borderColor: `${BRAND}40`, backgroundColor: `${BRAND}08` }}>
                <p className="font-bold mb-1" style={{ color: DARK }}>{item.method}</p>
                <p className="text-zinc-500 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionHeading>Payment Terms</SectionHeading>
          <ul className="space-y-3 text-sm text-zinc-600">
            {[
              "Full or partial advance payment is required for bulk and custom orders before production begins",
              "For standard orders, 100% advance is required",
              "Balance payment (if any) must be cleared before dispatch",
              "GST @ 18% applicable on all orders — GSTIN available on request for B2B invoices",
            ].map(p => (
              <li key={p} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: BRAND }} />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl p-5 border text-sm" style={{ borderColor: `${BRAND}40` }}>
          <p className="font-semibold mb-1" style={{ color: DARK }}>Payment Security</p>
          <p className="text-zinc-500 text-xs leading-relaxed">
            All digital transactions are processed through secure, RBI-approved payment gateways.
            We do not store card details. Payment confirmation is sent via WhatsApp or email within 30 minutes.
          </p>
        </div>
      </div>
    </PageShell>
  )
}

// ── Contact Us ────────────────────────────────────────────────────────────────
export function ContactPage() {
  return (
    <PageShell title="Contact Us" icon={Phone}>
      <p className="text-zinc-600 text-sm leading-relaxed mb-8">
        We'd love to hear from you. Reach out via any of the channels below.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <InfoCard icon={Phone}   label="Phone / WhatsApp" value="+91 9131387559"              href="tel:+919131387559" />
        <InfoCard icon={Mail}    label="Email"            value="mekal.enterprises@gmail.com" href="mailto:mekal.enterprises@gmail.com" />
        <InfoCard icon={MapPin}  label="Location"         value="Dewas, Madhya Pradesh, India" />
        <InfoCard icon={MessageCircle} label="Instagram"  value="@mekal.in" href="https://www.instagram.com/mekal.in" />
      </div>

      <a href="https://wa.me/919131387559"
        target="_blank" rel="noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-white font-semibold text-sm transition-opacity hover:opacity-90 mb-10"
        style={{ backgroundColor: "#25D366" }}>
        <MessageCircle size={18} /> Chat on WhatsApp
      </a>

      <div className="rounded-2xl overflow-hidden shadow-lg border border-zinc-100" style={{ height: "320px" }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3994.042952435717!2d76.03016567555798!3d22.966320918424515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396317c4317fe813%3A0x6ad9188d8f033095!2zTUVLQUwgRU5URVJQUklTRVPihKLvuI8!5e1!3m2!1sen!2sin!4v1774326786901!5m2!1sen!2sin"
          width="100%" height="100%" style={{ border: 0 }}
          allowFullScreen loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Mekal Enterprises Location"
        />
      </div>
    </PageShell>
  )
}

// ── About Us ─────────────────────────────────────────────────────────────────
export function AboutPage() {
  return (
    <PageShell title="About Us">
      <div className="space-y-6 text-sm text-zinc-600 leading-relaxed">
        <p>
          Founded over a decade ago in Dewas, Madhya Pradesh, <strong className="text-zinc-800">Mekal Enterprises</strong> has
          grown into one of the region's most trusted custom printing and gifting companies. We started with a simple goal —
          make high-quality, personalised products accessible to everyone, from individual buyers to large enterprises.
        </p>
        <p>
          Today we serve thousands of customers across India, offering everything from branded apparel and custom drinkware
          to visiting cards, stationery, banners, labels and corporate gifting solutions.
        </p>

        <SectionHeading>Our Mission</SectionHeading>
        <p>
          To empower businesses, entrepreneurs and individuals to express their identity through beautifully crafted,
          customised products — with no minimum order quantity and the fastest turnaround in the industry.
        </p>

        <SectionHeading>Why Choose Us</SectionHeading>
        <ul className="space-y-2">
          {[
            "Single quantity orders accepted — no bulk minimum",
            "Pan India delivery with fast turnaround (5–10 working days)",
            "Premium quality materials and printing technology",
            "Dedicated design support team",
            "Free replacement or full refund if not satisfied",
            "GST invoices available for B2B customers",
          ].map(p => (
            <li key={p} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: BRAND }} />
              {p}
            </li>
          ))}
        </ul>

        {/* GST + Trademark registration callout */}
        <div className="rounded-2xl p-5 border mt-8 text-sm"
          style={{ borderColor: `${BRAND}50`, backgroundColor: `${BRAND}08` }}>
          <p className="font-bold mb-3" style={{ color: DARK }}>Legal & Registration</p>
          <div className="space-y-2 text-zinc-600">
            <p>
              <span className="font-semibold" style={{ color: DARK }}>GST Registered:</span> Mekal Enterprises is GST
              registered. A valid GST invoice (with GSTIN) will be provided on request for all B2B orders.
            </p>
            <p>
              <span className="font-semibold" style={{ color: DARK }}>Trademark:</span> The Mekal Enterprises name and
              logo are proprietary brand assets. All rights reserved. Unauthorised reproduction or use of our brand
              identity is strictly prohibited under the Trade Marks Act, 1999.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  )
}

// ── FAQs ──────────────────────────────────────────────────────────────────────
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border rounded-2xl overflow-hidden transition-all"
      style={{ borderColor: open ? BRAND : "#e4e4e7" }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-3"
        style={{ backgroundColor: open ? `${BRAND}10` : "white" }}>
        <span className="text-sm font-semibold" style={{ color: DARK }}>{q}</span>
        {open
          ? <ChevronUp size={16} className="flex-shrink-0" style={{ color: BRAND }} />
          : <ChevronDown size={16} className="flex-shrink-0 text-zinc-400" />}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 text-sm text-zinc-600 leading-relaxed border-t"
          style={{ borderColor: `${BRAND}30` }}>
          {a}
        </div>
      )}
    </div>
  )
}

export function FAQsPage() {
  const faqs = [
    {
      q: "Do you accept bulk orders?",
      a: "Yes, we accept both bulk and single orders. There is no minimum order quantity — you can order even a single piece at competitive pricing. Bulk orders attract special discounts.",
    },
    {
      q: "Can I provide my own design?",
      a: "Absolutely. You can provide your own design in AI, PDF, PNG or JPG format. Our team will review the file quality and suggest any adjustments needed for best print results. If you don't have a design, our in-house design team can create one for you.",
    },
    {
      q: "What is the delivery time?",
      a: "Orders are processed within 2–5 working days after design approval and payment confirmation. Delivery across India typically takes 5–10 working days depending on your location. Metro cities may receive orders faster.",
    },
    {
      q: "Is there any minimum order quantity?",
      a: "No. There is no minimum order quantity at Mekal Enterprises. You can order even a single piece — whether it's a t-shirt, mug, visiting card or any other product.",
    },
    {
      q: "What if my order arrives damaged or defective?",
      a: "We offer free replacement for any item that arrives damaged or defective. You must report the issue within 24 hours of delivery with clear photo evidence. We will process your replacement within 5–7 working days.",
    },
    {
      q: "Can I cancel my order?",
      a: "Orders cannot be cancelled once production has started, as products are custom-made to your specifications. If you need to cancel before production begins, please contact us immediately at +91 9131387559.",
    },
    {
      q: "Do you provide GST invoices?",
      a: "Yes. We are GST registered and can provide a valid GST invoice for all orders. Please share your GSTIN at the time of placing the order for B2B invoices.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept UPI (Google Pay, PhonePe, Paytm), bank transfer (NEFT/RTGS/IMPS), and cash for local orders in Dewas. Full or partial advance payment is required before production begins.",
    },
    {
      q: "Can I get a sample before placing a bulk order?",
      a: "Yes, sample orders can be placed for most products. Samples are charged at the regular single-piece rate. This helps you verify quality and design before committing to a bulk order.",
    },
    {
      q: "Do you deliver outside India?",
      a: "Currently we deliver across all states in India. International shipping is not available at this time. Please contact us for the latest updates on delivery zones.",
    },
    {
      q: "How do I track my order?",
      a: "Once your order is dispatched, we will send you a tracking number via WhatsApp or email. You can use this to track your shipment through the courier partner's website.",
    },
    {
      q: "What file formats do you accept for designs?",
      a: "We accept AI (Adobe Illustrator), PDF, PNG, JPG and PSD files. For best print quality, vector files (AI/PDF) are preferred. High-resolution images (minimum 300 DPI) are recommended for photo-based prints.",
    },
  ]

  return (
    <PageShell title="Frequently Asked Questions" icon={HelpCircle}>
      <p className="text-zinc-500 text-sm mb-8 text-center">
        Can't find your answer? <a href="tel:+919131387559" className="font-semibold underline" style={{ color: DARK }}>Call us</a> or <a href="https://wa.me/919131387559" target="_blank" rel="noreferrer" className="font-semibold underline" style={{ color: DARK }}>WhatsApp us</a>.
      </p>
      <div className="space-y-3">
        {faqs.map(faq => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
      </div>
    </PageShell>
  )
}