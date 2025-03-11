
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const MaterialManagement = () => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">资料管理</h1>
        <p className="text-muted-foreground">管理平台上的学习资料</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>管理员功能：资料管理</CardTitle>
          <CardDescription>管理用户上传的学习资料</CardDescription>
        </CardHeader>
        <CardContent>
          <p>资料管理功能将允许管理员：</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>查看所有用户上传的资料</li>
            <li>审核新上传的资料</li>
            <li>删除违规内容</li>
            <li>整理和分类资料</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialManagement;
