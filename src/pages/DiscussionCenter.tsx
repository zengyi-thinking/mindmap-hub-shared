
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DiscussionCenter = () => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">讨论交流中心</h1>
        <p className="text-muted-foreground">与其他用户交流学习心得和想法</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>讨论交流中心正在开发中</CardTitle>
          <CardDescription>此功能即将推出，敬请期待</CardDescription>
        </CardHeader>
        <CardContent>
          <p>讨论交流中心将允许用户：</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>创建新的讨论话题</li>
            <li>回复其他用户的讨论</li>
            <li>关注感兴趣的话题</li>
            <li>获得问题的解答</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscussionCenter;
