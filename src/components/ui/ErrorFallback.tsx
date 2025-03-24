import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorFallbackProps {
  error?: string;
  title?: string;
  description?: string;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  title = "页面加载出错", 
  description = "很抱歉，加载页面时出现了问题。" 
}) => (
  <div className="p-8 text-center">
    <h2 className="text-2xl font-bold text-red-500 mb-4">{title}</h2>
    <p className="mb-2 text-gray-600">{description}</p>
    {error && (
      <p className="text-sm text-red-500 mb-4 p-2 bg-red-50 rounded">
        错误信息: {error}
      </p>
    )}
    <Button 
      onClick={() => window.location.reload()}
      className="bg-primary hover:bg-primary/90"
    >
      刷新页面
    </Button>
  </div>
);

export default ErrorFallback; 