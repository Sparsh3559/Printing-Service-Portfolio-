import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [active, setActive] = useState(null);

  const menu = [
    {
      name: "Apparel",
      sections: {
        "Explore Apparel": [
          "T-Shirts",
          "Polo T-Shirts",
          "Oversized Tees",
          "Hoodies",
        ],
        "Printing Options": [
          "Screen Printing",
          "DTF Printing",
          "Embroidery",
        ],
      },
    },
    {
      name: "Drinkware",
      sections: {
        "Mugs": ["Ceramic Mug", "Magic Mug", "Photo Mug"],
        "Bottles": ["Steel Bottle", "Sipper Bottle"],
      },
    },
    {
      name: "Marketing",
      sections: {
        "Office": ["Visiting Cards", "Letterheads", "ID Cards"],
        "Outdoor": ["Flex Banner", "Standee", "Posters"],
      },
    },
  ];

  return (
    <header
      className="nav-wrapper"
      onMouseLeave={() => setActive(null)}
    >
      {/* ===== TOP BAR ===== */}
      <div className="nav-top">
        <div className="logo">PRINT HUB</div>

        <nav className="nav-center">
          {menu.map((item) => (
            <div
              key={item.name}
              className="nav-item"
              onMouseEnter={() => setActive(item.name)}
            >
              {item.name}
            </div>
          ))}
        </nav>

        <div className="nav-actions">
          <button>Support</button>
          <button>Login</button>
        </div>
      </div>

      {/* ===== MEGA MENU ===== */}
      {menu.map((item) =>
        active === item.name ? (
          <div key={item.name} className="mega-menu">
            <div className="mega-content">
              {Object.entries(item.sections).map(
                ([title, links]) => (
                  <div key={title} className="mega-column">
                    <h4>{title}</h4>

                    {links.map((link) => (
                      <a key={link} href="#">
                        {link}
                      </a>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        ) : null
      )}
    </header>
  );
}