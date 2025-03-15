
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

// Import refactored components
import TimeUsageTab from './time-usage/TimeUsageTab';
import FileUsageTab from './file-usage/FileUsageTab';
import ReflectionTab from './reflection/ReflectionTab';

// Import services
import { usageTimeService, fileUsageService, reflectionService } from './services/usageServices';

const UsageReport: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"time" | "files" | "reflection">("time");
  const [todayTime, setTodayTime] = useState(usageTimeService.getTodayTime());
  const [weekTime, setWeekTime] = useState(usageTimeService.getWeekTime());
  const [timeStarted, setTimeStarted] = useState<number | null>(null);
  const [fileUsageData, setFileUsageData] = useState(fileUsageService.getFileUsageStats());
  const [reflection, setReflection] = useState(reflectionService.getReflection());

  // Timer effect to track active time
  useEffect(() => {
    // Start timing when component mounts
    const startTime = Date.now();
    setTimeStarted(startTime);
    
    // Check every minute to update the time
    const intervalId = setInterval(() => {
      if (timeStarted) {
        const currentTime = Date.now();
        const sessionMinutes = Math.floor((currentTime - timeStarted) / 60000);
        
        if (sessionMinutes > 0) {
          const newTodayTime = todayTime + sessionMinutes;
          const newWeekTime = weekTime + sessionMinutes;
          
          setTodayTime(newTodayTime);
          setWeekTime(newWeekTime);
          setTimeStarted(currentTime);
          
          // Save to localStorage
          usageTimeService.saveTime(newTodayTime, newWeekTime);
        }
      }
    }, 60000); // Check every minute
    
    // Clean up interval and save final time
    return () => {
      clearInterval(intervalId);
      if (timeStarted) {
        const currentTime = Date.now();
        const sessionMinutes = Math.floor((currentTime - timeStarted) / 60000);
        
        if (sessionMinutes > 0) {
          const newTodayTime = todayTime + sessionMinutes;
          const newWeekTime = weekTime + sessionMinutes;
          
          // Save final time
          usageTimeService.saveTime(newTodayTime, newWeekTime);
        }
      }
    };
  }, [timeStarted, todayTime, weekTime]);

  // Save reflection
  const saveReflection = () => {
    reflectionService.saveReflection(reflection);
    toast({
      title: "保存成功",
      description: "您的反思已保存",
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-2 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-blue-950/20 dark:to-indigo-950/20 border-b border-primary/10">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-semibold tracking-tight">使用报告</CardTitle>
              <CardDescription>查看您的学习统计和反思</CardDescription>
            </div>
            <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
              <TabsList className="grid w-full grid-cols-3 h-8">
                <TabsTrigger value="time" className="text-xs px-2">使用时长</TabsTrigger>
                <TabsTrigger value="files" className="text-xs px-2">文件统计</TabsTrigger>
                <TabsTrigger value="reflection" className="text-xs px-2">学习反思</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <TabsContent value="time" className="mt-0">
            <TimeUsageTab todayTime={todayTime} weekTime={weekTime} />
          </TabsContent>

          <TabsContent value="files" className="mt-0">
            <FileUsageTab fileUsageData={fileUsageData} />
          </TabsContent>

          <TabsContent value="reflection" className="mt-0">
            <ReflectionTab 
              reflection={reflection} 
              setReflection={setReflection} 
              saveReflection={saveReflection}
            />
          </TabsContent>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UsageReport;
