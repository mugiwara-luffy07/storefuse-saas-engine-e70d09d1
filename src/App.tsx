import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Main landing
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Tenant pages
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductView from "./pages/ProductView";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";

// Admin
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import DashboardHome from "./admin/DashboardHome";
import AdminProducts from "./admin/AdminProducts";
import AdminOrders from "./admin/AdminOrders";

// Super Admin
import SuperAdminLogin from "./superadmin/SuperAdminLogin";
import SuperAdminLayout from "./superadmin/SuperAdminLayout";
import TenantsList from "./superadmin/TenantsList";
import CreateTenant from "./superadmin/CreateTenant";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Main StoreFuse Landing */}
          <Route path="/" element={<Index />} />

          {/* Super Admin Routes */}
          <Route path="/superadmin" element={<SuperAdminLogin />} />
          <Route path="/superadmin" element={<SuperAdminLayout />}>
            <Route path="tenants" element={<TenantsList />} />
            <Route path="create" element={<CreateTenant />} />
          </Route>

          {/* Tenant Admin Routes */}
          <Route path="/:tenant/admin" element={<AdminLogin />} />
          <Route path="/:tenant/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>

          {/* Tenant Customer Routes */}
          <Route path="/:tenant" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:productId" element={<ProductView />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-success" element={<OrderSuccess />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
