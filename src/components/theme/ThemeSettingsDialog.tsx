import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/contexts/ThemeContext';
import { Settings, Moon, Sun, Check } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// 主题颜色类型定义
type ThemeColorOption = {
  value: string;
  label: string;
  color: string;
};

// 主题颜色选项
const themeColorOptions: ThemeColorOption[] = [
  { value: 'blue', label: '蓝色', color: '#3b82f6' },
  { value: 'purple', label: '紫色', color: '#8b5cf6' },
  { value: 'green', label: '绿色', color: '#10b981' },
  { value: 'pink', label: '粉色', color: '#ec4899' },
  { value: 'orange', label: '橙色', color: '#f97316' },
];

interface ThemeSettingsDialogProps {
  trigger?: React.ReactNode;
}

const ThemeSettingsDialog: React.FC<ThemeSettingsDialogProps> = ({ trigger }) => {
  const { darkMode, toggleDarkMode, themeColor, setThemeColor } = useTheme();
  const [open, setOpen] = useState(false);
  
  // 处理主题色选择，使用preventDefault防止默认行为
  const handleThemeColorChange = (e: React.MouseEvent, color: string) => {
    e.preventDefault();
    e.stopPropagation();
    setThemeColor(color as any);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>外观设置</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            自定义界面颜色、字体和显示模式
          </p>

          <Tabs defaultValue="theme">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="theme">主题</TabsTrigger>
              <TabsTrigger value="font">字体</TabsTrigger>
              <TabsTrigger value="display">显示模式</TabsTrigger>
            </TabsList>
            
            <TabsContent value="theme" className="mt-4">
              <h3 className="font-medium mb-2">主题颜色</h3>
              <div className="grid grid-cols-1 gap-4">
                {themeColorOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`p-3 rounded-lg flex items-center justify-between cursor-pointer transition-all ${
                      themeColor === option.value 
                        ? 'ring-2 ring-offset-2'
                        : 'hover:bg-muted'
                    }`}
                    style={{ 
                      backgroundColor: option.value === themeColor ? `${option.color}20` : '',
                      borderColor: option.color,
                      ringColor: option.color
                    }}
                    onClick={(e) => handleThemeColorChange(e, option.value)}
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: option.color }}
                      >
                        {themeColor === option.value && (
                          <Check className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <span>{option.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="font" className="mt-4">
              <p className="text-sm text-muted-foreground">
                字体设置功能即将推出...
              </p>
            </TabsContent>
            
            <TabsContent value="display" className="mt-4">
              <div className="flex items-center justify-between py-2">
                <Label htmlFor="dark-mode" className="flex items-center gap-2">
                  {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  <span>暗色模式</span>
                </Label>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={(e) => {
                    e.preventDefault();
                    toggleDarkMode();
                  }}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeSettingsDialog; 