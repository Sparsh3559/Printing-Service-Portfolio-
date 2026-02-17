import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* TOP NAVBAR */}
      <nav
        style={{
          height: 60,
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          borderBottom: "1px solid #eee",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        {/* Hamburger */}
        <button
          onClick={() => setOpen(true)}
          style={{
            fontSize: 24,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          ☰
        </button>

        {/* Logo */}
        <div style={{ fontWeight: "bold", fontSize: 18 }}>
          ApparelTech
        </div>

        {/* Right icon */}
        <div style={{ fontSize: 20 }}>🛍️</div>
      </nav>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 999,
          }}
        />
      )}

      {/* SIDE DRAWER */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: open ? 0 : "-85%",
          width: "85%",
          height: "100%",
          background: "#fff",
          zIndex: 1000,
          transition: "left 0.3s ease",
          padding: 16,
          overflowY: "auto",
        }}
      >
        {/* Close */}
        <button
          onClick={() => setOpen(false)}
          style={{
            fontSize: 24,
            background: "none",
            border: "none",
            marginBottom: 10,
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        {/* Search */}
        <input
          placeholder="Search for products"
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 25,
            border: "1px solid #ddd",
            marginBottom: 20,
          }}
        />

        {/* Menu */}
        <MenuItem text="CATEGORIES" />
        <MenuItem text="CATALOGUE" />
        <MenuItem text="STORY" />
        <MenuItem text="BLOG" />
        <MenuItem text="CONTACT" />
        <MenuItem text="WISHLIST" />
        <MenuItem text="COMPARE" />
        <MenuItem text="LOGIN / REGISTER" />
      </div>
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