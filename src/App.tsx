import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Main landing (redirects to default tenant)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Tenant pages
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import CustomOrder from "./pages/CustomOrder";
import OrderSuccess from "./pages/OrderSuccess";
import OrderTracking from "./pages/OrderTracking";
import About from "./pages/About";

// Admin
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import DashboardHome from "./admin/DashboardHome";
import AdminOrders from "./admin/AdminOrders";

// Super Admin
import SuperAdminLogin from "./superadmin/SuperAdminLogin";
import SuperAdminLayout from "./superadmin/SuperAdminLayout";
import SuperAdminDashboard from "./superadmin/DashboardHome";
import TenantsList from "./superadmin/TenantsList";
import CreateTenant from "./superadmin/CreateTenant";
import { ProtectedRouteSuperadmin } from "./superadmin/ProtectedRouteSuperadmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Root redirects to default tenant */}
          <Route path="/" element={<Index />} />

          {/* Super Admin Routes (hidden, no public links) */}
          <Route path="/superadmin/login" element={<SuperAdminLogin />} />
          <Route element={<ProtectedRouteSuperadmin />}>
            <Route path="/superadmin" element={<SuperAdminLayout />}>
              <Route path="dashboard" element={<SuperAdminDashboard />} />
              <Route path="tenants" element={<TenantsList />} />
              <Route path="create-tenant" element={<CreateTenant />} />
            </Route>
          </Route>

          {/* Tenant Admin Routes */}
          <Route path="/:tenant/admin" element={<AdminLogin />} />
          <Route path="/:tenant/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>

          {/* Tenant Customer Routes (main public-facing) */}
          <Route path="/:tenant" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="order" element={<CustomOrder />} />
            <Route path="order-success" element={<OrderSuccess />} />
            <Route path="orders/:orderId" element={<OrderTracking />} />
            <Route path="about" element={<About />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
