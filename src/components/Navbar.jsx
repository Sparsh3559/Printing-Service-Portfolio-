import { useState, useEffect } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [level, setLevel] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategories, setShowCategories] = useState(true);

  // ===== Scroll behavior (show on scroll down) =====
  useEffect(() => {
    let last = window.scrollY;

    const handleScroll = () => {
      const current = window.scrollY;

      if (current > last) {
        setShowCategories(true);   // scrolling DOWN → show
      } else {
        setShowCategories(false);  // scrolling UP → hide
      }

      last = current;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      </nav>

      {/* ===== DESKTOP CATEGORIES BAR ===== */}
      <div
        className={`categories-bar ${
          showCategories ? "show" : "hide"
        }`}
      >
        {categories.map((cat) => (
          <div key={cat.name} className="category">
            {cat.name}

            {/* Mega dropdown */}
            <div className="mega">
              {Object.entries(cat.items).map(
                ([title, list]) => (
                  <div key={title} className="col">
                    <h4>{title}</h4>
                    {list.map((item) => (
                      <a key={item} href="#">
                        {item}
                      </a>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ===== MOBILE DRAWER ===== */}
      {mobileOpen && (
        <div className="drawer">

          <div
            className="drawer-track"
            style={{ transform: `translateX(-${level * 100}%)` }}
          >

            {/* LEVEL 0 */}
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

            {/* LEVEL 1 */}
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

      /* NAVBAR */
      .navbar {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 16px;
        background: white;
        border-bottom: 1px solid #eee;
        position: sticky;
        top: 0;
        z-index: 1000;
      }

      .logo {
        font-weight: 800;
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
      }

      .hamburger {
        font-size: 22px;
        background: none;
        border: none;
        cursor: pointer;
      }

      /* CATEGORIES BAR */
      .categories-bar {
        display: flex;
        gap: 30px;
        padding: 12px 24px;
        background: #fafafa;
        border-bottom: 1px solid #eee;
        position: sticky;
        top: 56px;
        z-index: 999;
        transition: transform 0.3s;
      }

      .categories-bar.hide {
        transform: translateY(-100%);
      }

      .categories-bar.show {
        transform: translateY(0);
      }

      .category {
        position: relative;
        font-weight: 600;
        cursor: pointer;
      }

      /* MEGA MENU */
      .mega {
        position: absolute;
        left: 0;
        top: 36px;
        width: 100vw;
        background: white;
        box-shadow: 0 10px 40px rgba(0,0,0,0.12);
        padding: 30px 60px;
        display: none;
        gap: 60px;
      }

      .category:hover .mega {
        display: flex;
      }

      .col h4 {
        margin-bottom: 10px;
      }

      .col a {
        display: block;
        margin: 6px 0;
        text-decoration: none;
        color: #444;
      }

      /* MOBILE DRAWER */
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

      .drawer-track {
        display: flex;
        width: 200%;
        height: 100%;
        transition: transform 0.35s ease;
      }

      .panel {
        width: 100%;
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

      .sub-section a {
        display: block;
        padding: 6px 0;
        color: #444;
        text-decoration: none;
      }

      /* MOBILE */
      @media (max-width: 768px) {
        .categories-bar {
          display: none;
        }
      }

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