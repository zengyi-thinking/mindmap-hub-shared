import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageSquare, Save, Info, Clock } from "lucide-react";
import { motion } from 'framer-motion';
import { ReflectionData } from '../types/usage';
import { formatDate } from '../utils/timeUtils';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ReflectionTabProps {
  reflection: ReflectionData;
  onSave: (content: string) => void;
}

const ReflectionTab: React.FC<ReflectionTabProps> = ({ reflection, onSave }) => {
  const [content, setContent] = useState(reflection.content);
  const [showPreview, setShowPreview] = useState(false);
  
  // 格式化更新时间显示
  const formatLastUpdated = () => {
    if (!reflection.lastUpdated) return '尚未保存';
    
    try {
      const date = new Date(reflection.lastUpdated);
      return formatDate(date);
    } catch (e) {
      return '未知时间';
    }
  };
  
  // 在文本中插入格式化标记
  const insertFormat = (format: string) => {
    const textarea = document.getElementById('reflection-textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = '';
    let cursorPosition = 0;
    
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        cursorPosition = start + 2 + selectedText.length;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        cursorPosition = start + 1 + selectedText.length;
        break;
      case 'list':
        formattedText = `\n- ${selectedText}`;
        cursorPosition = start + 3 + selectedText.length;
        break;
      case 'orderedList':
        formattedText = `\n1. ${selectedText}`;
        cursorPosition = start + 4 + selectedText.length;
        break;
      default:
        return;
    }
    
    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
    
    // 在下一个事件循环中更新选择范围，确保内容已经更新
    setTimeout(() => {
      textarea.focus();
      if (!selectedText) {
        // 如果没有选择文本，将光标放在标记中间
        const middlePosition = format === 'bold' ? start + 2 : start + 1;
        textarea.setSelectionRange(middlePosition, middlePosition);
      } else {
        // 如果有选择文本，将光标放在格式化文本之后
        textarea.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 0);
  };
  
  // 保存反思内容
  const handleSave = () => {
    onSave(content);
  };
  
  // 处理Markdown格式的简单预览
  const renderPreview = () => {
    if (!content) return <p className="text-muted-foreground italic">暂无内容</p>;
    
    // 处理markdown格式
    let html = content
      // 处理粗体
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // 处理斜体
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // 处理无序列表
      .replace(/^- (.*?)$/gm, '<li>$1</li>')
      // 处理有序列表
      .replace(/^\d+\. (.*?)$/gm, '<li>$1</li>')
      // 处理段落
      .replace(/(?:\r\n|\r|\n)/g, '<br />');
    
    // 包装无序列表
    if (html.includes('<li>')) {
      html = html.replace(/<li>([^<]+)<\/li><br \/>/g, '<li>$1</li>');
      html = html.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');
    }
    
    return <div dangerouslySetInnerHTML={{ __html: html }} className="prose prose-sm dark:prose-invert max-w-none" />;
  };
  
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
              <MessageSquare className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <CardTitle className="text-lg">学习反思</CardTitle>
              <CardDescription>记录您的学习心得和总结</CardDescription>
              </div>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>上次更新: {formatLastUpdated()}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <Info className="h-4 w-4 mr-1" />
            <span>您的反思将被保存，并且只有您能看到</span>
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <ToggleGroup type="single" value={showPreview ? "preview" : "edit"}>
              <ToggleGroupItem value="edit" onClick={() => setShowPreview(false)}>
                编辑
              </ToggleGroupItem>
              <ToggleGroupItem value="preview" onClick={() => setShowPreview(true)}>
                预览
              </ToggleGroupItem>
            </ToggleGroup>
            
            {!showPreview && (
              <div className="flex space-x-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => insertFormat('bold')}
                  className="font-bold"
                >
                  B
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => insertFormat('italic')}
                  className="italic"
                >
                  I
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => insertFormat('list')}
                >
                  • 
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => insertFormat('orderedList')}
                >
                  1.
                </Button>
              </div>
            )}
          </div>
          
          {showPreview ? (
            <motion.div 
              className="border rounded-md p-3 min-h-[220px] max-h-[50vh] overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {renderPreview()}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
          <Textarea
                id="reflection-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            placeholder="在这里记录您的学习反思和总结..."
                className="min-h-[220px] resize-none"
          />
            </motion.div>
          )}
          
          <div className="flex justify-end mt-4">
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              保存反思
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReflectionTab;