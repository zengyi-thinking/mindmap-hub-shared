
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Clock, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

// 修复: 使用import而不是require导入图片
import defaultAvatar from "/public/placeholder.svg";

interface StarredContentProps {
  starredItems: any[];
  user: any;
}

const StarredContent: React.FC<StarredContentProps> = ({ starredItems, user }) => {
  const navigate = useNavigate();

  const truncateText = (text: string, maxLength: number) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const handleItemClick = (item: any) => {
    if (item.type === "mindmap") {
      navigate(`/mindmap-view/${item.id}`);
    } else if (item.type === "material") {
      navigate(`/material/${item.id}`);
    }
  };

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-amber-50/60 to-yellow-50/60 dark:from-amber-950/20 dark:to-yellow-950/20 border-b border-primary/10">
        <CardTitle className="text-lg flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-500" />
          收藏内容
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {starredItems && starredItems.length > 0 ? (
          <div className="divide-y">
            {starredItems.slice(0, 3).map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
                className="p-4 cursor-pointer"
                onClick={() => handleItemClick(item)}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex flex-col flex-grow min-w-0">
                    <div className="flex items-center gap-1.5">
                      {item.type === "mindmap" ? (
                        <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-blue-500"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="9"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="M12 3V21M3 12H21"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="p-1.5 rounded-md bg-emerald-100 dark:bg-emerald-900/30">
                          <FileText className="h-3.5 w-3.5 text-emerald-500" />
                        </div>
                      )}
                      <h4 className="font-medium text-sm">
                        {truncateText(item.title, 20)}
                      </h4>
                      <Badge
                        variant="secondary"
                        className="h-5 text-xs font-normal"
                      >
                        {item.type === "mindmap" ? "思维导图" : "学习资料"}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                      {new Date(
                        item.favoriteTime || item.updatedAt
                      ).toLocaleDateString("zh-CN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                      收藏
                    </div>
                  </div>
                  <Avatar className="h-8 w-8 opacity-80">
                    <AvatarImage src={user?.avatar || defaultAvatar} alt={user?.name} />
                    <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-muted-foreground text-sm">没有收藏的内容</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StarredContent;
