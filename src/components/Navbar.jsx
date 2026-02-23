import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [level, setLevel] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    {
      name: "Apparel",
      items: {
        "T-Shirts": ["Round Neck", "Polo", "Oversized"],
        Hoodies: ["Zipper Hoodie", "Pullover"],
      },
    },
    {
      name: "Drinkware",
      items: {
        Mugs: ["Ceramic", "Magic Mug", "Photo Mug"],
        Bottles: ["Steel Bottle", "Sipper"],
      },
    },
    {
      name: "Marketing",
      items: {
        "Visiting Cards": ["Standard", "Premium", "Folded"],
        Banners: ["Flex Banner", "Standee"],
      },
    },
  ];

  return (
    <>
      {/* ===== TOP BAR ===== */}
      <nav className="navbar">

        {/* Hamburger LEFT */}
        <button
          className="hamburger"
          onClick={() => {
            setMobileOpen(true);
            setLevel(0);
          }}
        >
          ☰
        </button>

        {/* Logo */}
        <div className="logo">PRINT HUB</div>

        {/* Search */}
        <input className="search" placeholder="Search products..." />

        {/* Right Actions */}
        <div className="actions">
          <button>Support</button>
          <button>Login</button>
        </div>
      </nav>

      {/* ===== MOBILE DRAWER ===== */}
      {mobileOpen && (
        <div className="drawer">

          {/* Sliding track */}
          <div
            className="drawer-track"
            style={{ transform: `translateX(-${level * 100}%)` }}
          >

            {/* ===== LEVEL 0 — CATEGORIES ===== */}
            <div className="panel">
              <div className="drawer-header">
                <span>Categories</span>
                <button onClick={() => setMobileOpen(false)}>✕</button>
              </div>

              {categories.map((cat) => (
                <div
                  key={cat.name}
                  className="drawer-item"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setLevel(1);
                  }}
                >
                  {cat.name} ▸
                </div>
              ))}
            </div>

            {/* ===== LEVEL 1 — SUB CATEGORIES ===== */}
            <div className="panel">
              {selectedCategory && (
                <>
                  <div className="drawer-header">
                    <button onClick={() => setLevel(0)}>←</button>
                    <span>{selectedCategory.name}</span>
                  </div>

                  {Object.entries(selectedCategory.items).map(
                    ([title, list]) => (
                      <div key={title} className="sub-section">
                        <h4>{title}</h4>

                        {list.map((item) => (
                          <a key={item} href="#">
                            {item}
                          </a>
                        ))}
                      </div>
                    )
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ===== STYLES ===== */}
      <style>{`

        /* ===== NAVBAR ===== */

        .navbar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: white;
          border-bottom: 1px solid #eee;
        }

        .logo {
          font-weight: 800;
          white-space: nowrap;
        }

        .search {
          flex: 1;
          padding: 10px 14px;
          border-radius: 22px;
          border: 1px solid #ddd;
        }

        .actions button {
          background: none;
          border: none;
          font-weight: 600;
          margin-left: 8px;
          cursor: pointer;
        }

        .hamburger {
          font-size: 22px;
          background: none;
          border: none;
          cursor: pointer;
        }

        /* ===== DRAWER ===== */

        .drawer {
          position: fixed;
          top: 0;
          left: 0;
          width: 85%;
          height: 100vh;
          background: white;
          z-index: 3000;
          overflow: hidden;
          box-shadow: 4px 0 20px rgba(0,0,0,0.15);
        }

        /* Sliding container */
        .drawer-track {
          display: flex;
          width: 200%;
          height: 100%;
          transition: transform 0.35s ease;
        }

        /* Each panel */
        .panel {
          width: 100%;
          padding: 16px;
          overflow-y: auto;
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          font-weight: 700;
        }

        .drawer-item {
          padding: 14px 0;
          border-bottom: 1px solid #eee;
          font-weight: 600;
          cursor: pointer;
        }

        .sub-section {
          margin-bottom: 20px;
        }

        .sub-section h4 {
          margin-bottom: 8px;
          font-size: 15px;
          color: #222;
        }

        .sub-section a {
          display: block;
          padding: 6px 0;
          text-decoration: none;
          color: #555;
          font-size: 14px;
        }

        .sub-section a:hover {
          color: black;
        }

        /* Desktop */
        @media (min-width: 768px) {
          .hamburger {
            display: none;
          }

          .drawer {
            display: none;
          }
        }

      `}</style>
    </>
  );
}