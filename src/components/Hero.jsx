import { useEffect, useState } from "react";

export default function HeroSlider() {
  const slides = [
    {
      title: "A Little Thank You, Just for Her",
      subtitle:
        "Women’s Day gift hampers to make her feel appreciated",
      button: "Use Code: HER26",
      image:
        "https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=1920",
    },
    {
      title: "Premium Custom Printing",
      subtitle: "Creative, customisable, cost-effective",
      button: "Explore Services",
      image:
        "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1920",
    },
    {
      title: "Corporate Gifting Solutions",
      subtitle: "Perfect for teams, events & branding",
      button: "View Products",
      image:
        "https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=1920",
    },
  ];

  const [index, setIndex] = useState(0);

  const next = () =>
    setIndex((prev) => (prev + 1) % slides.length);

  const prev = () =>
    setIndex((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );

  // Auto play
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-slider">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`slide ${i === index ? "active" : ""}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="overlay" />

          <div className="content">
            <h2>{slide.title}</h2>
            <p>{slide.subtitle}</p>
            <button>{slide.button}</button>
          </div>
        </div>
      ))}

      {/* ARROWS */}
      <button className="arrow left" onClick={prev}>
        ‹
      </button>

      <button className="arrow right" onClick={next}>
        ›
      </button>

      {/* DOTS */}
      <div className="dots">
        {slides.map((_, i) => (
          <span
            key={i}
            className={i === index ? "active" : ""}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>

      <style>{`

      .hero-slider {
        position: relative;
        width: 100%;
        height: calc(100vh - 120px);
        overflow: hidden;
      }

      .slide {
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: center;
        opacity: 0;
        transition: opacity 0.8s ease;
      }

      .slide.active {
        opacity: 1;
      }

      .overlay {
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.35);
      }

      .content {
        position: absolute;
        left: 8%;
        top: 50%;
        transform: translateY(-50%);
        color: white;
        max-width: 520px;
      }

      h2 {
        font-size: 42px;
        font-weight: 800;
        margin-bottom: 14px;
      }

      p {
        font-size: 18px;
        margin-bottom: 22px;
      }

      button {
        background: #1f3b6f;
        color: white;
        border: none;
        padding: 14px 28px;
        border-radius: 30px;
        font-weight: 600;
        cursor: pointer;
      }

      /* ===== MODERN ARROWS ===== */

      .arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: none;
        background: rgba(0,0,0,0.55);
        color: white;
        font-size: 26px;
        cursor: pointer;
        opacity: 0;
        transition: 0.3s;
      }

      .left { left: 20px; }
      .right { right: 20px; }

      /* Show arrows on hover */
      .hero-slider:hover .arrow {
        opacity: 1;
      }

      .arrow:hover {
        background: rgba(0,0,0,0.8);
      }

      /* ===== MODERN DOTS ===== */

      .dots {
        position: absolute;
        bottom: 22px;
        left: 8%;
        display: flex;
        gap: 10px;
      }

      .dots span {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(255,255,255,0.5);
        cursor: pointer;
        transition: 0.3s;
      }

      .dots span.active {
        background: white;
        transform: scale(1.3);
      }

      /* MOBILE */

      @media (max-width: 768px) {
        .content {
          left: 20px;
          right: 20px;
        }

        h2 {
          font-size: 26px;
        }

        p {
          font-size: 15px;
        }

        .hero-slider {
          height: 60vh;
        }

        .arrow {
          opacity: 1; /* Always visible on mobile */
        }
      }

      `}</style>
    </section>
  );
}