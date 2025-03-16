
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, FileText, Star, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StatItem {
  title: string;
  icon: React.ElementType;
  value: string;
  description: string;
  color: string;
  onClick: () => void;
}

interface DashboardStatsProps {
  mindmapCount: number;
  materialCount: number;
  starredCount: number;
  activeDataCard: number | null;
  setActiveDataCard: (index: number | null) => void;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  mindmapCount,
  materialCount,
  starredCount,
  activeDataCard,
  setActiveDataCard,
}) => {
  const navigate = useNavigate();

  const stats: StatItem[] = [
    {
      title: "思维导图",
      icon: Brain,
      value: String(mindmapCount),
      description: "个人创建",
      color: "bg-blue-500",
      onClick: () => navigate("/mindmaps"),
    },
    {
      title: "学习资料",
      icon: FileText,
      value: String(materialCount),
      description: "已上传",
      color: "bg-emerald-500",
      onClick: () => navigate("/search"),
    },
    {
      title: "收藏内容",
      icon: Star,
      value: String(starredCount),
      description: "思维导图和资料",
      color: "bg-amber-500",
      onClick: () => navigate("/search?filter=starred"),
    },
    {
      title: "讨论参与",
      icon: MessageSquare,
      value: "24",
      description: "话题和回复",
      color: "bg-purple-500",
      onClick: () => navigate("/discussion"),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          onClick={() => {
            setActiveDataCard(activeDataCard === index ? null : index);
            stat.onClick();
          }}
          className="cursor-pointer"
        >
          <Card className={`glass-card data-card overflow-hidden ${activeDataCard === index ? 'ring-2 ring-primary/50' : ''}`}>
            <CardContent className="p-6 relative">
              <div className="flex justify-between items-start relative z-10">
                <div className="data-preview">
                  <p className="text-sm font-medium tracking-wide">{stat.title}</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <div className="text-xs text-primary/80 font-medium px-1.5 py-0.5 rounded-full bg-primary/10">
                      {index === 0 ? '+2' : index === 1 ? '+5' : index === 2 ? '+3' : '+8'} 今日
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </div>
                <div className="relative">
                  <svg className="progress-ring w-12 h-12" viewBox="0 0 40 40" data-value={index * 25}>
                    <circle 
                      className="progress" 
                      cx="20" 
                      cy="20" 
                      r="15" 
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray="94.2"
                      strokeDashoffset={94.2 - (94.2 * (index + 1) * 20) / 100}
                      style={{ color: `var(--${stat.color.replace('bg-', '')})` }}
                    />
                    <circle 
                      cx="20" 
                      cy="20" 
                      r="15" 
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeOpacity="0.2"
                      style={{ color: `var(--${stat.color.replace('bg-', '')})` }}
                    />
                  </svg>
                  <div className={`absolute inset-0 flex items-center justify-center ${stat.color} text-white rounded-full scale-75`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent flow-highlight"></div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;
