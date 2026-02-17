import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import WhatsAppButton from "../components/WhatsAppButton";
import ServiceCard from "../components/ServiceCard";
import { services } from "../data/services";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />

      <section className="services-section">
        <div className="container">
          <h2>OUR SERVICES</h2>

          <div className="grid">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                image={service.image}
              />
            ))}
          </div>
        </div>
      </section>

      <WhatsAppButton />

      <style>{`
        .services-section {
          padding: 80px 20px;
          background: #f4f4f4;
        }

        .container {
          max-width: 1200px;
          margin: auto;
        }

        h2 {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 40px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }

        /* Tablet */
        @media (max-width: 900px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Mobile */
        @media (max-width: 600px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}