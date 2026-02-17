import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MugPrinting() {
  const number = "919999999999";

  const openWhatsApp = () => {
    const msg = "Hello, I want details about Mug Printing service.";
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
            src="https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=1400"
            alt="Mug Printing"
          />
        </div>

        {/* CONTENT */}
        <div className="content">
          <h1>Mug Printing</h1>

          <p>
            High-quality custom mug printing for gifts, corporate branding,
            promotional merchandise, and special events.
          </p>

          <ul>
            <li>✔ Photo mugs & personalized gifts</li>
            <li>✔ Bulk corporate orders</li>
            <li>✔ Durable, fade-resistant printing</li>
            <li>✔ Fast delivery</li>
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