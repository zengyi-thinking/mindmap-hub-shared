import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { AuthProvider } from '@/lib/auth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PageTransition } from '@/components/PageTransition';

import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import MaterialUpload from '@/pages/MaterialUpload';
import MaterialManagement from '@/pages/MaterialManagement';
import MaterialDetail from '@/pages/MaterialDetail';
import MaterialSearch from '@/pages/MaterialSearch';
import GlobalMaterialMap from '@/pages/GlobalMaterialMap';
import MyMindMaps from '@/pages/MyMindMaps';
import MindMapEditor from '@/pages/MindMapEditor';
import MindMapMaterials from '@/pages/MindMapMaterials';
import MindMapView from '@/pages/MindMapView';
import PersonalCenter from '@/pages/PersonalCenter';
import UserManagement from '@/pages/UserManagement';
import DiscussionCenter from '@/pages/DiscussionCenter';
import NotFound from '@/pages/NotFound';
import MainLayout from '@/layouts/MainLayout';
import FileMapSearch from '@/pages/FileMapSearch';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="ui-theme">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Index />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute>
                      <PageTransition>
                        <Dashboard />
                      </PageTransition>
                    </ProtectedRoute>
                  }
                />
                
                <Route 
                  path="material-upload" 
                  element={
                    <ProtectedRoute>
                      <PageTransition>
                        <MaterialUpload />
                      </PageTransition>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="material-management" 
                  element={
                    <ProtectedRoute>
                      <PageTransition>
                        <MaterialManagement />
                      </PageTransition>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="material-detail/:id" 
                  element={
                    <PageTransition>
                      <MaterialDetail />
                    </PageTransition>
                  } 
                />
                
                <Route 
                  path="material-search" 
                  element={
                    <PageTransition>
                      <MaterialSearch />
                    </PageTransition>
                  } 
                />
                
                <Route 
                  path="file-map" 
                  element={
                    <PageTransition>
                      <FileMapSearch />
                    </PageTransition>
                  } 
                />
                
                <Route 
                  path="global-material-map" 
                  element={
                    <PageTransition>
                      <GlobalMaterialMap />
                    </PageTransition>
                  } 
                />
                
                <Route 
                  path="my-mindmaps" 
                  element={
                    <ProtectedRoute>
                      <PageTransition>
                        <MyMindMaps />
                      </PageTransition>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="mindmap-editor/:id" 
                  element={
                    <ProtectedRoute>
                      <PageTransition>
                        <MindMapEditor />
                      </PageTransition>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="mindmap-materials/:mindMapId/:nodeId" 
                  element={
                    <PageTransition>
                      <MindMapMaterials />
                    </PageTransition>
                  } 
                />
                
                <Route 
                  path="mindmap-view/:id" 
                  element={
                    <PageTransition>
                      <MindMapView />
                    </PageTransition>
                  } 
                />
                
                <Route 
                  path="personal-center" 
                  element={
                    <ProtectedRoute>
                      <PageTransition>
                        <PersonalCenter />
                      </PageTransition>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="user-management" 
                  element={
                    <ProtectedRoute>
                      <PageTransition>
                        <UserManagement />
                      </PageTransition>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="discussion-center" 
                  element={
                    <PageTransition>
                      <DiscussionCenter />
                    </PageTransition>
                  } 
                />
                
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
