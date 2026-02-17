import { Link } from "react-router-dom";

export default function ServiceCard({ title, image, path }) {
  return (
    <div className="service-card">
      <img src={image} alt={title} />

      <div className="overlay">
        <h3>{title}</h3>

        {/* 🔥 THIS BUTTON NOW NAVIGATES */}
        <Link to={path} className="read-btn">
          READ MORE
        </Link>
      </div>

      <style>{`
        .service-card {
          position: relative;
          overflow: hidden;
          background: #fff;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .service-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .service-card:hover img {
          transform: scale(1.08);
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.65);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 20px;
          color: white;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .service-card:hover .overlay {
          opacity: 1;
        }

        .overlay h3 {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        /* 🔥 Styled Link like button */
        .read-btn {
          align-self: flex-start;
          background: #ff3b1f;
          color: white;
          padding: 10px 18px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
        }

        .service-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 18px 45px rgba(0,0,0,0.18);
        }
      `}</style>
    </div>
  );
}