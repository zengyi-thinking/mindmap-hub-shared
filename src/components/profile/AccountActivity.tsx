import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Activity, LogOut, Monitor } from 'lucide-react';

// 模拟的账户活动数据
const mockActivities = [
  {
    id: 1,
    action: '登录成功',
    device: 'Chrome on Windows',
    location: '北京, 中国',
    ip: '123.45.67.89',
    date: '2023-08-15 14:30:22',
    status: 'success'
  },
  {
    id: 2,
    action: '编辑思维导图',
    device: 'Safari on MacOS',
    location: '上海, 中国',
    ip: '98.76.54.32',
    date: '2023-08-14 09:15:45',
    status: 'success'
  },
  {
    id: 3,
    action: '导出思维导图',
    device: 'Firefox on Ubuntu',
    location: '广州, 中国',
    ip: '111.222.333.444',
    date: '2023-08-12 18:05:11',
    status: 'success'
  },
  {
    id: 4,
    action: '登录尝试',
    device: 'Chrome on Android',
    location: '未知',
    ip: '55.66.77.88',
    date: '2023-08-10 22:45:30',
    status: 'warning'
  },
  {
    id: 5,
    action: '密码修改',
    device: 'Edge on Windows',
    location: '深圳, 中国',
    ip: '11.22.33.44',
    date: '2023-08-05 11:20:15',
    status: 'success'
  }
];

// 模拟的登录会话数据
const mockSessions = [
  {
    id: 1,
    device: 'Chrome on Windows',
    location: '北京, 中国',
    ip: '123.45.67.89',
    lastActive: '刚刚',
    current: true
  },
  {
    id: 2,
    device: 'Safari on iPhone',
    location: '杭州, 中国',
    ip: '98.76.54.32',
    lastActive: '1 小时前',
    current: false
  },
  {
    id: 3,
    device: 'Chrome on Android',
    location: '武汉, 中国',
    ip: '111.222.333.444',
    lastActive: '2 天前',
    current: false
  }
];

const AccountActivity: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">账户活动</h2>
        <p className="text-muted-foreground">查看您的登录会话和账户活动记录</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Monitor className="h-5 w-5 mr-2 text-primary" />
            当前登录会话
          </CardTitle>
          <CardDescription>
            这些是您当前的活跃登录会话
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>设备</TableHead>
                <TableHead>位置</TableHead>
                <TableHead>IP地址</TableHead>
                <TableHead>最后活动</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSessions.map(session => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">
                    {session.device}
                    {session.current && (
                      <Badge className="ml-2" variant="outline">当前</Badge>
                    )}
                  </TableCell>
                  <TableCell>{session.location}</TableCell>
                  <TableCell>{session.ip}</TableCell>
                  <TableCell>{session.lastActive}</TableCell>
                  <TableCell>
                    {!session.current && (
                      <button className="flex items-center text-sm text-destructive hover:underline">
                        <LogOut className="h-4 w-4 mr-1" />
                        注销
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2 text-primary" />
            最近活动
          </CardTitle>
          <CardDescription>
            您账户的最近活动记录
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>活动</TableHead>
                <TableHead>设备</TableHead>
                <TableHead>位置</TableHead>
                <TableHead>IP地址</TableHead>
                <TableHead>时间</TableHead>
                <TableHead>状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockActivities.map(activity => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.action}</TableCell>
                  <TableCell>{activity.device}</TableCell>
                  <TableCell>{activity.location}</TableCell>
                  <TableCell>{activity.ip}</TableCell>
                  <TableCell>{activity.date}</TableCell>
                  <TableCell>
                    <Badge variant={activity.status === 'success' ? 'success' : 'warning'}>
                      {activity.status === 'success' ? '成功' : '警告'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountActivity; 