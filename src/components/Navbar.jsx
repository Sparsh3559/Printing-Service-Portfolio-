import { useEffect, useState } from "react";

export default function Navbar() {
  const [hideCategories, setHideCategories] = useState(false);

  useEffect(() => {
    let lastScroll = window.scrollY;

    const handleScroll = () => {
      const current = window.scrollY;

      if (current > lastScroll && current > 80) {
        // scrolling down
        setHideCategories(true);
      } else {
        // scrolling up
        setHideCategories(false);
      }

      lastScroll = current;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = ["Apparel", "Drinkware", "Marketing", "Corporate"];

  return (
    <>
      {/* ===== TOP BAR (ALWAYS STICKY) ===== */}
      <nav className="topbar">
        <div className="logo">PRINT HUB</div>

        <input className="search" placeholder="Search products..." />

        <div className="actions">
          <button>Support</button>
          <button>Login</button>
        </div>
      </nav>

      {/* ===== CATEGORIES BAR (HIDE/SHOW) ===== */}
      <div
        className={`categories ${hideCategories ? "hidden" : ""}`}
      >
        {categories.map((cat) => (
          <div key={cat} className="category">
            {cat}
          </div>
        ))}
      </div>

      {/* ===== STYLES ===== */}
      <style>{`

      /* ===== TOP BAR ===== */
      .topbar {
        position: sticky;
        top: 0;
        z-index: 1000;

        display: flex;
        align-items: center;
        padding: 14px 24px;
        gap: 20px;

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
        top: 64px; /* height of topbar */
        z-index: 999;

        display: flex;
        gap: 30px;
        padding: 12px 24px;

        background: #fafafa;
        border-bottom: 1px solid #eee;

        transition: transform 0.25s ease;
      }

      .categories.hidden {
        transform: translateY(-100%);
      }

      .category {
        font-weight: 600;
        cursor: pointer;
      }

      `}</style>
    </>
  );
}