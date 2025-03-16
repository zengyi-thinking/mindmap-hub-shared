
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Star, Calendar, InfoIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StarredItem {
  id: number;
  type: string;
  title: string;
  tags?: string[];
  updatedAt?: string;
  favoriteTime?: string;
  uploadTime?: string;
  favoriteNote?: string;
}

interface StarredContentProps {
  starredItems: StarredItem[];
  user: any;
}

const StarredContent: React.FC<StarredContentProps> = ({ starredItems, user }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const userFilesService = require("@/lib/storage").userFilesService;
  const mindmapService = require("@/lib/mindmapStorage").mindmapService;

  const handleViewItem = (item: StarredItem) => {
    if (item.type === "mindmap") {
      navigate(`/mindmap-view/${item.id}`);
    } else {
      navigate(`/material/${item.id}`);
    }
  };

  const handleToggleFavorite = (item: StarredItem) => {
    try {
      if (item.type === "mindmap") {
        mindmapService.toggleStarred(item.id);
        toast({
          title: "已取消收藏",
        });
      } else {
        userFilesService.removeFavorite(item.id, user?.id);
        toast({
          title: "已取消收藏",
        });
      }
    } catch (error) {
      console.error("收藏操作出错:", error);
      toast({
        title: "操作失败",
        description: "收藏操作失败，请稍后再试",
        variant: "destructive",
      });
    }
  };

  const renderStarredItem = (item: StarredItem) => {
    const isMindmap = item.type === "mindmap";
    const formattedDate = isMindmap
      ? new Date(item.updatedAt || "").toLocaleDateString()
      : new Date(item.favoriteTime || item.uploadTime || "").toLocaleDateString();

    return (
      <Card key={`${item.type}-${item.id}`} className="overflow-hidden">
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription className="text-xs">
                {isMindmap ? "思维导图" : "学习资料"}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleToggleFavorite(item)}
            >
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="flex flex-wrap gap-1 mb-2">
            {item.tags &&
              item.tags.slice(0, 3).map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
          </div>
          <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              {isMindmap ? "更新于：" : "收藏于："} {formattedDate}
            </div>

            {!isMindmap && item.favoriteNote && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <InfoIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{item.favoriteNote}</p>
                </TooltipContent>
              </Tooltip>
            )}

            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs"
              onClick={() => handleViewItem(item)}
            >
              查看
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="glass-card overflow-hidden relative">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-blue-950/20 dark:to-indigo-950/20 border-b border-primary/10">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-semibold tracking-tight">收藏内容</CardTitle>
            <CardDescription>您标记为收藏的内容</CardDescription>
          </div>
          {starredItems.length > 0 && (
            <Button variant="link" size="sm" className="text-xs h-6 px-0 btn-effect">
              查看全部 <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="relative">
        {starredItems.length > 0 ? (
          <div className="grid gap-3">
            {starredItems.slice(0, 3).map(renderStarredItem)}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <div className="relative w-20 h-20 mx-auto mb-3">
              <Star className="h-16 w-16 mx-auto stroke-muted-foreground/50 absolute inset-0" />
              <div className="absolute inset-0 bg-amber-500/5 animate-pulse rounded-full blur-xl"></div>
            </div>
            <p>没有收藏的内容</p>
            <p className="text-sm mt-1">点击星标图标添加收藏</p>
          </div>
        )}
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-500/5 rounded-full blur-xl"></div>
      </CardContent>
    </Card>
  );
};

export default StarredContent;
