import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Clock, Activity, Award } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { formatTime } from '../utils/timeUtils';
import { WeeklyUsageData } from '../types/usage';

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
  // 目标使用时间（分钟）
  const dailyTarget = 4 * 60; // 4小时
  const weeklyTarget = 20 * 60; // 20小时
  
  // 计算进度百分比
  const dailyProgressPercent = Math.min((todayTime / dailyTarget) * 100, 100);
  const weeklyProgressPercent = Math.min((weekTime / weeklyTarget) * 100, 100);
  
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 今日使用时长卡片 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full">
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
                  {formatTime(todayTime)}
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
            </CardContent>
          </Card>
        </motion.div>
        
        {/* 本周使用时长卡片 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
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
                  {formatTime(weekTime)}
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