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
      <div className="service-page">
        <h1>Corporate Printing</h1>
        <p>Bulk printing for companies, uniforms, events and branding.</p>
  
        <button onClick={openWhatsApp}>
          Get Quote on WhatsApp
        </button>
      </div>
    );
  }