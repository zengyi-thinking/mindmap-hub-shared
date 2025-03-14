
import React from 'react';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ActivityIcon, ClockIcon, UserIcon, ShieldIcon } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const UserActivityLogs: React.FC = () => {
  const { getUserLogs, user } = useAuth();
  const logs = getUserLogs();
  
  if (!user) {
    return null;
  }
  
  // 将日志按日期分组
  const groupedLogs: Record<string, typeof logs> = {};
  logs.forEach(log => {
    const date = log.timestamp.split('T')[0]; // 获取日期部分 YYYY-MM-DD
    if (!groupedLogs[date]) {
      groupedLogs[date] = [];
    }
    groupedLogs[date].push(log);
  });
  
  // 日期数组（从新到旧排序）
  const dates = Object.keys(groupedLogs).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  // 根据操作类型获取图标
  const getActionIcon = (action: string) => {
    switch (action) {
      case '登录':
        return <UserIcon className="h-4 w-4 text-green-500" />;
      case '登出':
        return <UserIcon className="h-4 w-4 text-amber-500" />;
      case '更新资料':
        return <ActivityIcon className="h-4 w-4 text-blue-500" />;
      case '会话恢复':
        return <ShieldIcon className="h-4 w-4 text-purple-500" />;
      default:
        return <ActivityIcon className="h-4 w-4 text-gray-500" />;
    }
  };
  
  return (
    <Card className="border-primary/20">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-t-lg border-b border-primary/10">
        <CardTitle className="flex items-center gap-2">
          <ActivityIcon className="h-5 w-5 text-primary" />
          账户活动记录
        </CardTitle>
        <CardDescription>
          查看您的账户活动历史，所有操作均受到严格隔离保护
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="p-6">
            {dates.length > 0 ? (
              dates.map(date => (
                <div key={date} className="mb-6 last:mb-0">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1.5" />
                    {format(new Date(date), 'yyyy年MM月dd日', { locale: zhCN })}
                  </h3>
                  
                  <div className="space-y-3 pl-2">
                    {groupedLogs[date]
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .map(log => (
                        <div 
                          key={log.id} 
                          className="relative pl-5 border-l border-border pb-3 last:pb-0"
                        >
                          {/* 时间线上的点 */}
                          <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-primary/20 border-2 border-primary"></div>
                          
                          {/* 日志内容 */}
                          <div className="flex flex-col">
                            <div className="flex items-center text-sm font-medium">
                              {getActionIcon(log.action)}
                              <span className="ml-2">{log.action}</span>
                              <span className="ml-auto text-xs text-muted-foreground">
                                {format(new Date(log.timestamp), 'HH:mm:ss')}
                              </span>
                            </div>
                            
                            {log.details && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {log.details}
                              </p>
                            )}
                            
                            {log.ip && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                IP: {log.ip}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-6">
                暂无活动记录
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default UserActivityLogs;
