
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText } from "lucide-react";

interface DashboardHeaderProps {
  activeSection: "overview" | "usage";
  setActiveSection: (section: "overview" | "usage") => void;
  createMindMap: () => void;
  uploadMaterial: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  activeSection,
  setActiveSection,
  createMindMap,
  uploadMaterial,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative"
    >
      <div className="relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-primary"
        >
          仪表盘
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.1 } }}
          className="text-muted-foreground"
        >
          欢迎回来！这里是您的学习活动概况
        </motion.p>
      </div>
      <div className="flex gap-3 relative z-10">
        <div className="relative">
          <Tabs defaultValue={activeSection} onValueChange={(value) => setActiveSection(value as "overview" | "usage")} className="w-auto">
            <TabsList className="grid w-[250px] grid-cols-2">
              <TabsTrigger value="overview">概览</TabsTrigger>
              <TabsTrigger value="usage">使用报告</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="relative group">
          <Button 
            variant="outline" 
            className="gap-2 btn-effect overflow-hidden relative group-hover:border-primary/50 transition-all duration-300" 
            onClick={createMindMap}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-primary transition-opacity duration-300"></div>
            <Plus className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
            创建思维导图
          </Button>
        </div>
        <div className="relative">
          <Button 
            className="gap-2 btn-effect relative overflow-hidden bg-gradient-primary hover:shadow-lg hover:shadow-primary/20 border-0"
            onClick={uploadMaterial}
          >
            <FileText className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
            上传学习资料
          </Button>
        </div>
        <div className="absolute -z-10 w-32 h-32 rounded-full bg-blue-500/10 blur-3xl -top-10 -right-10 animate-pulse"></div>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
