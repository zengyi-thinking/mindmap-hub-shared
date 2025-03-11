
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DiscussionCenter = () => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">讨论交流中心</h1>
        <p className="text-muted-foreground">在这里发表和参与各种话题的讨论</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>讨论中心正在开发中</CardTitle>
          <CardDescription>此功能即将推出，敬请期待</CardDescription>
        </CardHeader>
        <CardContent>
          <p>讨论交流中心将允许用户：</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>创建新的讨论话题</li>
            <li>参与已有话题的讨论</li>
            <li>按主题分类浏览讨论</li>
            <li>收到讨论更新通知</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscussionCenter;
