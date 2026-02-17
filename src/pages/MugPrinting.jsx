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
      <div className="service-page">
        <h1>Mug Printing</h1>
        <p>High-quality custom mug printing for gifts, branding and events.</p>
  
        <button onClick={openWhatsApp}>
          Get Quote on WhatsApp
        </button>
      </div>
    );
  }