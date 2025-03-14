
import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Clock, RefreshCw, Check, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserProfileForm: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  
  // 跟踪修改状态
  const [fieldStatus, setFieldStatus] = useState<{
    [key: string]: 'unchanged' | 'changed' | 'syncing' | 'synced';
  }>({
    username: 'unchanged',
    email: 'unchanged',
    phone: 'unchanged',
    bio: 'unchanged',
    avatar: 'unchanged'
  });
  
  const handleInputChange = (field: string, value: string) => {
    // 更新对应的状态
    switch (field) {
      case 'username':
        setUsername(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'phone':
        setPhone(value);
        break;
      case 'bio':
        setBio(value);
        break;
    }
    
    // 标记字段为已修改
    setFieldStatus(prev => ({
      ...prev,
      [field]: user ? (
        field === 'username' ? (value !== user.username ? 'changed' : 'unchanged') :
        field === 'email' ? (value !== user.email ? 'changed' : 'unchanged') :
        field === 'phone' ? (value !== user.phone ? 'changed' : 'unchanged') :
        field === 'bio' ? (value !== user.bio ? 'changed' : 'unchanged') :
        'unchanged'
      ) : 'unchanged'
    }));
  };
  
  const handleAvatarChange = (dataUrl: string) => {
    setAvatarUrl(dataUrl);
    setFieldStatus(prev => ({
      ...prev,
      avatar: 'changed'
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsUpdating(true);
    setUpdateMessage("正在更新个人资料...");
    
    // 设置所有已修改的字段为同步中状态
    Object.keys(fieldStatus).forEach(key => {
      if (fieldStatus[key] === 'changed') {
        setFieldStatus(prev => ({
          ...prev,
          [key]: 'syncing'
        }));
      }
    });
    
    try {
      // 构建要更新的用户数据
      const updates: Partial<typeof user> = {};
      
      if (username !== user.username) updates.username = username;
      if (email !== user.email) updates.email = email;
      if (phone !== user.phone) updates.phone = phone;
      if (bio !== user.bio) updates.bio = bio;
      if (avatarUrl !== user.avatar) updates.avatar = avatarUrl;
      
      // 更新用户资料
      const success = await updateUserProfile(updates);
      
      if (success) {
        setUpdateMessage("个人资料已更新，所有设备已同步完成");
        
        // 将所有同步中的字段标记为已同步
        setFieldStatus(prev => {
          const newStatus = { ...prev };
          Object.keys(newStatus).forEach(key => {
            if (newStatus[key] === 'syncing') {
              newStatus[key] = 'synced';
            }
          });
          return newStatus;
        });
        
        // 5秒后清除同步状态
        setTimeout(() => {
          setFieldStatus(prev => {
            const newStatus = { ...prev };
            Object.keys(newStatus).forEach(key => {
              if (newStatus[key] === 'synced') {
                newStatus[key] = 'unchanged';
              }
            });
            return newStatus;
          });
          setUpdateMessage(null);
        }, 5000);
      } else {
        setUpdateMessage("更新失败，请稍后重试");
      }
    } catch (error) {
      console.error("更新资料时出错:", error);
      setUpdateMessage("更新时发生错误，请稍后重试");
    } finally {
      setIsUpdating(false);
    }
  };
  
  const getStatusIcon = (status: 'unchanged' | 'changed' | 'syncing' | 'synced') => {
    switch (status) {
      case 'unchanged':
        return null;
      case 'changed':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'syncing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'synced':
        return <Check className="h-4 w-4 text-green-500" />;
    }
  };
  
  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>未登录</CardTitle>
          <CardDescription>请先登录后查看个人资料</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-primary/20">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-t-lg border-b border-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                个人资料
                <Shield className="h-4 w-4 text-green-500" />
              </CardTitle>
              <CardDescription className="mt-1.5">
                更新您的个人资料信息，所有更改将实时同步到全部设备
              </CardDescription>
            </div>
            
            <div className="flex items-center text-sm bg-green-50 dark:bg-green-950/30 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-900">
              <Lock className="h-3.5 w-3.5 mr-1.5 text-green-600 dark:text-green-400" />
              <span className="text-green-700 dark:text-green-300">数据隔离保护中</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          <AnimatePresence>
            {updateMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Alert 
                  className={`mb-4 ${
                    updateMessage.includes('已更新') 
                      ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950/30 dark:border-green-900 dark:text-green-300' 
                      : updateMessage.includes('更新失败') || updateMessage.includes('错误')
                      ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-900 dark:text-red-300'
                      : 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:border-blue-900 dark:text-blue-300'
                  }`}
                >
                  {updateMessage.includes('已更新') ? (
                    <Check className="h-4 w-4" />
                  ) : updateMessage.includes('更新失败') || updateMessage.includes('错误') ? (
                    <AlertDescription>
                      {updateMessage}
                    </AlertDescription>
                  ) : (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  )}
                  <AlertDescription>
                    {updateMessage}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
          
          <form onSubmit={handleSubmit}>
            {/* 头像上传 */}
            <div className="mb-6">
              <AvatarUpload
                currentAvatar={avatarUrl}
                username={username}
                onAvatarChange={handleAvatarChange}
              />
              
              {fieldStatus.avatar !== 'unchanged' && (
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  {getStatusIcon(fieldStatus.avatar)}
                  <span className="ml-1">
                    {fieldStatus.avatar === 'changed' && '头像已修改，待同步'}
                    {fieldStatus.avatar === 'syncing' && '头像同步中...'}
                    {fieldStatus.avatar === 'synced' && '头像已同步到所有设备'}
                  </span>
                </div>
              )}
            </div>
            
            {/* 用户名 */}
            <div className="grid w-full gap-1.5 mb-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="username">用户名</Label>
                {getStatusIcon(fieldStatus.username)}
              </div>
              <Input
                id="username"
                value={username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="focus-visible:ring-primary"
                disabled={isUpdating}
              />
            </div>
            
            {/* 邮箱 */}
            <div className="grid w-full gap-1.5 mb-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email">电子邮箱</Label>
                {getStatusIcon(fieldStatus.email)}
              </div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="focus-visible:ring-primary"
                disabled={isUpdating}
              />
            </div>
            
            {/* 手机号 */}
            <div className="grid w-full gap-1.5 mb-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="phone">手机号码</Label>
                {getStatusIcon(fieldStatus.phone)}
              </div>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="focus-visible:ring-primary"
                disabled={isUpdating}
                placeholder="请输入手机号码"
              />
            </div>
            
            {/* 个人简介 */}
            <div className="grid w-full gap-1.5 mb-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="bio">个人简介</Label>
                {getStatusIcon(fieldStatus.bio)}
              </div>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="focus-visible:ring-primary resize-none"
                disabled={isUpdating}
                placeholder="简短介绍一下自己吧"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isUpdating || Object.values(fieldStatus).every(status => status === 'unchanged')}
                className="bg-primary hover:bg-primary/90"
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    同步中...
                  </>
                ) : (
                  '保存更改'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-b-lg border-t border-primary/10 py-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Shield className="h-4 w-4 mr-2 text-green-500" />
            <span>您的个人资料受数据隔离保护，仅您本人可见</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default UserProfileForm;
