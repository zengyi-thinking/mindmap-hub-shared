import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme, ThemeColor, FontStyle } from '@/contexts/ThemeContext';
import { Check, Moon, Sun, Paintbrush, Type, Focus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ThemeButtonProps = {
  color: ThemeColor;
  label: string;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
};

const ThemeButton: React.FC<ThemeButtonProps> = ({
  color,
  label,
  isSelected,
  onClick,
  className
}) => {
  // 定义颜色映射
  const colorMap: Record<ThemeColor, { bg: string; hover: string; selected: string }> = {
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      hover: 'hover:bg-blue-200 dark:hover:bg-blue-800/40',
      selected: 'ring-blue-500'
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      hover: 'hover:bg-purple-200 dark:hover:bg-purple-800/40',
      selected: 'ring-purple-500'
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      hover: 'hover:bg-green-200 dark:hover:bg-green-800/40',
      selected: 'ring-green-500'
    },
    pink: {
      bg: 'bg-pink-100 dark:bg-pink-900/30',
      hover: 'hover:bg-pink-200 dark:hover:bg-pink-800/40',
      selected: 'ring-pink-500'
    },
    orange: {
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      hover: 'hover:bg-orange-200 dark:hover:bg-orange-800/40',
      selected: 'ring-orange-500'
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        'flex items-center gap-2 relative',
        isSelected && `ring-2 ${colorMap[color].selected}`,
        colorMap[color].bg,
        colorMap[color].hover,
        className
      )}
      onClick={onClick}
    >
      <span
        className={cn(
          'h-3 w-3 rounded-full',
          color === 'blue' && 'bg-blue-500',
          color === 'purple' && 'bg-purple-500',
          color === 'green' && 'bg-green-500',
          color === 'pink' && 'bg-pink-500',
          color === 'orange' && 'bg-orange-500'
        )}
      ></span>
      {label}
      {isSelected && (
        <Check className="h-3.5 w-3.5 absolute right-2 text-primary" />
      )}
    </Button>
  );
};

type FontButtonProps = {
  font: FontStyle;
  label: string;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
};

const FontButton: React.FC<FontButtonProps> = ({
  font,
  label,
  isSelected,
  onClick,
  className
}) => {
  // 字体样式映射
  const fontMap: Record<FontStyle, string> = {
    default: 'font-sans',
    rounded: 'font-rounded',
    serif: 'font-serif',
    mono: 'font-mono'
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        'flex items-center gap-2 relative',
        isSelected && 'ring-2 ring-primary',
        fontMap[font],
        className
      )}
      onClick={onClick}
    >
      {label}
      {isSelected && (
        <Check className="h-3.5 w-3.5 absolute right-2 text-primary" />
      )}
    </Button>
  );
};

export const ThemeSettingsButton: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" title="主题设置">
          <Paintbrush className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <ThemeSettingsContent />
      </DialogContent>
    </Dialog>
  );
};

export const ThemeToggleButtons: React.FC = () => {
  const { darkMode, toggleDarkMode, focusMode, toggleFocusMode } = useTheme();
  
  return (
    <div className="flex gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        className={cn(
          "h-9 w-9 rounded-full transition-colors",
          darkMode ? "text-yellow-200 bg-blue-900/20" : "text-blue-900"
        )}
        onClick={toggleDarkMode}
        title={darkMode ? "切换到亮色模式" : "切换到暗色模式"}
      >
        {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className={cn(
          "h-9 w-9 rounded-full transition-colors",
          focusMode && "text-primary bg-primary/10"
        )}
        onClick={toggleFocusMode}
        title={focusMode ? "退出专注模式" : "进入专注模式"}
      >
        <Focus className="h-4 w-4" />
      </Button>
      
      <ThemeSettingsButton />
    </div>
  );
};

