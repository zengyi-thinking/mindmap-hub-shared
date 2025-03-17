import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

// 导入Tab组件
import TimeUsageTab from './time-usage/TimeUsageTab';
import FileUsageTab from './file-usage/FileUsageTab';
import ReflectionTab from './reflection/ReflectionTab';

// 导入服务
import { usageTimeService, fileUsageService, reflectionService } from './services/usageService';

// 钩子：处理页面可见性变化
const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    // 仅在浏览器环境执行
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
    return undefined;
  }, []);

  return isVisible;
};

const UsageReport: React.FC = () => {
  const { toast } = useToast();
  const isPageVisible = usePageVisibility();
  const [activeTab, setActiveTab] = useState<"time" | "files" | "reflection">("time");
  
  // 使用时间状态
  const [timeData, setTimeData] = useState(() => {
    try {
      return usageTimeService.getTimeData();
    } catch (error) {
      console.error('获取使用时间数据失败:', error);
      return { todayTime: 0, weekTime: 0, lastUpdate: new Date().toISOString(), dailyRecords: {} };
    }
  });
  
  const [weeklyData, setWeeklyData] = useState(() => {
    try {
      return usageTimeService.getWeeklyData();
    } catch (error) {
      console.error('获取每周数据失败:', error);
      return [];
    }
  });
  
  // 文件使用状态
  const [fileUsageData, setFileUsageData] = useState(() => {
    try {
      return fileUsageService.getFileUsageStats();
    } catch (error) {
      console.error('获取文件使用统计失败:', error);
      return [
        { name: '使用1次', value: 0, color: '#8884d8' },
        { name: '使用2-5次', value: 0, color: '#82ca9d' },
        { name: '使用超过5次', value: 0, color: '#ffc658' },
      ];
    }
  });
  
  const [fileDetails, setFileDetails] = useState(() => {
    try {
      return fileUsageService.getFileUsageDetails();
    } catch (error) {
      console.error('获取文件详情失败:', error);
      return [];
    }
  });
  
  // 反思状态
  const [reflection, setReflection] = useState(() => {
    try {
      return reflectionService.getReflection();
    } catch (error) {
      console.error('获取反思数据失败:', error);
      return { content: '', lastUpdated: new Date().toISOString() };
    }
  });
  
  // 追踪活动时间
  useEffect(() => {
    let intervalId: number | undefined;
    
    try {
      if (isPageVisible) {
        // 记录活动开始
        usageTimeService.recordActivity('active');
        
        // 定期更新使用时间 (每分钟检查一次)
        intervalId = window.setInterval(() => {
          try {
            // 检索最新数据并更新状态
            const updatedTimeData = usageTimeService.getTimeData();
            setTimeData(updatedTimeData);
            
            // 更新周数据
            const updatedWeeklyData = usageTimeService.getWeeklyData();
            setWeeklyData(updatedWeeklyData);
          } catch (error) {
            console.error('更新时间数据失败:', error);
          }
        }, 60000);
      } else if (typeof usageTimeService !== 'undefined') {
        // 记录不活动
        usageTimeService.recordActivity('inactive');
      }
    } catch (error) {
      console.error('活动记录失败:', error);
    }
    
    // 清理定时器
    return () => {
      if (intervalId) {
      clearInterval(intervalId);
      }
      
      // 在组件卸载时记录不活动
      try {
        if (typeof usageTimeService !== 'undefined') {
          usageTimeService.recordActivity('inactive');
        }
      } catch (error) {
        console.error('记录不活动状态失败:', error);
      }
    };
  }, [isPageVisible]);
  
  // 监听本地存储变化
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      try {
        if (e.key && e.key.includes('file_usage')) {
          setFileUsageData(fileUsageService.getFileUsageStats());
          setFileDetails(fileUsageService.getFileUsageDetails());
        }
      } catch (error) {
        console.error('处理存储变化事件失败:', error);
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
    return undefined;
  }, []);
  
  // 保存反思
  const handleSaveReflection = (content: string) => {
    try {
      reflectionService.saveReflection(content);
      setReflection(reflectionService.getReflection());
      
    toast({
      title: "保存成功",
      description: "您的反思已保存",
    });
    } catch (error) {
      console.error('保存反思失败:', error);
      toast({
        title: "保存失败",
        description: "请稍后重试",
        variant: "destructive"
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="overflow-hidden backdrop-blur-sm border border-primary/10">
        <CardHeader className="pb-2 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-blue-950/20 dark:to-indigo-950/20 border-b border-primary/10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle className="text-xl font-semibold tracking-tight">使用报告</CardTitle>
              <CardDescription>查看您的学习统计和反思</CardDescription>
            </div>
            <Tabs 
              defaultValue="time" 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as any)}
              className="w-full md:w-auto"
            >
              <TabsList className="grid w-full grid-cols-3 h-8">
                <TabsTrigger value="time" className="text-xs px-2">使用时长</TabsTrigger>
                <TabsTrigger value="files" className="text-xs px-2">文件统计</TabsTrigger>
                <TabsTrigger value="reflection" className="text-xs px-2">学习反思</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {activeTab === "time" && (
            <TimeUsageTab 
              todayTime={timeData.todayTime} 
              weekTime={timeData.weekTime}
              weeklyData={weeklyData}
            />
          )}

          {activeTab === "files" && (
            <FileUsageTab 
              fileUsageData={fileUsageData}
              fileDetails={fileDetails}
            />
          )}

          {activeTab === "reflection" && (
            <ReflectionTab 
              reflection={reflection}
              onSave={handleSaveReflection}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UsageReport;