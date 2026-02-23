import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [level, setLevel] = useState(0);
  const [selected, setSelected] = useState(null);

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
      {/* ===== LEVEL 1 — TOP BAR ===== */}
      <div className="topbar">

        {/* MOBILE HAMBURGER */}
        <button
          className="hamburger"
          onClick={() => {
            setMobileOpen(true);
            setLevel(0);
          }}
        >
          ☰
        </button>

        <div className="logo">PRINT HUB</div>

        <input className="search" placeholder="Search products..." />

        <div className="actions">
          <button>Support</button>
          <button>Login</button>
        </div>
      </div>

      {/* ===== LEVEL 2 — CATEGORIES ===== */}
      <div className="categories">
        {categories.map((cat) => (
          <div key={cat.name} className="category">
            {cat.name}

            {/* MEGA MENU */}
            <div className="mega">
              {Object.entries(cat.items).map(([title, list]) => (
                <div key={title}>
                  <h4>{title}</h4>
                  {list.map((item) => (
                    <a key={item} href="#">
                      {item}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ===== MOBILE DRAWER ===== */}
      {mobileOpen && (
        <div className="drawer">

          {/* LEVEL 0 */}
          {level === 0 && (
            <>
              <div className="drawer-header">
                Categories
                <button onClick={() => setMobileOpen(false)}>✕</button>
              </div>

              {categories.map((cat) => (
                <div
                  key={cat.name}
                  className="drawer-item"
                  onClick={() => {
                    setSelected(cat);
                    setLevel(1);
                  }}
                >
                  {cat.name} ▸
                </div>
              ))}
            </>
          )}

          {/* LEVEL 1 */}
          {level === 1 && selected && (
            <>
              <div className="drawer-header">
                <button onClick={() => setLevel(0)}>←</button>
                {selected.name}
              </div>

              {Object.entries(selected.items).map(
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
      )}

      {/* ===== STYLES ===== */}
      <style>{`

      /* ===== TOP BAR ===== */
      .topbar {
        position: sticky;
        top: 0;
        z-index: 1000;

        display: flex;
        align-items: center;
        gap: 20px;
        padding: 14px 24px;

        background: white;
        border-bottom: 1px solid #eee;
      }

      .logo {
        font-weight: 800;
        font-size: 20px;
      }

      .search {
        flex: 1;
        padding: 10px 14px;
        border-radius: 24px;
        border: 1px solid #ddd;
      }

      .actions button {
        background: none;
        border: none;
        font-weight: 600;
        margin-left: 10px;
        cursor: pointer;
      }

      /* ===== CATEGORIES BAR ===== */
      .categories {
        position: sticky;
        top: 64px;
        z-index: 999;

        display: flex;
        justify-content: center;
        gap: 40px;

        background: white;
        border-bottom: 1px solid #eee;
        padding: 12px 0;
      }

      .category {
        position: relative;
        font-weight: 600;
        cursor: pointer;
        padding-bottom: 6px;
      }

      /* RED UNDERLINE */
      .category:hover {
        border-bottom: 3px solid red;
      }

      /* ===== MEGA MENU ===== */
      .mega {
        position: absolute;
        top: 100%;
        left: 0;

        display: none;
        gap: 40px;

        padding: 24px;
        background: white;
        border: 1px solid #eee;
        box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      }

      .category:hover .mega {
        display: flex;
      }

      .mega h4 {
        margin-bottom: 10px;
      }

      .mega a {
        display: block;
        padding: 4px 0;
        color: #444;
        text-decoration: none;
      }

      /* ===== MOBILE ===== */
      .hamburger {
        display: none;
        font-size: 22px;
        background: none;
        border: none;
      }

      .drawer {
        position: fixed;
        top: 0;
        left: 0;
        width: 85%;
        height: 100vh;
        background: white;
        z-index: 2000;
        padding: 16px;
        overflow-y: auto;
      }

      .drawer-header {
        display: flex;
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
      }

      .sub-section a {
        display: block;
        padding: 6px 0;
        color: #444;
        text-decoration: none;
      }

      /* ===== RESPONSIVE ===== */
      @media (max-width: 768px) {
        .categories {
          display: none;
        }

        .hamburger {
          display: block;
        }
      }

      `}</style>
    </>
  );
}