export const ThemeSettingsContent: React.FC = () => {
  const { 
    darkMode, 
    toggleDarkMode, 
    focusMode, 
    toggleFocusMode,
    themeColor,
    setThemeColor,
    fontStyle,
    setFontStyle
  } = useTheme();

  return (
    <>
      <DialogHeader>
        <DialogTitle>外观设置</DialogTitle>
        <DialogDescription>
          自定义界面颜色、字体和显示模式
        </DialogDescription>
      </DialogHeader>
      
      <Tabs defaultValue="theme">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="theme" className="flex items-center gap-1.5">
            <Paintbrush className="h-3.5 w-3.5" />
            <span>主题</span>
          </TabsTrigger>
          <TabsTrigger value="font" className="flex items-center gap-1.5">
            <Type className="h-3.5 w-3.5" />
            <span>字体</span>
          </TabsTrigger>
          <TabsTrigger value="mode" className="flex items-center gap-1.5">
            <Focus className="h-3.5 w-3.5" />
            <span>显示模式</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="theme" className="pt-4">
          <div>
            <h4 className="mb-3 text-sm font-medium">主题颜色</h4>
            <div className="grid grid-cols-2 gap-2">
              <ThemeButton 
                color="blue" 
                label="蓝色" 
                isSelected={themeColor === 'blue'}
                onClick={() => setThemeColor('blue')}
              />
              <ThemeButton 
                color="purple" 
                label="紫色" 
                isSelected={themeColor === 'purple'}
                onClick={() => setThemeColor('purple')}
              />
              <ThemeButton 
                color="green" 
                label="绿色" 
                isSelected={themeColor === 'green'}
                onClick={() => setThemeColor('green')}
              />
              <ThemeButton 
                color="pink" 
                label="粉色" 
                isSelected={themeColor === 'pink'}
                onClick={() => setThemeColor('pink')}
              />
              <ThemeButton 
                color="orange" 
                label="橙色" 
                isSelected={themeColor === 'orange'}
                onClick={() => setThemeColor('orange')}
                className="col-span-2"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="theme-mode">暗色模式</Label>
              <span className="text-xs text-muted-foreground">
                开启后将使用暗色主题
              </span>
            </div>
            <Switch
              id="theme-mode"
              checked={darkMode}
              onCheckedChange={toggleDarkMode}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="font" className="pt-4">
          <div>
            <h4 className="mb-3 text-sm font-medium">字体样式</h4>
            <div className="grid grid-cols-2 gap-2">
              <FontButton 
                font="default" 
                label="默认" 
                isSelected={fontStyle === 'default'}
                onClick={() => setFontStyle('default')}
              />
              <FontButton 
                font="rounded" 
                label="圆润" 
                isSelected={fontStyle === 'rounded'}
                onClick={() => setFontStyle('rounded')}
              />
              <FontButton 
                font="serif" 
                label="宋体" 
                isSelected={fontStyle === 'serif'}
                onClick={() => setFontStyle('serif')}
              />
              <FontButton 
                font="mono" 
                label="等宽" 
                isSelected={fontStyle === 'mono'}
                onClick={() => setFontStyle('mono')}
              />
            </div>
            
            <div className="mt-4 p-3 rounded-md border border-dashed text-sm">
              <p className="mb-2">字体预览:</p>
              <p className={cn(
                fontStyle === 'default' && 'font-sans',
                fontStyle === 'rounded' && 'font-rounded',
                fontStyle === 'serif' && 'font-serif',
                fontStyle === 'mono' && 'font-mono'
              )}>
                思维导图是一种图形化的思考工具，它可以帮助我们组织信息、产生想法和解决问题。
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="mode" className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <Label htmlFor="focus-mode">专注模式</Label>
              <span className="text-xs text-muted-foreground">
                隐藏非必要元素，减少干扰
              </span>
            </div>
            <Switch
              id="focus-mode"
              checked={focusMode}
              onCheckedChange={toggleFocusMode}
            />
          </div>
          
          <div className="mt-4 p-3 rounded-md border border-dashed">
            <h4 className="text-sm font-medium mb-2">专注模式效果:</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li className="flex items-center gap-1">
                <Check className="h-3 w-3 text-green-500" />
                淡化侧边栏，减少视觉干扰
              </li>
              <li className="flex items-center gap-1">
                <Check className="h-3 w-3 text-green-500" />
                隐藏装饰性元素，保留核心功能
              </li>
              <li className="flex items-center gap-1">
                <Check className="h-3 w-3 text-green-500" />
                降低页面顶部和底部元素的存在感
              </li>
              <li className="flex items-center gap-1">
                <Check className="h-3 w-3 text-green-500" />
                鼠标悬停时恢复隐藏元素
              </li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
      
      <DialogFooter className="mt-6">
        <Button variant="outline" size="sm" className="flex items-center gap-1.5">
          <X className="h-3.5 w-3.5" />
          <span>关闭</span>
        </Button>
      </DialogFooter>
    </>
  );
};

const ThemeSettings: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>界面设置</CardTitle>
        <CardDescription>
          自定义界面外观和显示模式
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ThemeSettingsContent />
      </CardContent>
    </Card>
  );
};

export default ThemeSettings; 