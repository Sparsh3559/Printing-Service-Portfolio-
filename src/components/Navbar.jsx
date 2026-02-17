import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* NAVBAR */}
      <nav className="nav">
        
        {/* LEFT — Hamburger (mobile only) */}
        <button className="hamburger" onClick={() => setOpen(true)}>
          ☰
        </button>

        {/* LOGO */}
        <div className="logo">ApparelTech</div>

        {/* DESKTOP MENU */}
        <div className="menu">
          <a>CATEGORIES</a>
          <a>CATALOGUE</a>
          <a>STORY</a>
          <a>BLOG</a>
          <a>CONTACT</a>
        </div>

        {/* SEARCH */}
        <input
          className="search"
          placeholder="Search for products"
        />

        {/* RIGHT ICONS */}
        <div className="icons">
          👤 ❤️ 🛍️
        </div>
      </nav>

      {/* OVERLAY */}
      {open && (
        <div
          className="overlay"
          onClick={() => setOpen(false)}
        />
      )}

      {/* MOBILE DRAWER */}
      <div className={`drawer ${open ? "open" : ""}`}>
        <button className="close" onClick={() => setOpen(false)}>
          ✕
        </button>

        <input
          className="drawer-search"
          placeholder="Search for products"
        />

        <MenuItem text="CATEGORIES" />
        <MenuItem text="CATALOGUE" />
        <MenuItem text="STORY" />
        <MenuItem text="BLOG" />
        <MenuItem text="CONTACT" />
        <MenuItem text="WISHLIST" />
        <MenuItem text="COMPARE" />
        <MenuItem text="LOGIN / REGISTER" />
      </div>

      {/* STYLES */}
      <style>{`
        
        .nav {
          height: 64px;
          display: flex;
          align-items: center;
          padding: 0 16px;
          background: #e7f0ed;
          border-bottom: 1px solid #ddd;
          position: sticky;
          top: 0;
          z-index: 1000;
          gap: 16px;
        }

        .logo {
          font-weight: bold;
          font-size: 20px;
        }

        .menu {
          display: none;
          gap: 20px;
          margin-left: 20px;
        }

        .menu a {
          cursor: pointer;
          font-weight: 500;
        }

        .search {
          display: none;
          padding: 8px 12px;
          border-radius: 20px;
          border: 1px solid #ccc;
          flex: 1;
          max-width: 300px;
        }

        .icons {
          margin-left: auto;
          display: flex;
          gap: 12px;
          font-size: 18px;
        }

        .hamburger {
          font-size: 24px;
          background: none;
          border: none;
          cursor: pointer;
        }

        /* DESKTOP VIEW */
        @media (min-width: 768px) {
          .hamburger {
            display: none;
          }

          .menu {
            display: flex;
          }

          .search {
            display: block;
          }
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
          padding: 16px;
          transition: left 0.3s ease;
          z-index: 1000;
          overflow-y: auto;
        }

        .drawer.open {
          left: 0;
        }

        .close {
          font-size: 24px;
          background: none;
          border: none;
          margin-bottom: 12px;
          cursor: pointer;
        }

        .drawer-search {
          width: 100%;
          padding: 12px;
          border-radius: 20px;
          border: 1px solid #ddd;
          margin-bottom: 20px;
        }

      `}</style>
    </>
  );
}

function MenuItem({ text }) {
  return (
    <div
      style={{
        padding: "16px 8px",
        borderBottom: "1px solid #eee",
        fontWeight: 500,
      }}
    >
      {text}
    </div>
  );
}