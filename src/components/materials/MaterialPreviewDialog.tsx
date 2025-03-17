import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Folder, Download, Calendar, User, Eye } from 'lucide-react';
import FilePreview from '@/components/materials/FilePreview';

interface MaterialPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMaterial: any;
  downloadMaterial: (material: any) => void;
}

const MaterialPreviewDialog: React.FC<MaterialPreviewDialogProps> = ({
  open,
  onOpenChange,
  selectedMaterial,
  downloadMaterial
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[90vw]">
        <DialogHeader>
          <DialogTitle>{selectedMaterial?.title}</DialogTitle>
        </DialogHeader>
        
        {selectedMaterial && (
          <div className="mt-4">
            <div className="mb-4 space-y-2">
              <p className="text-muted-foreground">{selectedMaterial.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedMaterial.tags && selectedMaterial.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline">{tag}</Badge>
                ))}
              </div>
              
              {selectedMaterial.folderPath && selectedMaterial.folderPath.length > 0 && (
                <div className="flex items-center gap-1 text-sm mt-2">
                  <Folder className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {selectedMaterial.folderPath.join(' → ')}
                  </span>
                </div>
              )}
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(selectedMaterial.uploadTime).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{selectedMaterial.username}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{selectedMaterial.viewCount || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  <span>{selectedMaterial.downloadCount || 0}</span>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <FilePreview file={selectedMaterial.file} />
            </div>
            
            <div className="flex justify-end mt-4">
              <Button 
                onClick={() => downloadMaterial(selectedMaterial)}
                className="bg-primary hover:bg-primary/90"
              >
                <Download className="h-4 w-4 mr-2" />
                下载文件
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MaterialPreviewDialog; 