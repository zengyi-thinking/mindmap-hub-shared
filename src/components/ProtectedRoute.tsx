import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../lib/auth';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAdmin = false }) => {
  const { user, isLoading } = useAuth();
  
  // 如果正在加载身份验证信息，显示加载中
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">加载中...</p>
        </div>
      </div>
    );
  }
  
  // 如果用户未登录，重定向到登录页面
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // 如果需要管理员权限但用户不是管理员，重定向到仪表板
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  // 如果满足所有条件，渲染子路由
  return <Outlet />;
};

export default ProtectedRoute; 