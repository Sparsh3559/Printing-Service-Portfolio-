import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import TShirtPage from "./pages/TShirtPage";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tshirt-printing" element={<TShirtPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;