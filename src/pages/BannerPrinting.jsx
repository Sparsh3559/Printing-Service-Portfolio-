import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function BannerPrinting() {
  const number = "919999999999";

  const openWhatsApp = () => {
    const msg =
      "Hello, I want details about Banner & Poster Printing services.";
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
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1400"
            alt="Banner Printing"
          />
        </div>

        {/* CONTENT */}
        <div className="content">
          <h1>Banner & Poster Printing</h1>

          <p>
            High-impact large format printing for events, promotions,
            storefronts, exhibitions, and outdoor advertising.
          </p>

          <ul>
            <li>✔ Flex banners & vinyl prints</li>
            <li>✔ Indoor & outdoor posters</li>
            <li>✔ Weather-resistant materials</li>
            <li>✔ Custom sizes available</li>
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