import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileText, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MindMapConnectorProps {
  nodeName: string | null;
  onConnect: () => void;
  className?: string;
}

/**
 * 思维导图连接器组件
 * 用于连接思维导图节点与文件夹导航
 */
const MindMapConnector: React.FC<MindMapConnectorProps> = ({
  nodeName,
  onConnect,
  className
}) => {
  if (!nodeName) {
    return (
      <div className={cn("border rounded-lg p-4 bg-card", className)}>
        <div className="text-sm text-center text-muted-foreground py-3">
          请选择一个思维导图节点以查看相关文件夹
        </div>
      </div>
    );
  }

  return (
    <div className={cn("border rounded-lg p-4 bg-card", className)}>
      <h3 className="font-medium mb-3">节点关联</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="font-medium truncate flex-1">{nodeName}</div>
          <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground" />
          <div className="text-muted-foreground truncate flex-1 text-right">相关文件夹</div>
        </div>

        <Separator />

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">将此节点关联到文件系统中的文件夹:</p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-xs" 
              onClick={onConnect}
            >
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              浏览文件夹
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindMapConnector; 