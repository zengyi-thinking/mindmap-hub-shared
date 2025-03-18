import React, { useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * ThemeRoot组件用于确保根元素正确应用主题相关的样式类
 * 这是一个技术性组件，不渲染任何UI
 */
const ThemeRoot: React.FC = () => {
  const { getThemeClasses } = useTheme();
  
  // 当主题类变化时，更新根元素类
  useEffect(() => {
    const themeClasses = getThemeClasses();
    document.documentElement.classList.add('theme-transition');
    
    // 为了避免类名冲突，我们移除其他非主题类
    document.documentElement.className.split(' ').forEach(className => {
      if (
        className.startsWith('theme-') || 
        className.startsWith('font-') || 
        className === 'dark' || 
        className === 'focus-mode'
      ) {
        document.documentElement.classList.remove(className);
      }
    });
    
    // 添加新的主题类
    themeClasses.split(' ').forEach(className => {
      if (className) {
        document.documentElement.classList.add(className);
      }
    });
  }, [getThemeClasses]);
  
  return null; // 这是一个无渲染组件，只是为了应用主题
};

export default ThemeRoot; 