import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText, Check } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Material } from '@/modules/materials/types/materials';

interface AttachMaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  materials: Material[];
  selectedMaterials: Material[];
  onConfirm: (selectedMaterials: Material[]) => void;
}

const AttachMaterialDialog: React.FC<AttachMaterialDialogProps> = ({
  open,
  onOpenChange,
  materials,
  selectedMaterials = [],
  onConfirm
}) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Material[]>(selectedMaterials);
  
  // Reset selected materials when dialog opens
  useEffect(() => {
    if (open) {
      setSelected(selectedMaterials);
    }
  }, [open, selectedMaterials]);
  
  // Filter materials based on search
  const filteredMaterials = materials.filter(material => 
    material.title.toLowerCase().includes(search.toLowerCase()) ||
    (material.description && material.description.toLowerCase().includes(search.toLowerCase())) ||
    (material.tags && material.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())))
  );
  
  // Toggle material selection
  const toggleMaterial = (material: Material) => {
    if (selected.some(m => m.id === material.id)) {
      setSelected(selected.filter(m => m.id !== material.id));
    } else {
      setSelected([...selected, material]);
    }
  };
  
  // Check if a material is selected
  const isSelected = (material: Material) => {
    return selected.some(m => m.id === material.id);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>附加资料</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索资料..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <ScrollArea className="h-[300px] mt-2">
          {filteredMaterials.length === 0 ? (
            <div className="py-4 text-center text-muted-foreground">
              没有找到符合条件的资料
            </div>
          ) : (
            <div className="space-y-1">
              {filteredMaterials.map((material) => (
                <div 
                  key={material.id} 
                  className={`
                    flex items-center gap-2 p-2 rounded-md cursor-pointer
                    ${isSelected(material) ? 'bg-primary/10' : 'hover:bg-muted'}
                  `}
                  onClick={() => toggleMaterial(material)}
                >
                  {isSelected(material) ? (
                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  ) : (
                    <div className="h-5 w-5 rounded-full border border-muted-foreground/30" />
                  )}
                  
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 text-sm">
                    <div className="font-medium">{material.title}</div>
                    {material.tags && material.tags.length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {material.tags.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <DialogFooter>
          <div className="flex justify-between w-full">
            <div className="text-sm text-muted-foreground">
              已选择 {selected.length} 个资料
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                取消
              </Button>
              <Button 
                onClick={() => onConfirm(selected)}
              >
                确认
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AttachMaterialDialog; 