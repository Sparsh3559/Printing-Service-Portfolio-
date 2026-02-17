import { useState, useEffect } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

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
      <aside className={`drawer ${open ? "open" : ""}`}>
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
      </aside>

      {/* STYLES */}
      <style>{`

        /* NAVBAR */
        .nav {
          position: sticky;
          top: 0;
          height: 64px;
          background: #e8f2ed;
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
          background: rgba(0,0,0,0.45);
          z-index: 1000;
        }

        /* DRAWER — FULLY HIDDEN FIX */
        .drawer {
          position: fixed;
          top: 0;
          left: 0;
          width: 85%;
          max-width: 320px;
          height: 100%;
          background: white;
          padding: 20px 16px;
          transform: translateX(-100%);  /* ⭐ key fix */
          transition: transform 0.3s ease;
          z-index: 1001;
          overflow-y: auto;
          box-shadow: 2px 0 12px rgba(0,0,0,0.2);
        }

        .drawer.open {
          transform: translateX(0);
        }

        /* CLOSE BUTTON */
        .close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          font-size: 22px;
          cursor: pointer;
          color: #333;
        }

        /* SEARCH */
        .drawer-search {
          width: 100%;
          box-sizing: border-box;
          padding: 12px 16px;
          border-radius: 24px;
          border: 1px solid #ddd;
          margin: 48px 0 20px 0;
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

        /* DESKTOP */
        @media (min-width: 768px) {
          .hamburger {
            display: none;
          }
        }

      `}</style>
    </>
  );
}