import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Users, Eye, Calendar } from 'lucide-react';
import { MindMap } from '@/types/mindmap';

interface PublicMindMapsGridProps {
  mindMaps: MindMap[];
  onViewMindMap: (id: number) => void;
}

const PublicMindMapsGrid: React.FC<PublicMindMapsGridProps> = ({
  mindMaps,
  onViewMindMap
}) => {
  // 获取用户头像的辅助函数
  const getUserInitials = (name: string): string => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  // 获取随机色彩为头像
  const getRandomColor = (name: string): string => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  // 卡片动画
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (mindMaps.length === 0) {
    return (
      <div className="text-center p-8">
        <Brain className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2">暂无公开思维导图</h3>
        <p className="text-gray-500 mb-4">目前还没有用户分享的思维导图</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {mindMaps.map((mindMap, index) => (
        <motion.div
          key={mindMap.id}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span className="line-clamp-2">{mindMap.name}</span>
                <Badge className="ml-2 shrink-0">思维导图</Badge>
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className={getRandomColor(mindMap.createdBy || '')}>
                    {getUserInitials(mindMap.createdBy || '')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600">
                  {mindMap.createdBy || '匿名用户'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(mindMap.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {mindMap.views || 0}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">
                {mindMap.description || '暂无描述'}
              </p>
              <div className="flex flex-wrap gap-1 mt-3">
                {mindMap.keywords?.map(keyword => (
                  <Badge key={keyword} variant="outline" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-3">
              <Button 
                onClick={() => onViewMindMap(mindMap.id)}
                className="w-full"
              >
                查看导图
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default PublicMindMapsGrid; 