/**
 * 桥接文件 - MindMapTabs组件
 * 这个文件作为桥接，提供简单的实现
 */

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Star, 
  StarOff, 
  Share2, 
  Lock, 
  Edit3, 
  Trash2, 
  Calendar, 
  Eye,
  FileText,
  Clock,
  Grid,
  Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// MindMapCard组件
const MindMapCard = ({ 
  mindMap, 
  onEdit, 
  onDelete, 
  onToggleStar, 
  onToggleShared, 
  cardType = 'default'
}: any) => {
  const navigate = useNavigate();
  
  // 根据卡片类型选择背景样式
  const getHeaderStyles = () => {
    switch (cardType) {
      case 'recent':
        return "bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900";
      case 'starred':
        return "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-gray-800 dark:to-gray-900";
      default:
        return "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900";
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow ${cardType === 'starred' ? 'border-yellow-200' : ''}`}>
      <CardHeader className={`${getHeaderStyles()} border-b pb-4`}>
        <div className="flex justify-between">
          <Button 
            variant="ghost" 
            size="icon"
            className={mindMap.starred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}
            onClick={() => onToggleStar && onToggleStar(mindMap.id)}
          >
            {mindMap.starred ? <Star className="h-5 w-5 fill-yellow-500" /> : <StarOff className="h-5 w-5" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className={mindMap.shared ? 'text-green-500' : 'text-gray-400'}
            onClick={() => onToggleShared && onToggleShared(mindMap.id)}
          >
            {mindMap.shared ? <Share2 className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
          </Button>
        </div>
        <CardTitle className="mt-2 text-xl cursor-pointer hover:text-primary transition-colors" 
          onClick={() => navigate(`/mindmap/${mindMap.id}/view`)}
        >
          {mindMap.title}
        </CardTitle>
        <div className="flex items-center text-xs text-muted-foreground mt-1 gap-3">
          <span className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(mindMap.updatedAt)}
          </span>
          {mindMap.viewCount > 0 && (
            <span className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {mindMap.viewCount} 次查看
            </span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="py-4">
        <CardDescription className="line-clamp-2 h-10">
          {mindMap.description || '暂无描述信息'}
        </CardDescription>
        
        <div className="flex flex-wrap gap-1 mt-3">
          {mindMap.tags && mindMap.tags.map((tag: string, idx: number) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {(!mindMap.tags || mindMap.tags.length === 0) && (
            <span className="text-xs text-muted-foreground">无标签</span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" size="sm" className="flex items-center gap-1"
          onClick={() => onEdit && onEdit(mindMap.id)}
        >
          <Edit3 className="h-3.5 w-3.5" />
          编辑
        </Button>
        <Button variant="ghost" size="sm" className="text-destructive flex items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            onDelete && onDelete(mindMap.id, e);
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
          删除
        </Button>
      </CardFooter>
    </Card>
  );
};

// EmptyState组件，用于显示无内容状态
const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  actionText
}: any) => {
  return (
    <div className="text-center py-12 border rounded-lg bg-muted/30">
      <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-primary/10 mb-4">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        {description}
      </p>
      {action && (
        <Button onClick={action}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

// MindMapTabs组件
interface MindMapTabsProps {
  filteredMindMaps?: any[];
  recentMindMaps?: any[];
  starredMindMaps?: any[];
  onToggleStar?: (id: number) => void;
  onToggleShared?: (id: number) => void;
  onEditMindMap?: (id: number) => void;
  onDeleteMindMap?: (id: number, e?: React.MouseEvent) => void;
  onShareMindMap?: (mindMap: any, e?: React.MouseEvent) => void;
}

const MindMapTabs: React.FC<MindMapTabsProps> = ({
  filteredMindMaps = [],
  recentMindMaps = [],
  starredMindMaps = [],
  onToggleStar,
  onToggleShared,
  onEditMindMap,
  onDeleteMindMap,
  onShareMindMap
}) => {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all" className="flex items-center gap-1">
          <Grid className="h-4 w-4" />
          <span>所有思维导图</span>
        </TabsTrigger>
        <TabsTrigger value="recent" className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>最近访问</span>
        </TabsTrigger>
        <TabsTrigger value="starred" className="flex items-center gap-1">
          <Sparkles className="h-4 w-4" />
          <span>已收藏</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-6">
        {filteredMindMaps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMindMaps.map((mindMap) => (
              <MindMapCard
                key={mindMap.id}
                mindMap={mindMap}
                onToggleStar={onToggleStar}
                onToggleShared={onToggleShared}
                onEdit={onEditMindMap}
                onDelete={onDeleteMindMap}
                onShare={onShareMindMap}
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={FileText}
            title="还没有思维导图"
            description="创建您的第一个思维导图，开始组织和可视化您的想法和知识"
          />
        )}
      </TabsContent>
      
      <TabsContent value="recent" className="mt-6">
        {recentMindMaps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentMindMaps.map((mindMap) => (
              <MindMapCard
                key={mindMap.id}
                mindMap={mindMap}
                cardType="recent"
                onToggleStar={onToggleStar}
                onToggleShared={onToggleShared}
                onEdit={onEditMindMap}
                onDelete={onDeleteMindMap}
                onShare={onShareMindMap}
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={Clock}
            title="没有最近访问的思维导图"
            description="访问或编辑思维导图后，它们将显示在这里"
          />
        )}
      </TabsContent>
      
      <TabsContent value="starred" className="mt-6">
        {starredMindMaps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {starredMindMaps.map((mindMap) => (
              <MindMapCard
                key={mindMap.id}
                mindMap={mindMap}
                cardType="starred"
                onToggleStar={onToggleStar}
                onToggleShared={onToggleShared}
                onEdit={onEditMindMap}
                onDelete={onDeleteMindMap}
                onShare={onShareMindMap}
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={Star}
            title="没有收藏的思维导图"
            description="点击思维导图卡片上的星星图标，将其添加到收藏夹"
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default MindMapTabs; 