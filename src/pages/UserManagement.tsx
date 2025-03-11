
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const UserManagement = () => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">用户管理</h1>
        <p className="text-muted-foreground">管理平台用户和权限</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>管理员功能：用户管理</CardTitle>
          <CardDescription>管理用户账户和权限设置</CardDescription>
        </CardHeader>
        <CardContent>
          <p>用户管理功能将允许管理员：</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>查看所有用户的账户信息</li>
            <li>设置或修改用户的登录权限</li>
            <li>禁用违反平台规则的账户</li>
            <li>查看用户活动日志</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
