export default function TShirtPage() {
    const whatsappNumber = "919999999999"; // replace
  
    const message =
      "Hello, I want details about T-Shirt Printing service.";
  
    const openWhatsApp = () => {
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        message
      )}`;
      window.open(url, "_blank");
    };
  
    return (
      <div className="tshirt-page">
  
        {/* HERO IMAGE */}
        <div className="hero-img">
          <img
            src="https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1400"
            alt="T-Shirt Printing"
          />
        </div>
  
        {/* CONTENT */}
        <div className="content">
          <h1>T-Shirt Printing</h1>
  
          <p>
            We provide premium quality custom T-shirt printing for
            events, brands, corporate teams, and personal use.
            Choose from various fabrics, colors, and printing methods
            including DTF, screen printing, and sublimation.
          </p>
  
          <ul>
            <li>✔ Bulk orders available</li>
            <li>✔ Fast turnaround time</li>
            <li>✔ High-quality prints</li>
            <li>✔ Custom designs supported</li>
          </ul>
  
          <button className="whatsapp-btn" onClick={openWhatsApp}>
            Get Quote on WhatsApp
          </button>
        </div>
  
        <style>{`
          .tshirt-page {
            padding-bottom: 60px;
          }
  
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
  
          @media (max-width: 768px) {
            .hero-img img {
              height: 260px;
            }
  
            h1 {
              font-size: 28px;
            }
          }
        `}</style>
      </div>
    );
  }