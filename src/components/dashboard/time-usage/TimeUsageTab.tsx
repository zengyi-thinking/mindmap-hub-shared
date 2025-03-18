import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Clock, Activity, Award, RefreshCw } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { formatTime } from '../utils/timeUtils';
import { WeeklyUsageData } from '../types/usage';
import { Button } from '@/components/ui/button';

interface TimeUsageTabProps {
  todayTime: number;
  weekTime: number;
  weeklyData: WeeklyUsageData[];
}

const TimeUsageTab: React.FC<TimeUsageTabProps> = ({ 
  todayTime, 
  weekTime,
  weeklyData 
}) => {
  // 状态
  const [localTodayTime, setLocalTodayTime] = useState(todayTime);
  const [localWeekTime, setLocalWeekTime] = useState(weekTime);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // 当props更新时，更新本地状态
  useEffect(() => {
    setLocalTodayTime(todayTime);
    setLocalWeekTime(weekTime);
  }, [todayTime, weekTime]);

  // 处理手动刷新
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // 触发本地存储事件，让所有组件可以响应
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
    }
    
    // 1秒后结束刷新动画
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };
  
  // 目标使用时间（分钟）
  const dailyTarget = 4 * 60; // 4小时
  const weeklyTarget = 20 * 60; // 20小时
  
  // 计算进度百分比
  const dailyProgressPercent = Math.min((localTodayTime / dailyTarget) * 100, 100);
  const weeklyProgressPercent = Math.min((localWeekTime / weeklyTarget) * 100, 100);
  
  // 确定进度条颜色
  const getDailyProgressColor = () => {
    if (dailyProgressPercent >= 100) return 'bg-green-500';
    if (dailyProgressPercent >= 75) return 'bg-blue-500';
    if (dailyProgressPercent >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };
  
  const getWeeklyProgressColor = () => {
    if (weeklyProgressPercent >= 100) return 'bg-green-500';
    if (weeklyProgressPercent >= 75) return 'bg-blue-500';
    if (weeklyProgressPercent >= 50) return 'bg-purple-500';
    return 'bg-rose-500';
  };
  
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-end mb-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="text-xs flex items-center gap-1"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          刷新数据
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 今日使用时长卡片 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full border-green-100 dark:border-green-900/30">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                  <Clock className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">今日使用时长</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {formatTime(localTodayTime)}
                </span>
                <span className="text-sm text-muted-foreground">今日</span>
              </div>
              <div className="mt-4 h-2 bg-green-100 dark:bg-green-900/30 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getDailyProgressColor()} rounded-full transition-all duration-500 ease-in-out`}
                  style={{ width: `${dailyProgressPercent}%` }}
                ></div>
              </div>
              <div className="mt-1 flex justify-between items-center text-xs text-muted-foreground">
                <span>0%</span>
                <span>每日目标: {formatTime(dailyTarget)}</span>
                <span>100%</span>
              </div>
              {localTodayTime === 0 && (
                <p className="mt-3 text-xs text-muted-foreground text-center">
                  继续使用系统将记录您的活动时间
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        {/* 本周使用时长卡片 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full border-blue-100 dark:border-blue-900/30">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Activity className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">本周使用时长</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {formatTime(localWeekTime)}
                </span>
                <span className="text-sm text-muted-foreground">本周</span>
              </div>
              <div className="mt-4 h-2 bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getWeeklyProgressColor()} rounded-full transition-all duration-500 ease-in-out`}
                  style={{ width: `${weeklyProgressPercent}%` }}
                ></div>
              </div>
              <div className="mt-1 flex justify-between items-center text-xs text-muted-foreground">
                <span>0%</span>
                <span>每周目标: {formatTime(weeklyTarget)}</span>
                <span>100%</span>
              </div>
              {localWeekTime === 0 && (
                <p className="mt-3 text-xs text-muted-foreground text-center">
                  活跃地使用系统将自动累计您的周使用时间
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* 每周使用情况图表 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <Award className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">每周使用情况</CardTitle>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">过去7天的使用时长统计</div>
            </div>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="day" />
                <YAxis label={{ value: '分钟', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value} 分钟`, '使用时长']} />
                <Legend />
                <Bar dataKey="minutes" name="使用时长" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TimeUsageTab; 