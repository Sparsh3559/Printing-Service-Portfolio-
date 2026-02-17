import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* NAVBAR */}
      <nav className="nav">
        <button className="hamburger" onClick={() => setOpen(true)}>
          ☰
        </button>

        <div className="logo">ApparelTech</div>

        <div className="icons">
          <span>👤</span>
          <span>❤️</span>
          <span>🛍️</span>
        </div>
      </nav>

      {/* OVERLAY */}
      {open && (
        <div className="overlay" onClick={() => setOpen(false)}></div>
      )}

      {/* DRAWER */}
      <div className={`drawer ${open ? "open" : ""}`}>
        <button className="close" onClick={() => setOpen(false)}>
          ✕
        </button>

        <input
          className="drawer-search"
          placeholder="Search for products"
        />

        <div className="drawer-item">CATEGORIES</div>
        <div className="drawer-item">CATALOGUE</div>
        <div className="drawer-item">STORY</div>
        <div className="drawer-item">BLOG</div>
        <div className="drawer-item">CONTACT</div>
        <div className="drawer-item">WISHLIST</div>
        <div className="drawer-item">COMPARE</div>
        <div className="drawer-item">LOGIN / REGISTER</div>
      </div>

      {/* STYLES */}
      <style>{`
        /* NAVBAR */
        .nav {
          position: sticky;
          top: 0;
          height: 64px;
          background: #e8f2ed;   /* light green */
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          z-index: 1001;
          border-bottom: 1px solid #ddd;
        }

        .logo {
          font-weight: 700;
          font-size: 18px;
          color: #222;
        }

        .icons span {
          margin-left: 14px;
          font-size: 18px;
          cursor: pointer;
        }

        /* HAMBURGER */
        .hamburger {
          font-size: 22px;
          background: none;
          border: none;
          cursor: pointer;
          color: black;
        }

        /* OVERLAY */
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 999;
        }

        /* DRAWER */
        .drawer {
          position: fixed;
          top: 0;
          left: -85%;
          width: 85%;
          height: 100%;
          background: white;
          padding: 20px 16px;
          transition: left 0.3s ease;
          z-index: 1000;
          overflow-y: auto;
        }

        .drawer.open {
          left: 0;
        }

        .close {
          background: none;
          border: none;
          font-size: 20px;
          margin-bottom: 16px;
          cursor: pointer;
        }

        /* SEARCH INPUT — FIXED */
        .drawer-search {
          width: 100%;
          box-sizing: border-box;  /* ⭐ prevents overflow */
          padding: 12px 16px;
          border-radius: 24px;
          border: 1px solid #ddd;
          margin-bottom: 20px;
          background: #f5f5f5;
          outline: none;
          font-size: 14px;
        }

        .drawer-item {
          padding: 16px 8px;
          border-bottom: 1px solid #eee;
          font-weight: 500;
          color: #222;
          cursor: pointer;
        }

        /* DESKTOP NAV */
        @media (min-width: 768px) {
          .hamburger {
            display: none;
          }
        }
      `}</style>
    </>
  );
}