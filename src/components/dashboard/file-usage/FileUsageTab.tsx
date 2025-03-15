
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, ChartPie, FileText } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

type FileUsageItem = {
  name: string;
  value: number;
  color: string;
};

type FileUsageTabProps = {
  fileUsageData: FileUsageItem[];
};

const FileUsageTab: React.FC<FileUsageTabProps> = ({ fileUsageData }) => {
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  
  // Colors for the chart
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

  return (
    <div className="mt-0 space-y-4">
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
            <BarChart3 className="h-4 w-4 mr-1" />
            柱状图
          </Button>
        </div>
      </div>
      
      <div className="h-80">
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
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {fileUsageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} 份文件`, name]} />
              <Legend />
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
              <Tooltip formatter={(value) => [`${value} 份文件`, '文件数']} />
              <Legend />
              <Bar dataKey="value" name="文件数">
                {fileUsageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
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
    </div>
  );
};

export default FileUsageTab;
