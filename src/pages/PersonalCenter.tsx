import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Lock, 
  Mail, 
  Calendar, 
  Save, 
  FileText, 
  Clock, 
  BellRing, 
  Eye, 
  LogOut,
  BookOpen,
  Upload,
  Heart,
  MessageSquare,
  Download
} from 'lucide-react';

interface ActivityItem {
  id: number;
  type: string;
  title: string;
  date: string;
  icon: any;
  iconColor: string;
}

const PersonalCenter = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState({
    username: '学习达人',
    email: 'user@example.com',
    avatar: '',
    bio: '热爱学习，喜欢分享知识和经验。专注于计算机科学和数据分析领域。',
    joinDate: '2023-01-15',
    totalUploads: 36,
    totalDownloads: 128,
    totalMindMaps: 12,
    totalComments: 45
  });
  
  const [formData, setFormData] = useState({
    username: userProfile.username,
    email: userProfile.email,
    bio: userProfile.bio,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifyOnComment: true,
    notifyOnLike: true,
    notifyOnShare: true,
    notifyOnUpdate: false
  });
  
  const activities: ActivityItem[] = [
    { 
      id: 1, 
      type: '上传资料', 
      title: '数据结构与算法基础教程', 
      date: '2023-06-15 14:30', 
      icon: Upload,
      iconColor: 'bg-green-500'
    },
    { 
      id: 2, 
      type: '创建思维导图', 
      title: '期末复习计划', 
      date: '2023-06-10 09:15', 
      icon: FileText,
      iconColor: 'bg-blue-500'
    },
    { 
      id: 3, 
      type: '下载资料', 
      title: '操作系统概念图解', 
      date: '2023-06-08 16:45', 
      icon: Download,
      iconColor: 'bg-purple-500'
    },
    { 
      id: 4, 
      type: '收藏资料', 
      title: '高等数学思维导图合集', 
      date: '2023-06-05 11:20', 
      icon: Heart,
      iconColor: 'bg-red-500'
    },
    { 
      id: 5, 
      type: '评论话题', 
      title: '如何有效利用思维导图进行期末复习？', 
      date: '2023-06-03 13:10', 
      icon: MessageSquare,
      iconColor: 'bg-amber-500'
    }
  ];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };
  
  const handleProfileUpdate = () => {
    // 实际应用中，这里应该调用API更新用户个人资料
    setUserProfile({
      ...userProfile,
      username: formData.username,
      email: formData.email,
      bio: formData.bio
    });
    
    alert('个人资料已更新');
  };
  
  const handlePasswordChange = () => {
    // 实际应用中，这里应该验证旧密码并更新新密码
    if (formData.newPassword !== formData.confirmPassword) {
      alert('新密码和确认密码不匹配');
      return;
    }
    
    if (formData.newPassword.length < 6) {
      alert('新密码长度不能少于6个字符');
      return;
    }
    
    alert('密码已成功更新');
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">个人中心</h1>
        <p className="text-muted-foreground">管理您的个人信息和设置</p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-1"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl">{userProfile.username[0]}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h2 className="text-xl font-bold">{userProfile.username}</h2>
                  <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    加入时间：{userProfile.joinDate}
                  </p>
                </div>
                
                <div className="w-full border rounded-lg p-4 mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4 text-green-500" />
                      <span className="text-sm">上传资料</span>
                    </div>
                    <span className="font-medium">{userProfile.totalUploads}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">思维导图</span>
                    </div>
                    <span className="font-medium">{userProfile.totalMindMaps}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">下载次数</span>
                    </div>
                    <span className="font-medium">{userProfile.totalDownloads}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-amber-500" />
                      <span className="text-sm">评论数量</span>
                    </div>
                    <span className="font-medium">{userProfile.totalComments}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-3"
        >
          <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="profile">个人资料</TabsTrigger>
              <TabsTrigger value="security">安全设置</TabsTrigger>
              <TabsTrigger value="activity">活动历史</TabsTrigger>
              <TabsTrigger value="notifications">通知设置</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>个人资料</CardTitle>
                  <CardDescription>更新您的个人信息</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">用户名</Label>
                      <Input 
                        id="username" 
                        name="username"
                        value={formData.username} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">电子邮箱</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email"
                        value={formData.email} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">个人简介</Label>
                    <Textarea 
                      id="bio" 
                      name="bio"
                      rows={4}
                      value={formData.bio} 
                      onChange={handleInputChange} 
                      placeholder="介绍一下你自己..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>头像</Label>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback>{formData.username[0]}</AvatarFallback>
                      </Avatar>
                      <Button variant="outline">更换头像</Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="gap-2" onClick={handleProfileUpdate}>
                    <Save className="h-4 w-4" />
                    保存修改
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>安全设置</CardTitle>
                  <CardDescription>管理您的账户安全信息</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">当前密码</Label>
                    <Input 
                      id="currentPassword" 
                      name="currentPassword"
                      type="password" 
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">新密码</Label>
                    <Input 
                      id="newPassword" 
                      name="newPassword"
                      type="password" 
                      value={formData.newPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">确认新密码</Label>
                    <Input 
                      id="confirmPassword" 
                      name="confirmPassword"
                      type="password" 
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                  <Separator />
                  <div className="pt-2">
                    <Button variant="destructive" className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      退出登录
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="gap-2" onClick={handlePasswordChange}>
                    <Save className="h-4 w-4" />
                    更新密码
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>活动历史</CardTitle>
                  <CardDescription>您最近的活动记录</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4">
                        <div className={`${activity.iconColor} p-2 rounded-full`}>
                          <activity.icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <Badge variant="outline">{activity.type}</Badge>
                              <h4 className="text-base font-medium mt-1">{activity.title}</h4>
                            </div>
                            <span className="text-xs text-muted-foreground">{activity.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button variant="outline">查看更多活动记录</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>通知设置</CardTitle>
                  <CardDescription>管理您的通知偏好</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>评论通知</Label>
                      <p className="text-sm text-muted-foreground">当有人评论您的内容时通知您</p>
                    </div>
                    <Switch 
                      checked={formData.notifyOnComment}
                      onCheckedChange={(checked) => handleSwitchChange('notifyOnComment', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>点赞通知</Label>
                      <p className="text-sm text-muted-foreground">当有人点赞您的内容时通知您</p>
                    </div>
                    <Switch 
                      checked={formData.notifyOnLike}
                      onCheckedChange={(checked) => handleSwitchChange('notifyOnLike', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>分享通知</Label>
                      <p className="text-sm text-muted-foreground">当有人分享您的内容时通知您</p>
                    </div>
                    <Switch 
                      checked={formData.notifyOnShare}
                      onCheckedChange={(checked) => handleSwitchChange('notifyOnShare', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>平台更新</Label>
                      <p className="text-sm text-muted-foreground">接收平台新功能和更新通知</p>
                    </div>
                    <Switch 
                      checked={formData.notifyOnUpdate}
                      onCheckedChange={(checked) => handleSwitchChange('notifyOnUpdate', checked)}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="gap-2">
                    <Save className="h-4 w-4" />
                    保存设置
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default PersonalCenter;
