
import { useState, useCallback } from 'react';
import { MindMapNode } from '@/modules/mindmap/types/mindmap';
import { Material } from '@/modules/materials/types/materials';

export function useMindMapNodeEdit() {
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [nodeName, setNodeName] = useState('');
  const [nodeNotes, setNodeNotes] = useState('');
  const [nodeColor, setNodeColor] = useState('#ffffff');
  const [nodeIcon, setNodeIcon] = useState('');
  const [nodeUrl, setNodeUrl] = useState('');
  const [nodeIconDialogOpen, setNodeIconDialogOpen] = useState(false);
  
  const [attachDialogOpen, setAttachDialogOpen] = useState(false);
  const [attachedMaterials, setAttachedMaterials] = useState<Record<string, Material[]>>({});

  // Handle node selection for editing
  const selectNodeForEdit = useCallback((node: MindMapNode) => {
    setSelectedNode(node);
    setNodeName(node.data.label);
    setNodeNotes(node.data.notes || '');
    setNodeColor(node.style?.background || '#ffffff');
    setNodeIcon(node.data.icon || '');
    setNodeUrl(node.data.url || '');
    setEditDialogOpen(true);
  }, []);

  // Reset node edit values
  const resetNodeEdit = useCallback(() => {
    setEditDialogOpen(false);
    setSelectedNode(null);
  }, []);

  // Set node icon and close dialog
  const setNodeIconAndClose = useCallback((icon: string) => {
    setNodeIcon(icon);
    setNodeIconDialogOpen(false);
  }, []);

  // Handle material attachments
  const handleAttachMaterials = useCallback((selectedNode: MindMapNode, selectedMaterials: Material[]) => {
    if (selectedNode) {
      setAttachedMaterials({
        ...attachedMaterials,
        [selectedNode.id]: selectedMaterials
      });
      
      setAttachDialogOpen(false);
    }
  }, [attachedMaterials]);

  return {
    selectedNode,
    setSelectedNode,
    editDialogOpen,
    setEditDialogOpen,
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
    nodeIconDialogOpen,
    setNodeIconDialogOpen,
    attachDialogOpen,
    setAttachDialogOpen,
    attachedMaterials,
    setAttachedMaterials,
    selectNodeForEdit,
    resetNodeEdit,
    setNodeIconAndClose,
    handleAttachMaterials
  };
}

