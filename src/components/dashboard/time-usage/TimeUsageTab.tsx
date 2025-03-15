
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Clock, BarChart3 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { formatTime } from '../utils/timeUtils';

type TimeUsageTabProps = {
  todayTime: number;
  weekTime: number;
};

const TimeUsageTab: React.FC<TimeUsageTabProps> = ({ todayTime, weekTime }) => {
  return (
    <div className="mt-0 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Clock className="h-5 w-5 text-blue-500" />
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
            <div className="text-sm text-muted-foreground">过去7天的使用时长统计</div>
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
    </div>
  );
};

export default TimeUsageTab;
