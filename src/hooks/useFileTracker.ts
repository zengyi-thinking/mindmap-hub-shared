import { useEffect } from 'react';
import { fileUsageService } from '@/components/dashboard/services/usageService';
import { useAuth } from '@/lib/auth';

/**
 * 文件使用跟踪钩子
 * 
 * 使用示例:
 * ```jsx
 * // 在组件内部
 * useFileTracker({ 
 *   fileId: material.id, 
 *   fileName: material.title 
 * });
 * ```
 */
export const useFileTracker = (
  { fileId, fileName }: { fileId: string; fileName: string }
) => {
  const { user } = useAuth();

  useEffect(() => {
    // 确保有用户登录和有效的文件ID
    if (user && fileId) {
      // 记录文件点击
      fileUsageService.recordFileClick(fileId, fileName);
    }
  }, [fileId, fileName, user]);
};

export default useFileTracker; 