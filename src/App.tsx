import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import MyMindMaps from "./pages/MyMindMaps";
import MaterialUpload from "./pages/MaterialUpload";
import MaterialSearch from "./pages/MaterialSearch";
import DiscussionCenter from "./pages/DiscussionCenter";
import PersonalCenter from "./pages/PersonalCenter";
import MaterialManagement from "./pages/MaterialManagement";
import UserManagement from "./pages/UserManagement";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";

const queryClient = new QueryClient();

// 为GitHub Pages部署添加baseName
const baseName = import.meta.env.BASE_URL;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={baseName}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* 受保护的路由 - 需要用户登录 */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/mindmaps" element={<MyMindMaps />} />
                <Route path="/upload" element={<MaterialUpload />} />
                <Route path="/search" element={<MaterialSearch />} />
                <Route path="/discussion" element={<DiscussionCenter />} />
                <Route path="/profile" element={<PersonalCenter />} />
              </Route>
            </Route>
            
            {/* 受保护的路由 - 需要管理员权限 */}
            <Route element={<ProtectedRoute requireAdmin={true} />}>
              <Route element={<MainLayout />}>
                <Route path="/admin/materials" element={<MaterialManagement />} />
                <Route path="/admin/users" element={<UserManagement />} />
              </Route>
            </Route>
            
            {/* 重定向从index到dashboard */}
            <Route path="/app" element={<Navigate to="/dashboard" replace />} />
            
            {/* 捕获所有路由 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
