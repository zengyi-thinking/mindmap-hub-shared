import React, { Suspense } from 'react';
import NLPMindMapPage from './NLPMindMapPage';

const MindMapPageLoader = () => {
  return (
    <div className="p-12 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-medium">加载思维导图...</p>
        <p className="text-sm text-muted-foreground mt-2">请耐心等待，系统正在准备资源</p>
      </div>
    </div>
  );
};

/**
 * AI思维导图页面入口
 */
export default function AIMindMapPage() {
  return (
    <Suspense fallback={<MindMapPageLoader />}>
      <NLPMindMapPage />
    </Suspense>
  );
} 