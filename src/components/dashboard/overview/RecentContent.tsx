
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, FileText, Clock, Star, ChevronRight, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ContentItem {
  id: number;
  title: string;
  type: string;
  date: string;
  starred: boolean;
}

interface RecentContentProps {
  recentContent: ContentItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const RecentContent: React.FC<RecentContentProps> = ({
  recentContent,
  activeTab,
  setActiveTab,
}) => {
  const navigate = useNavigate();

  const createMindMap = () => {
    navigate("/mindmap-editor/new");
  };

  const toggleStarred = (item: ContentItem, e: React.MouseEvent) => {
    e.stopPropagation();

    if (item.type === "思维导图") {
      const mindmapService = require("@/lib/mindmapStorage").mindmapService;
      const updatedMindMap = mindmapService.toggleStarred(item.id);
      if (updatedMindMap) {
        toast({
          title: updatedMindMap.starred ? "已收藏" : "已取消收藏",
          description: `思维导图「${updatedMindMap.title}」${
            updatedMindMap.starred ? "已添加到收藏" : "已从收藏中移除"
          }`,
        });
      }
    } else if (item.type === "学习资料") {
      const userFilesService = require("@/lib/storage").userFilesService;
      const updatedMaterial = userFilesService.toggleStarred(item.id);
      if (updatedMaterial) {
        toast({
          title: updatedMaterial.starred ? "已收藏" : "已取消收藏",
          description: `学习资料「${updatedMaterial.title}」${
            updatedMaterial.starred ? "已添加到收藏" : "已从收藏中移除"
          }`,
        });
      }
    }
  };

  const renderContentItems = (items: ContentItem[]) => {
    return items.map((item) => (
      <motion.div
        key={`${item.type}-${item.id}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="cursor-pointer"
        onClick={() => {
          if (item.type === "思维导图") {
            navigate(`/mindmap-editor/${item.id}`);
          } else if (item.type === "学习资料") {
            navigate(`/material/${item.id}`);
          }
        }}
      >
        <Card className="mb-3 hover:border-primary/50 transition-colors">
          <CardContent className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-muted">
                {item.type === "思维导图" ? (
                  <Brain className="h-5 w-5 text-primary" />
                ) : (
                  <FileText className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {item.date}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => toggleStarred(item, e)}
                className="p-1 rounded-full hover:bg-muted transition-colors"
              >
                <Star
                  className={`h-4 w-4 ${
                    item.starred
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-2 space-y-4 relative"
    >
      <Card className="glass-card overflow-hidden relative">
        <CardHeader className="pb-2 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-blue-950/20 dark:to-indigo-950/20 border-b border-primary/10">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-semibold tracking-tight">最近内容</CardTitle>
              <CardDescription>您最近使用的思维导图和学习资料</CardDescription>
            </div>
            <Tabs defaultValue={activeTab} className="w-auto">
              <TabsList className="grid w-full grid-cols-3 h-8">
                <TabsTrigger value="recent" onClick={() => setActiveTab('recent')} className="text-xs px-2">最近</TabsTrigger>
                <TabsTrigger value="mindmaps" onClick={() => setActiveTab('mindmaps')} className="text-xs px-2">思维导图</TabsTrigger>
                <TabsTrigger value="materials" onClick={() => setActiveTab('materials')} className="text-xs px-2">学习资料</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 relative">
          {recentContent.length > 0 ? (
            renderContentItems(recentContent)
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <FileText className="h-16 w-16 mx-auto opacity-20 absolute inset-0" />
                <div className="absolute inset-0 bg-blue-500/5 animate-pulse rounded-full blur-xl"></div>
              </div>
              <p>暂无最近内容</p>
              <p className="text-sm mt-1">尝试创建思维导图或上传学习资料</p>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="gap-2 btn-effect" 
                  onClick={createMindMap}
                >
                  <Plus className="h-3.5 w-3.5" />
                  立即创建
                </Button>
              </div>
            </div>
          )}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-500/5 rounded-full blur-xl"></div>
        </CardContent>
        <CardFooter className="bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:from-blue-950/10 dark:to-indigo-950/10 border-t border-primary/10">
          <Button 
            variant="ghost" 
            className="w-full gap-1 btn-effect"
            onClick={() => navigate('/search')}
          >
            查看全部历史记录
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default RecentContent;
