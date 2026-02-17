import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import TShirtPrinting from "./pages/TshirtPrinting";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tshirt-printing" element={<TShirtPrinting />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;