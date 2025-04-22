// 应用路由配置
import { lazy } from 'react';

// 路由定义
const routes = [
  {
    path: '/',
    element: () => import('../pages/home/Index'),
    public: true,
  },
  {
    path: '/login',
    element: () => import('../pages/auth/Login'),
    public: true,
  },
  {
    path: '/register',
    element: () => import('../pages/auth/Register'),
    public: true,
  },
  {
    path: '/dashboard',
    element: () => import('../pages/dashboard/Dashboard'),
    protected: true,
  },
  {
    path: '/my-mindmaps',
    element: () => import('../pages/mindmap/MyMindMaps'),
    protected: true,
  },
  {
    path: '/material-upload',
    element: () => import('../pages/material/MaterialUpload'),
    protected: true,
  },
  {
    path: '/material-search',
    element: () => import('../pages/material-search/MaterialSearch'),
    protected: true,
  },
  {
    path: '/material/:id',
    element: () => import('../pages/material/MaterialDetail'),
    protected: true,
  },
  {
    path: '/discussion',
    element: () => import('../pages/discussions/DiscussionCenter'),
    protected: true,
  },
  {
    path: '/personal',
    element: () => import('../pages/profile/PersonalCenter'),
    protected: true,
  },
  {
    path: '/material-management',
    element: () => import('../pages/material/MaterialManagement'),
    protected: true,
    admin: true,
  },
  {
    path: '/user-management',
    element: () => import('../pages/admin/UserManagement'),
    protected: true,
    admin: true,
  },
  {
    path: '/mindmap/:id/edit',
    element: () => import('../pages/mindmap/MindMapEditor'),
    protected: true,
  },
  {
    path: '/mindmap/:id/view',
    element: () => import('../pages/mindmap/MindMapView'),
    protected: true,
  },
  {
    path: '/mindmap/:id/materials',
    element: () => import('../pages/mindmap/MindMapMaterials'),
    protected: true,
  },
  {
    path: '/global-material-map',
    element: () => import('../pages/material-search/GlobalMaterialMap'),
    protected: true,
  },
  {
    path: '*',
    element: () => import('../pages/error/NotFound'),
    public: true,
  },
];

export default routes; 