
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PersonalCenter = () => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">个人中心</h1>
        <p className="text-muted-foreground">管理您的个人信息和设置</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>个人中心正在开发中</CardTitle>
          <CardDescription>此功能即将推出，敬请期待</CardDescription>
        </CardHeader>
        <CardContent>
          <p>个人中心将允许用户：</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>更新个人资料信息</li>
            <li>管理账户安全设置</li>
            <li>查看个人活动历史</li>
            <li>管理通知偏好</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalCenter;
