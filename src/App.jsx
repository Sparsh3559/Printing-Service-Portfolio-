import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import TShirtPrinting from "./pages/TshirtPrinting";
import MugPrinting from "./pages/MugPrinting";
import CorporatePrinting from "./pages/CorporatePrinting";
import BannerPrinting from "./pages/BannerPrinting";

import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AddProduct from "./pages/admin/products/AddProduct";
import ManageProducts from "./pages/admin/products/ManageProducts";
import ManageBanners from "./pages/admin/banners/ManageBanners";
import ManageCategories from "./pages/admin/categories/ManageCategories";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Client site */}
        <Route path="/" element={<Home />} />
        <Route path="/tshirt-printing" element={<TShirtPrinting />} />
        <Route path="/mug-printing" element={<MugPrinting />} />
        <Route path="/corporate-printing" element={<CorporatePrinting />} />
        <Route path="/banner-printing" element={<BannerPrinting />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="banners" element={<ManageBanners />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;