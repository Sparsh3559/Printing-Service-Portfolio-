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
          .hero {
            width: 100%;
            min-height: 85vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            text-align: center;
  
            background: linear-gradient(
                rgba(0, 0, 0, 0.45),
                rgba(0, 0, 0, 0.45)
              ),
              url("https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1920");
  
            background-size: cover;
            background-position: center;
            color: white;
          }
  
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
  
          .hero-buttons {
            display: flex;
            gap: 14px;
            justify-content: center;
            flex-wrap: wrap;
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
  
          /* Desktop */
  
          @media (min-width: 768px) {
            .hero {
              text-align: left;
              padding: 80px 60px;
              justify-content: flex-start;
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
        `}</style>
      </section>
    );
  }