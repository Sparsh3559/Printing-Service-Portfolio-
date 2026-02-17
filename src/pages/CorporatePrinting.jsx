import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function CorporatePrinting() {
  const number = "919999999999";

  const openWhatsApp = () => {
    const msg =
      "Hello, I want details about Corporate Printing services.";
    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <>
      <Navbar />

      <div className="service-page">

        {/* HERO IMAGE */}
        <div className="hero-img">
          <img
            src="https://images.unsplash.com/photo-1581093588401-22d4a6d18a44?q=80&w=1400"
            alt="Corporate Printing"
          />
        </div>

        {/* CONTENT */}
        <div className="content">
          <h1>Corporate Printing</h1>

          <p>
            Professional printing solutions for companies, offices,
            institutions, and corporate events. Perfect for branding
            and bulk requirements.
          </p>

          <ul>
            <li>✔ Company merchandise & uniforms</li>
            <li>✔ Event branding materials</li>
            <li>✔ Bulk printing at best prices</li>
            <li>✔ Consistent professional quality</li>
          </ul>

          <button className="whatsapp-btn" onClick={openWhatsApp}>
            Get Quote on WhatsApp
          </button>
        </div>
      </div>

      <Footer />

      <style>{`
        .hero-img img {
          width: 100%;
          height: 420px;
          object-fit: cover;
        }

        .content {
          max-width: 900px;
          margin: 40px auto;
          padding: 0 20px;
        }

        h1 {
          font-size: 36px;
          margin-bottom: 16px;
        }

        p {
          font-size: 16px;
          line-height: 1.7;
          margin-bottom: 20px;
        }

        ul {
          margin-bottom: 28px;
          padding-left: 18px;
        }

        li {
          margin-bottom: 8px;
        }

        .whatsapp-btn {
          background: #25d366;
          color: white;
          border: none;
          padding: 14px 24px;
          font-size: 16px;
          border-radius: 30px;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}