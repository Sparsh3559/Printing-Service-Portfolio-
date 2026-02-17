export default function BannerPrinting() {
    const number = "919999999999";
  
    const openWhatsApp = () => {
      const msg =
        "Hello, I want details about Banner & Poster Printing.";
      window.open(
        `https://wa.me/${number}?text=${encodeURIComponent(msg)}`,
        "_blank"
      );
    };
  
    return (
      <div className="service-page">
        <h1>Banner & Poster Printing</h1>
        <p>Large format printing for events, shops and promotions.</p>
  
        <button onClick={openWhatsApp}>
          Get Quote on WhatsApp
        </button>
      </div>
    );
  }