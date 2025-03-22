import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, Download, AlertTriangle, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const DataPrivacy: React.FC = () => {
  const [privacySettings, setPrivacySettings] = React.useState({
    saveHistory: true,
    collectUsageData: true,
    allowNotifications: true,
    shareFeedback: false
  });

  React.useEffect(() => {
    // 从本地存储加载隐私设置
    const savedSettings = localStorage.getItem('privacySettings');
    if (savedSettings) {
      try {
        setPrivacySettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('加载隐私设置失败:', e);
      }
    }
  }, []);

  const handleToggle = (setting: string) => {
    setPrivacySettings(prev => {
      const newSettings = { 
        ...prev, 
        [setting]: !prev[setting as keyof typeof prev] 
      };
      localStorage.setItem('privacySettings', JSON.stringify(newSettings));
      return newSettings;
    });
  };

  const downloadData = () => {
    // 收集用户数据
    const userData = {
      profile: JSON.parse(localStorage.getItem('userProfileData') || '{}'),
      privacySettings,
      aiSettings: JSON.parse(localStorage.getItem('aiAssistantConfig') || '{}'),
      // 添加其他需要导出的数据
    };

    // 创建下载链接
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    // 创建下载链接并点击
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-mindmap-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "数据已导出",
      description: "您的数据已成功导出为JSON文件",
    });
  };

  const deleteAllData = () => {
    // 清除所有本地存储数据
    localStorage.clear();
    
    // 更新状态
    setPrivacySettings({
      saveHistory: true,
      collectUsageData: true,
      allowNotifications: true,
      shareFeedback: false
    });
    
    toast({
      title: "数据已删除",
      description: "您的所有本地数据已成功删除",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">数据隐私</h2>
        <p className="text-muted-foreground">管理您的数据和隐私设置</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            隐私设置
          </CardTitle>
          <CardDescription>
            管理您的数据隐私和使用偏好
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>保存思维导图历史</Label>
                <p className="text-sm text-muted-foreground">
                  允许应用保存您的思维导图编辑历史
                </p>
              </div>
              <Switch
                checked={privacySettings.saveHistory}
                onCheckedChange={() => handleToggle('saveHistory')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>收集使用数据</Label>
                <p className="text-sm text-muted-foreground">
                  允许收集匿名使用数据以改进应用体验
                </p>
              </div>
              <Switch
                checked={privacySettings.collectUsageData}
                onCheckedChange={() => handleToggle('collectUsageData')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>允许通知</Label>
                <p className="text-sm text-muted-foreground">
                  接收有关新功能和更新的通知
                </p>
              </div>
              <Switch
                checked={privacySettings.allowNotifications}
                onCheckedChange={() => handleToggle('allowNotifications')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>共享反馈</Label>
                <p className="text-sm text-muted-foreground">
                  允许自动发送应用使用反馈
                </p>
              </div>
              <Switch
                checked={privacySettings.shareFeedback}
                onCheckedChange={() => handleToggle('shareFeedback')}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="h-5 w-5 mr-2 text-primary" />
            数据管理
          </CardTitle>
          <CardDescription>
            导出或删除您的所有数据
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button variant="outline" className="flex items-center" onClick={downloadData}>
              <Download className="h-4 w-4 mr-2" />
              导出我的数据
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex items-center">
                  <Trash2 className="h-4 w-4 mr-2" />
                  删除所有数据
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
                      确认删除所有数据？
                    </div>
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    此操作将永久删除您在本应用中存储的所有数据，包括个人资料、设置和思维导图。此操作无法撤销。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteAllData}>
                    确认删除
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          <div className="rounded-md bg-amber-50 p-4 dark:bg-amber-950">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  数据隐私提示
                </h3>
                <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                  <p>
                    本应用使用浏览器的本地存储功能来保存您的数据。所有数据均存储在您的设备上，我们不会将您的个人数据上传到服务器。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataPrivacy; 