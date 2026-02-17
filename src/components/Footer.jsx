export default function Footer() {
    const whatsappNumber = "919999999999"; // replace
  
    return (
      <footer className="footer">
        <div className="footer-container">
  
          {/* BRAND */}
          <div className="footer-col">
            <h3>PrintCraft</h3>
            <p>
              Premium custom printing solutions for businesses,
              events, and personal needs.
            </p>
          </div>
  
          {/* SERVICES */}
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li>T-Shirt Printing</li>
              <li>Mug Printing</li>
              <li>Corporate Printing</li>
              <li>Banner & Poster</li>
            </ul>
          </div>
  
          {/* QUICK LINKS */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li>Home</li>
              <li>Services</li>
              <li>About</li>
              <li>Contact</li>
            </ul>
          </div>
  
          {/* CONTACT */}
          <div className="footer-col">
            <h4>Contact</h4>
  
            <p>📞 +91 99999 99999</p>
            <p>📧 info@printcraft.com</p>
            <p>📍 Indore, India</p>
  
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="whatsapp-btn"
            >
              Chat on WhatsApp
            </a>
          </div>
  
        </div>
  
        {/* BOTTOM */}
        <div className="footer-bottom">
          © {new Date().getFullYear()} PrintCraft. All rights reserved.
        </div>
  
        <style>{`
          .footer {
            background: #111;
            color: #ddd;
            padding-top: 60px;
          }
  
          .footer-container {
            max-width: 1200px;
            margin: auto;
            padding: 0 20px;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 40px;
          }
  
          .footer-col h3 {
            color: white;
            font-size: 22px;
            margin-bottom: 16px;
          }
  
          .footer-col h4 {
            color: white;
            margin-bottom: 14px;
          }
  
          .footer-col p {
            line-height: 1.6;
            margin-bottom: 10px;
          }
  
          .footer-col ul {
            list-style: none;
            padding: 0;
          }
  
          .footer-col li {
            margin-bottom: 8px;
            cursor: pointer;
          }
  
          .footer-col li:hover {
            color: white;
          }
  
          .whatsapp-btn {
            display: inline-block;
            margin-top: 12px;
            background: #25d366;
            color: white;
            padding: 10px 18px;
            border-radius: 24px;
            text-decoration: none;
            font-weight: 600;
          }
  
          .footer-bottom {
            text-align: center;
            padding: 20px;
            margin-top: 40px;
            border-top: 1px solid #333;
            font-size: 14px;
          }
  
          /* TABLET */
          @media (max-width: 900px) {
            .footer-container {
              grid-template-columns: repeat(2, 1fr);
            }
          }
  
          /* MOBILE */
          @media (max-width: 600px) {
            .footer-container {
              grid-template-columns: 1fr;
              text-align: center;
            }
  
            .whatsapp-btn {
              margin: 16px auto 0;
            }
          }
        `}</style>
      </footer>
    );
  }