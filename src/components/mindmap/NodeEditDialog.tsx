import React, { useState, useEffect } from 'react';
import { MindMapNode } from '@/types/mindmap';
import { Material } from '@/types/materials';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Trash2, Link2, Image, Palette, PlusCircle, Eye, EyeOff, Save } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

interface NodeEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedNode: MindMapNode | null;
  nodeName: string;
  setNodeName: (name: string) => void;
  nodeNotes: string;
  setNodeNotes: (notes: string) => void;
  nodeColor: string;
  setNodeColor: (color: string) => void;
  nodeIcon: string;
  setNodeIcon: (icon: string) => void;
  nodeUrl: string;
  setNodeUrl: (url: string) => void;
  onUpdate: () => void;
  onDelete: () => void;
  onOpenIconDialog: () => void;
  onOpenAttachDialog: () => void;
  onStartConnecting: () => void;
}

const predefinedColors = [
  '#3b82f6', // 蓝色
  '#10b981', // 绿色
  '#f97316', // 橙色
  '#ec4899', // 粉色
  '#8b5cf6', // 紫色
  '#facc15', // 黄色
  '#f43f5e', // 红色
  '#64748b', // 灰色
];

const NodeEditDialog: React.FC<NodeEditDialogProps> = ({
  open,
  onOpenChange,
  selectedNode,
  nodeName,
  setNodeName,
  nodeNotes,
  setNodeNotes,
  nodeColor,
  setNodeColor,
  nodeIcon,
  setNodeIcon,
  nodeUrl,
  setNodeUrl,
  onUpdate,
  onDelete,
  onOpenIconDialog,
  onOpenAttachDialog,
  onStartConnecting
}) => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('basic');
  const [previewMode, setPreviewMode] = useState(false);
  const [nodePreview, setNodePreview] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState(false);
  
  // 更新预览节点
  useEffect(() => {
    if (selectedNode) {
      setNodePreview({
        ...selectedNode,
        data: {
          ...selectedNode.data,
          label: nodeName,
          notes: nodeNotes,
          icon: nodeIcon,
        },
        style: {
          ...selectedNode.style,
          background: nodeColor,
        }
      });
    }
  }, [selectedNode, nodeName, nodeNotes, nodeIcon, nodeColor]);

  // 检测是否有更改
  useEffect(() => {
    if (selectedNode) {
      const hasNameChanged = nodeName !== selectedNode.data.label;
      const hasNotesChanged = nodeNotes !== (selectedNode.data.notes || '');
      const hasColorChanged = nodeColor !== (selectedNode.style?.background || '#ffffff');
      const hasIconChanged = nodeIcon !== (selectedNode.data.icon || '');
      const hasUrlChanged = nodeUrl !== (selectedNode.data.url || '');
      
      setHasChanges(
        hasNameChanged || hasNotesChanged || hasColorChanged || 
        hasIconChanged || hasUrlChanged
      );
    }
  }, [selectedNode, nodeName, nodeNotes, nodeColor, nodeIcon, nodeUrl]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
  };
  
  const handleSave = () => {
    if (!nodeName.trim()) {
      toast({
        title: "请输入节点名称",
        description: "节点名称不能为空",
        variant: "destructive"
      });
      return;
    }
    
    onUpdate();
    toast({
      title: "更新成功",
      description: "节点已成功更新"
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      // 如果有未保存的更改，询问用户
      if (!isOpen && hasChanges) {
        if (confirm("您有未保存的更改，确定要关闭吗？")) {
          onOpenChange(isOpen);
        }
      } else {
        onOpenChange(isOpen);
      }
    }}>
      <DialogContent className={cn("sm:max-w-md transition-all duration-300", 
        previewMode ? "h-[400px]" : "")}>
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>编辑节点</DialogTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={togglePreviewMode}
              className="flex items-center gap-1"
            >
              {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {previewMode ? "隐藏预览" : "预览"}
            </Button>
          </div>
          <DialogDescription>
            修改节点内容和样式
          </DialogDescription>
        </DialogHeader>
        
        <div className={`${previewMode ? "flex gap-4" : ""}`}>
          {previewMode && nodePreview && (
            <div className="flex items-center justify-center w-1/3 min-w-[150px] p-2 border rounded-lg">
              <div 
                className="p-3 w-full"
                style={{
                  background: nodeColor || '#ffffff',
                  color: nodeColor && isColorDark(nodeColor) ? 'white' : 'black',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  minWidth: '120px',
                  maxWidth: '150px',
                  transition: 'all 0.2s ease'
                }}
              >
                {nodeIcon && (
                  <div className="flex justify-center mb-1">
                    <span className="text-lg">{nodeIcon}</span>
                  </div>
                )}
                <div className="font-medium text-center">{nodeName || '节点名称'}</div>
                {nodeNotes && (
                  <div className="text-xs mt-1.5 p-1 rounded-md bg-black/5">{nodeNotes}</div>
                )}
              </div>
            </div>
          )}
          
          <div className={previewMode ? "w-2/3" : "w-full"}>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="basic">基本信息</TabsTrigger>
                <TabsTrigger value="style">外观样式</TabsTrigger>
                <TabsTrigger value="content">内容资料</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nodeName">名称 <span className="text-red-500">*</span></Label>
                  <Input
                    id="nodeName"
                    value={nodeName}
                    onChange={(e) => setNodeName(e.target.value)}
                    className="border-input focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nodeNotes">备注</Label>
                  <Textarea
                    id="nodeNotes"
                    value={nodeNotes}
                    onChange={(e) => setNodeNotes(e.target.value)}
                    rows={3}
                    className="border-input focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nodeUrl">链接 URL (可选)</Label>
                  <Input
                    id="nodeUrl"
                    placeholder="https://example.com"
                    value={nodeUrl}
                    onChange={(e) => setNodeUrl(e.target.value)}
                    className="border-input focus:ring-2 focus:ring-primary/30"
                  />
                  <p className="text-xs text-muted-foreground">添加 URL 后双击节点将打开此链接</p>
                </div>
              </TabsContent>
              
              <TabsContent value="style" className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Palette className="h-4 w-4" /> 节点颜色
                  </Label>
                  <div className="grid grid-cols-8 gap-2 mb-3">
                    {predefinedColors.map((color) => (
                      <div 
                        key={color}
                        className={`h-6 w-full rounded-md cursor-pointer transition-all hover:scale-110 ${nodeColor === color ? 'ring-2 ring-primary' : ''}`}
                        style={{ background: color }}
                        onClick={() => setNodeColor(color)}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      id="nodeColor"
                      type="color"
                      value={nodeColor}
                      onChange={(e) => setNodeColor(e.target.value)}
                      className="w-12 h-8 p-1"
                    />
                    <Input
                      value={nodeColor}
                      onChange={(e) => setNodeColor(e.target.value)}
                      className="flex-1 border-input focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Image className="h-4 w-4" /> 节点图标
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onOpenIconDialog}
                      className="flex items-center gap-1 border-input focus:ring-2 focus:ring-primary/30"
                    >
                      <Image className="h-4 w-4" />
                      {nodeIcon ? '更换图标' : '选择图标'}
                    </Button>
                    {nodeIcon && <span className="text-sm font-medium">{nodeIcon}</span>}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="content" className="space-y-4 py-4">
                {selectedNode && selectedNode.data.materials && selectedNode.data.materials.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="flex items-center gap-2">
                        <FileText className="h-4 w-4" /> 已附加资料
                      </Label>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={onOpenAttachDialog}
                        className="text-xs"
                      >
                        管理资料
                      </Button>
                    </div>
                    <div className="text-sm space-y-1 max-h-[150px] overflow-y-auto border rounded-md p-2">
                      {selectedNode.data.materials.map((material: Material, i: number) => (
                        <div key={i} className="flex items-center gap-2 p-1 hover:bg-accent/20 rounded-md">
                          <FileText className="h-3 w-3 text-muted-foreground" />
                          <span>{material.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 px-4 border border-dashed rounded-lg space-y-2">
                    <FileText className="h-8 w-8 text-muted-foreground/60" />
                    <p className="text-sm text-muted-foreground text-center">此节点还没有附加资料</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onOpenAttachDialog}
                      className="mt-2"
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      添加资料
                    </Button>
                  </div>
                )}
                
                <div className="pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full flex items-center justify-center gap-1"
                    onClick={onStartConnecting}
                  >
                    <Link2 className="h-4 w-4" />
                    连接到其他节点
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="mt-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-md p-2 text-sm text-yellow-700 dark:text-yellow-400 flex items-center">
          <div className="mr-2 p-1.5 rounded-full bg-yellow-100 dark:bg-yellow-900">
            <Save className="h-4 w-4" />
          </div>
          <p>所有更改需要点击"更新"按钮后才会保存</p>
        </div>
        
        <DialogFooter className="flex justify-between mt-4">
          <Button 
            variant="destructive" 
            size="sm"
            className="flex items-center gap-1"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
            删除节点
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button 
              onClick={handleSave}
              className={`px-6 transition-transform ${hasChanges ? 'hover:scale-105 animate-pulse' : ''}`}
              disabled={!hasChanges}
            >
              <Save className="h-4 w-4 mr-1" />
              更新节点
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// 判断颜色是否为深色
function isColorDark(hexColor: string): boolean {
  // 移除#前缀
  const hex = hexColor.replace('#', '');
  
  // 解析RGB值
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // 计算相对亮度
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // 亮度小于0.5认为是深色
  return luminance < 0.5;
}

export default NodeEditDialog;
