import { useState, useEffect } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Lock scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <>
      {/* NAVBAR */}
      <nav className="nav">
        {/* Mobile hamburger */}
        <button className="hamburger" onClick={() => setOpen(true)}>
          ☰
        </button>

        {/* Logo */}
        <div className="logo">ApparelTech</div>

        {/* Desktop menu */}
        <div className="menu">
          <span>CATEGORIES</span>
          <span>CATALOGUE</span>
          <span>STORY</span>
          <span>BLOG</span>
          <span>CONTACT</span>
        </div>

        {/* Search + Icons */}
        <div className="right">
          <input
            className="search"
            placeholder="Search for products"
          />

          <div className="icons">
            <span>👤</span>
            <span>❤️</span>
            <span>🛍️</span>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {open && (
        <div className="overlay" onClick={() => setOpen(false)} />
      )}

      {/* Mobile Drawer */}
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
        <div className="drawer-item">LOGIN / REGISTER</div>
      </aside>

      {/* STYLES */}
      <style>{`

        /* NAVBAR */
        .nav {
          position: sticky;
          top: 0;
          height: 70px;
          background: #e8f2ed;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          z-index: 1001;
          border-bottom: 1px solid #ddd;
          gap: 20px;
        }

        .logo {
          font-weight: 700;
          font-size: 20px;
          color: #222;
          white-space: nowrap;
        }

        /* Desktop menu */
        .menu {
          display: none;
          gap: 24px;
          font-weight: 500;
          color: #333;
        }

        .menu span {
          cursor: pointer;
        }

        .menu span:hover {
          color: #000;
        }

        /* Right side */
        .right {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .search {
          display: none;
          padding: 8px 14px;
          border-radius: 20px;
          border: 1px solid #ccc;
          outline: none;
        }

        .icons span {
          margin-left: 6px;
          font-size: 18px;
          cursor: pointer;
        }

        /* Hamburger */
        .hamburger {
          font-size: 22px;
          background: none;
          border: none;
          cursor: pointer;
          color: black;
        }

        /* Overlay */
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 1000;
        }

        /* Drawer */
        .drawer {
          position: fixed;
          top: 0;
          left: 0;
          width: 85%;
          max-width: 320px;
          height: 100%;
          background: white;
          padding: 20px 16px;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          z-index: 1001;
          overflow-y: auto;
          box-shadow: 2px 0 12px rgba(0,0,0,0.2);
        }

        .drawer.open {
          transform: translateX(0);
        }

        .close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          font-size: 22px;
          cursor: pointer;
        }

        .drawer-search {
          width: 100%;
          box-sizing: border-box;
          padding: 12px 16px;
          border-radius: 24px;
          border: 1px solid #ddd;
          margin: 48px 0 20px 0;
          background: #f5f5f5;
          outline: none;
        }

        .drawer-item {
          padding: 16px 8px;
          border-bottom: 1px solid #eee;
          font-weight: 500;
          cursor: pointer;
        }

        /* ================= DESKTOP VIEW ================= */

        @media (min-width: 768px) {

          .hamburger {
            display: none;
          }

          .menu {
            display: flex;
          }

          .search {
            display: block;
            width: 260px;
          }

        }

      `}</style>
    </>
  );
}