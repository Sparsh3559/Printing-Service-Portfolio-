export default function App() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>

      {/* HERO */}
      <section style={{
        padding: "60px 20px",
        textAlign: "center",
        background: "#0f172a",
        color: "white",
        minHeight: "100vh"
      }}>

        <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
          Custom Printing Solutions
        </h1>

        <p style={{ marginBottom: "25px", opacity: 0.8 }}>
          T-shirts • Merchandise • Corporate Printing • Bulk Orders
        </p>

        <a
          href="https://wa.me/919999999999"
          target="_blank"
          style={{
            background: "#25D366",
            padding: "14px 24px",
            borderRadius: "8px",
            color: "white",
            textDecoration: "none",
            fontWeight: "bold"
          }}
        >
          Chat on WhatsApp
        </a>

      </section>

      {/* SERVICES */}
      <section style={{ padding: "40px 20px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
          Our Services
        </h2>

        <div style={{
          display: "grid",
          gap: "20px"
        }}>

          {[
            "Apparel Printing",
            "Merchandise Printing",
            "Corporate Printing",
            "Large Format Printing"
          ].map(service => (
            <div key={service}
              style={{
                border: "1px solid #ddd",
                padding: "20px",
                borderRadius: "10px"
              }}
            >
              <h3>{service}</h3>
              <p>High-quality customized printing solutions.</p>

              <a
                href="https://wa.me/919999999999"
                target="_blank"
                style={{
                  color: "#25D366",
                  fontWeight: "bold"
                }}
              >
                Enquire on WhatsApp →
              </a>
            </div>
          ))}

        </div>
      </section>

    </div>
  );
}