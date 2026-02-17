import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import TShirtPrinting from "./pages/TshirtPrinting";
import MugPrinting from "./pages/MugPrinting";
import CorporatePrinting from "./pages/CorporatePrinting";
import BannerPrinting from "./pages/BannerPrinting";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tshirt-printing" element={<TShirtPrinting />} />
          <Route path="/mug-printing" element={<MugPrinting />} />
          <Route path="/corporate-printing" element={<CorporatePrinting />} />
          <Route path="/banner-printing" element={<BannerPrinting />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;