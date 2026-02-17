export default function Hero() {
    const whatsappNumber = "919999999999"; // <-- replace with client number
  
    const openWhatsApp = () => {
      window.open(
        `https://wa.me/${whatsappNumber}?text=Hello%20I%20want%20printing%20services`,
        "_blank"
      );
    };
  
    return (
      <section className="hero">
        <div className="hero-content">
          <h1>
            Premium Custom Printing
            <br />
            For Brands & Events
          </h1>
  
          <p>
            T-shirts, merchandise, corporate printing, bulk orders and
            personalized products — all in one place.
          </p>
  
          <div className="hero-buttons">
            <button className="primary" onClick={openWhatsApp}>
              Get Quote on WhatsApp
            </button>
  
            <button
              className="secondary"
              onClick={() =>
                document.getElementById("services")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              View Services
            </button>
          </div>
        </div>
  
        <style>{`
          /* ===== HERO SECTION ===== */
  
          .hero {
            width: 100%;
  
            /* Full screen below navbar */
            height: calc(100vh - 64px);
            min-height: 520px;
  
            display: flex;
            align-items: center;
            justify-content: flex-start;
  
            padding: 40px 20px;
  
            background:
              linear-gradient(
                rgba(0, 0, 0, 0.55),
                rgba(0, 0, 0, 0.55)
              ),
              url("https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1920");
  
            background-size: cover;
            background-position: 70% center; /* better desktop composition */
            background-repeat: no-repeat;
  
            color: white;
          }
  
          /* ===== CONTENT ===== */
  
          .hero-content {
            max-width: 700px;
          }
  
          .hero h1 {
            font-size: 38px;
            line-height: 1.2;
            margin-bottom: 18px;
            font-weight: 800;
          }
  
          .hero p {
            font-size: 16px;
            opacity: 0.95;
            margin-bottom: 28px;
          }
  
          /* ===== BUTTONS ===== */
  
          .hero-buttons {
            display: flex;
            gap: 14px;
            flex-wrap: wrap;
            justify-content: center;
          }
  
          .primary {
            background: #25d366;
            color: white;
            border: none;
            padding: 14px 22px;
            font-size: 15px;
            border-radius: 30px;
            font-weight: 600;
            cursor: pointer;
          }
  
          .secondary {
            background: transparent;
            color: white;
            border: 2px solid white;
            padding: 12px 22px;
            font-size: 15px;
            border-radius: 30px;
            font-weight: 600;
            cursor: pointer;
          }
  
          /* ===== DESKTOP ===== */
  
          @media (min-width: 768px) {
            .hero {
              padding: 80px clamp(40px, 8vw, 120px);
              text-align: left;
            }
  
            .hero h1 {
              font-size: 56px;
            }
  
            .hero p {
              font-size: 18px;
            }
  
            .hero-buttons {
              justify-content: flex-start;
            }
          }
  
          /* ===== MOBILE ===== */
  
          @media (max-width: 767px) {
            .hero {
              justify-content: center;
              text-align: center;
              background-position: center;
              min-height: 80vh;
            }
          }
        `}</style>
      </section>
    );
  }