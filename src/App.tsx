
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mindmaps" element={<MyMindMaps />} />
            <Route path="/upload" element={<MaterialUpload />} />
            <Route path="/search" element={<MaterialSearch />} />
            <Route path="/discussion" element={<DiscussionCenter />} />
            <Route path="/profile" element={<PersonalCenter />} />
            <Route path="/admin/materials" element={<MaterialManagement />} />
            <Route path="/admin/users" element={<UserManagement />} />
          </Route>
          
          {/* Redirect from index to dashboard when accessing the application */}
          <Route path="/app" element={<Navigate to="/dashboard" replace />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
