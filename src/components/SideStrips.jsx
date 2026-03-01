// SideStrips.jsx
// Fixed vertical blue strips on left and right edges of the screen.
// Creates the visual effect of navbar and footer being connected
// even while scrolling through the white page content.

export default function SideStrips() {
    return (
      <>
        {/* Left strip */}
        <div
          className="fixed top-0 left-0 h-full w-3 z-40 pointer-events-none"
          style={{ backgroundColor: "#065999" }}
        />
        {/* Right strip */}
        <div
          className="fixed top-0 right-0 h-full w-3 z-40 pointer-events-none"
          style={{ backgroundColor: "#065999" }}
        />
      </>
    )
  }