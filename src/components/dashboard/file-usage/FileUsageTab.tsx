import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart as PieIcon, BarChart as BarIcon, FileText, Info, BookOpen } from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { motion } from 'framer-motion';
import { FileUsageItem, FileUsageDetail } from '../types/usage';

interface FileUsageTabProps {
  fileUsageData: FileUsageItem[];
  fileDetails: FileUsageDetail[];
}

const FileUsageTab: React.FC<FileUsageTabProps> = ({ fileUsageData, fileDetails }) => {
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  const [showDetails, setShowDetails] = useState(false);
  
  // 计算文件总数
  const totalFiles = fileUsageData.reduce((sum, item) => sum + item.value, 0);
  
  // 格式化文件使用次数为更友好的显示
  const formatFileUsageCount = (count: number) => {
    if (count === 0) return '无文件';
    return `${count} 份文件`;
  };

  // 格式化百分比
  const formatPercent = (value: number) => {
    if (totalFiles === 0) return '0%';
    return `${Math.round((value / totalFiles) * 100)}%`;
  };
  
  // 格式化最后访问时间
  const formatLastAccessed = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 图表类型切换 */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground flex items-center">
          <Info className="h-4 w-4 mr-1" />
          <span>共统计了 {totalFiles} 份文件的使用情况</span>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={chartType === "pie" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setChartType("pie")}
            className="gap-1"
          >
            <PieIcon className="h-4 w-4" />
            饼图
          </Button>
          <Button 
            variant={chartType === "bar" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setChartType("bar")}
            className="gap-1"
          >
            <BarIcon className="h-4 w-4" />
            柱状图
          </Button>
        </div>
      </div>
      
      {/* 图表 */}
      <motion.div 
        className="h-80"
        key={chartType}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {chartType === "pie" ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={fileUsageData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${formatPercent(value)}`}
              >
                {fileUsageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [formatFileUsageCount(value as number), '数量']} />
              <Legend formatter={(value) => `${value}`} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={fileUsageData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [formatFileUsageCount(value as number), '数量']} />
              <Legend />
              <Bar dataKey="value" name="文件数量">
                {fileUsageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>
      
      {/* 文件使用汇总卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
        <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
              <FileText className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <CardTitle className="text-lg">文件使用汇总</CardTitle>
              <CardDescription>根据使用频率分类</CardDescription>
            </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowDetails(!showDetails)} 
                className="gap-1"
              >
                <BookOpen className="h-4 w-4" />
                {showDetails ? '隐藏详情' : '查看详情'}
              </Button>
          </div>
        </CardHeader>
        <CardContent>
            <ul className="space-y-3">
            {fileUsageData.map((item, index) => (
                <li key={index} className="flex justify-between items-center p-2 rounded-md hover:bg-muted transition-colors">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="font-medium">{item.name}</span>
                </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{formatFileUsageCount(item.value)}</span>
                    <span className="text-sm text-muted-foreground">{formatPercent(item.value)}</span>
                </div>
              </li>
            ))}
          </ul>
            
            {/* 文件使用详情 */}
            {showDetails && fileDetails.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 border-t pt-4"
              >
                <h4 className="text-sm font-medium mb-2">最近使用的文件详情</h4>
                <div className="max-h-60 overflow-y-auto pr-2">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-muted-foreground">
                        <th className="pb-2">文件名</th>
                        <th className="pb-2">使用次数</th>
                        <th className="pb-2">最后访问</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fileDetails.slice(0, 10).map((file, index) => (
                        <tr key={index} className="border-b border-border/50 last:border-0">
                          <td className="py-2 truncate max-w-[12rem]">{file.fileName}</td>
                          <td className="py-2">{file.clicks} 次</td>
                          <td className="py-2 text-xs">{formatLastAccessed(file.lastAccessed)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
        </CardContent>
      </Card>
      </motion.div>
    </div>
  );
};

export default FileUsageTab;