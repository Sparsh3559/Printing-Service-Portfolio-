export default function WhatsAppButton() {
    return (
      <a
        href="https://wa.me/919999999999"
        target="_blank"
        rel="noreferrer"
        style={{
          position: "fixed",
          right: 16,
          bottom: 20,
          width: 60,
          height: 60,
          background: "#25D366",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 28,
          textDecoration: "none",
          boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
          zIndex: 1000,
        }}
      >
        🟢
      </a>
    );
  }