import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Apparels from "./pages/Apparels";
import Drinkware from "./pages/Drinkware";
import CorporatePrinting from "./pages/CorporatePrinting";
import BannerPrinting from "./pages/BannerPrinting";

import Dashboard from "./pages/admin/Dashboard";
import AddProduct from "./pages/admin/products/AddProduct";
import ManageProducts from "./pages/admin/products/ManageProducts";
import ManageBanners from "./pages/admin/banners/ManageBanners";
import ManageCategories from "./pages/admin/categories/ManageCategories";


import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Client */}
        <Route path="/" element={<Home />} />
        <Route path="/tshirt-printing" element={<Apparels />} />
        <Route path="/mug-printing" element={<Drinkware />} />
        <Route path="/corporate-printing" element={<CorporatePrinting />} />
        <Route path="/banner-printing" element={<BannerPrinting />} />

        {/* Admin — flat routes, each page wraps itself in AdminLayout */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/products" element={<ManageProducts />} />
        <Route path="/admin/categories" element={<ManageCategories />} />
        <Route path="/admin/banners" element={<ManageBanners />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;