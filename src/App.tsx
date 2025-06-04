import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { initializeStorage } from "./lib/storage";
import { initializeMindMapStorage } from "./lib/mindmapStorage";
import { useEffect } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import ThemeRoot from "./components/theme/ThemeRoot";
import "./styles/theme.css";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import Index from "./pages/home/Index";
import Dashboard from "./pages/dashboard/Dashboard";
import MyMindMaps from "./pages/mindmap/MyMindMaps";
import MaterialUpload from "./pages/material/MaterialUpload";
import MaterialSearch from "./pages/material-search/MaterialSearch";
import MermaidMapTest from "./pages/material-search/MermaidMapTest";
import MaterialDetail from "./pages/material/MaterialDetail";
import DiscussionCenter from "./pages/discussions/DiscussionCenter";
import PersonalCenter from "./pages/profile/PersonalCenter";
import MaterialManagement from "./pages/material/MaterialManagement";
import UserManagement from "./pages/admin/UserManagement";
import NotFound from "./pages/error/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import MindMapEditor from './pages/mindmap/MindMapEditor';
import MindMapView from './pages/mindmap/MindMapView';
import MindMapMaterials from './pages/mindmap/MindMapMaterials';
import GlobalMaterialMap from './pages/material-search/GlobalMaterialMap';
import ActivityTracker from './components/global/ActivityTracker';

const queryClient = new QueryClient();

// 为GitHub Pages部署添加baseName
const baseName = import.meta.env.BASE_URL;

function App() {
  useEffect(() => {
    // 初始化本地存储
    initializeStorage();
    // 初始化思维导图存储
    initializeMindMapStorage();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ThemeRoot />
        <BrowserRouter basename={baseName}>
          <TooltipProvider>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/my-mindmaps" element={<MyMindMaps />} />
                  <Route path="/material-upload" element={<MaterialUpload />} />
                  <Route path="/material-search" element={<MaterialSearch />} />
                  <Route path="/material-search/mermaid-test" element={<MermaidMapTest />} />
                  <Route path="/material/:id" element={<MaterialDetail />} />
                  <Route path="/discussion" element={<DiscussionCenter />} />
                  <Route path="/personal" element={<PersonalCenter />} />
                  <Route path="/material-management" element={<MaterialManagement />} />
                  <Route path="/user-management" element={<UserManagement />} />
                  <Route path="/mindmap/:id/edit" element={<MindMapEditor />} />
                  <Route path="/mindmap/:id/view" element={<MindMapView />} />
                  <Route path="/mindmap/:id/materials" element={<MindMapMaterials />} />
                  <Route path="/global-material-map" element={<GlobalMaterialMap />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </TooltipProvider>
        </BrowserRouter>
        <Toaster />
        <Sonner />
        <ActivityTracker />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
