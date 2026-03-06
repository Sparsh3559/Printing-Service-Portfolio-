import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home              from "./pages/Home";
import Apparels          from "./pages/Apparels";
import Drinkware         from "./pages/Drinkware";
import CorporatePrinting from "./pages/CorporatePrinting";
import BannerPrinting    from "./pages/BannerPrinting";
import ProductPage       from "./pages/ProductPage";
import CategoryPage      from "./pages/CategoryPage";

import LoginPage         from "./pages/admin/login/LoginPage";
import AuthGuard         from "./components/AuthGuard";
import Dashboard         from "./pages/admin/Dashboard";
import AddProduct        from "./pages/admin/products/AddProduct";
import ManageProducts    from "./pages/admin/products/ManageProducts";
import ManageBanners     from "./pages/admin/banners/ManageBanners";
import ManageCategories  from "./pages/admin/categories/ManageCategories";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public ── */}
        <Route path="/"                   element={<Home />} />
        <Route path="/apparels"           element={<Apparels />} />
        <Route path="/drinkware"          element={<Drinkware />} />
        <Route path="/corporate-printing" element={<CorporatePrinting />} />
        <Route path="/banner-printing"    element={<BannerPrinting />} />
        <Route path="/product/:slug"      element={<ProductPage />} />
        <Route path="/category/:id"       element={<CategoryPage />} />

        {/* ── Admin login (public) ── */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* ── Admin (all protected) ── */}
        <Route path="/admin" element={
          <AuthGuard><Dashboard /></AuthGuard>
        } />
        <Route path="/admin/add-product" element={
          <AuthGuard><AddProduct /></AuthGuard>
        } />
        <Route path="/admin/products" element={
          <AuthGuard><ManageProducts /></AuthGuard>
        } />
        <Route path="/admin/categories" element={
          <AuthGuard><ManageCategories /></AuthGuard>
        } />
        <Route path="/admin/banners" element={
          <AuthGuard><ManageBanners /></AuthGuard>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;