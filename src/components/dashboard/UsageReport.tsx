
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ChartPie, FileText, MessageSquare, Info, Save } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

// Mock usage time data - in a real app this would come from a service
const usageTimeService = {
  getTodayTime: () => {
    // Get stored time or default to 0
    const storedTime = localStorage.getItem('todayUsageTime');
    return storedTime ? parseInt(storedTime, 10) : 0;
  },
  getWeekTime: () => {
    // Get stored weekly time or default to 0
    const storedTime = localStorage.getItem('weekUsageTime');
    return storedTime ? parseInt(storedTime, 10) : 0;
  },
  saveTime: (today: number, week: number) => {
    localStorage.setItem('todayUsageTime', today.toString());
    localStorage.setItem('weekUsageTime', week.toString());
  }
};

// Mock file usage data - in a real app this would come from a service
const fileUsageService = {
  getFileUsageStats: () => {
    // Get stored stats or return default
    const storedStats = localStorage.getItem('fileUsageStats');
    if (storedStats) {
      return JSON.parse(storedStats);
    }
    
    // Default mock data
    return [
      { name: '使用1次', value: 30, color: '#8884d8' },
      { name: '使用2-5次', value: 45, color: '#82ca9d' },
      { name: '使用超过5次', value: 25, color: '#ffc658' },
    ];
  }
};

// Mock reflection data service
const reflectionService = {
  getReflection: () => {
    return localStorage.getItem('userReflection') || '';
  },
  saveReflection: (text: string) => {
    localStorage.setItem('userReflection', text);
  }
};

// Format minutes into hours and minutes
const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}分钟`;
  }
  
  return `${hours}小时${mins > 0 ? ` ${mins}分钟` : ''}`;
};

const UsageReport: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"time" | "files" | "reflection">("time");
  const [todayTime, setTodayTime] = useState(usageTimeService.getTodayTime());
  const [weekTime, setWeekTime] = useState(usageTimeService.getWeekTime());
  const [timeStarted, setTimeStarted] = useState<number | null>(null);
  const [fileUsageData, setFileUsageData] = useState(fileUsageService.getFileUsageStats());
  const [reflection, setReflection] = useState(reflectionService.getReflection());
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");

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

  // Colors for the chart
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

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
          <TabsContent value="time" className="mt-0 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <Calendar className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">今日使用时长</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold">{formatTime(todayTime)}</span>
                    <span className="text-sm text-muted-foreground">今日</span>
                  </div>
                  <div className="mt-4 h-2 bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${Math.min(todayTime / (4 * 60) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground text-right">
                    每日目标: 4小时
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                      <Clock className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">本周使用时长</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold">{formatTime(weekTime)}</span>
                    <span className="text-sm text-muted-foreground">本周</span>
                  </div>
                  <div className="mt-4 h-2 bg-purple-100 dark:bg-purple-900/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 rounded-full" 
                      style={{ width: `${Math.min(weekTime / (20 * 60) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground text-right">
                    每周目标: 20小时
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-center mt-6">
              <Card className="w-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">每周使用情况</CardTitle>
                  <CardDescription>过去7天的使用时长统计</CardDescription>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: '周一', 时长: 120 },
                        { name: '周二', 时长: 180 },
                        { name: '周三', 时长: 150 },
                        { name: '周四', 时长: 210 },
                        { name: '周五', 时长: 90 },
                        { name: '周六', 时长: 75 },
                        { name: '周日', 时长: weekTime > 60 ? weekTime - 825 : 60 }, // Dynamic for today
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: '分钟', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={(value) => [`${value} 分钟`, '使用时长']} />
                      <Legend />
                      <Bar dataKey="时长" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="files" className="mt-0 space-y-4">
            <div className="flex justify-end mb-4">
              <div className="flex gap-2">
                <Button 
                  variant={chartType === "pie" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setChartType("pie")}
                >
                  <ChartPie className="h-4 w-4 mr-1" />
                  饼图
                </Button>
                <Button 
                  variant={chartType === "bar" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setChartType("bar")}
                >
                  <ChartPie className="h-4 w-4 mr-1" />
                  柱状图
                </Button>
              </div>
            </div>
            
            <div className="h-80">
              <ChartContainer
                config={{
                  使用1次: { color: COLORS[0] },
                  使用2_5次: { color: COLORS[1] },
                  使用超过5次: { color: COLORS[2] },
                }}
                className="w-full h-full"
              >
                {chartType === "pie" ? (
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie
                      data={fileUsageData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {fileUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartLegend content={<ChartLegendContent className="mt-4" />} />
                  </PieChart>
                ) : (
                  <BarChart
                    data={fileUsageData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" name="文件数">
                      {fileUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                    <ChartLegend content={<ChartLegendContent className="mt-4" />} />
                  </BarChart>
                )}
              </ChartContainer>
            </div>
            
            <Card className="mt-6">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                    <FileText className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">文件使用汇总</CardTitle>
                    <CardDescription>根据使用频率分类</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {fileUsageData.map((item, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span>{item.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{item.value}</span>
                        <span className="text-sm text-muted-foreground">份文件</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reflection" className="mt-0 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                    <MessageSquare className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">学习反思</CardTitle>
                    <CardDescription>记录您的学习心得和总结</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Info className="h-4 w-4 mr-1" />
                  <span>您的反思将被保存，并且只有您能看到</span>
                </div>
                <Textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="在这里记录您的学习反思和总结..."
                  className="min-h-[200px] resize-none"
                />
                <div className="flex justify-end mt-4">
                  <Button onClick={saveReflection} className="gap-2">
                    <Save className="h-4 w-4" />
                    保存反思
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UsageReport;
