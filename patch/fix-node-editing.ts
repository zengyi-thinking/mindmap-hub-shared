// 修复节点编辑和资料添加功能

/**
 * 问题描述:
 * 1. 节点编辑不生效 - 用户更改节点属性后点击"更新"按钮，但节点没有更新
 * 2. 无法向节点添加资料 - 通过附加资料对话框选择资料后，资料没有被附加到节点上
 * 
 * 问题原因分析:
 * 
 * 1. 节点编辑问题:
 *    - updateNode函数中没有正确处理节点颜色，它将颜色存储到 data.color 属性中，
 *      但实际上节点组件期望颜色应用在 style.background 属性上
 *    - 缺少明确的视觉反馈，用户不清楚何时需要点击"更新"按钮
 *    - 没有对输入进行验证，允许空节点名称
 * 
 * 2. 资料添加问题:
 *    - handleAttachMaterialsToNode 函数实现有问题，没有正确更新节点状态
 *    - 缺少错误处理和用户反馈
 *    - 状态更新操作不完整，导致UI未同步更新
 * 
 * 解决方案:
 * 
 * 1. 修复 updateNode 函数:
 *    - 将节点颜色正确应用于 style.background 属性
 *    - 添加日志记录以便调试
 *    - 确保节点数据结构的一致性
 * 
 * 2. 增强 NodeEditDialog 组件:
 *    - 添加修改状态检测，只有当有更改时才启用"更新"按钮
 *    - 为未保存的更改添加确认对话框
 *    - 添加提示，明确告知用户需要点击"更新"按钮保存更改
 *    - 为"更新"按钮添加动画效果以吸引注意
 *    - 添加输入验证，确保节点名称不为空
 * 
 * 3. 修复 handleAttachMaterialsToNode 函数:
 *    - 添加完整的错误处理
 *    - 添加用户操作的反馈（成功/失败提示）
 *    - 确保节点状态正确更新
 *    - 强制刷新节点数据以确保UI同步
 * 
 * 修复后效果:
 * - 节点编辑将正确应用所有更改，包括颜色、名称、图标等
 * - 资料可以成功附加到节点，并在节点中显示
 * - 用户界面提供更好的反馈，使用户清楚了解操作结果
 */

// 示例代码片段:

// 1. 修复 updateNode 函数
/*
const updateNode = useCallback((
  node: Node | null,
  name: string,
  notes: string,
  color: string,
  icon: string,
  url: string
) => {
  if (!node) return false;
  
  console.log("更新节点:", { id: node.id, name, notes, color, icon, url });
  
  setNodes(nodes => 
    nodes.map(n => {
      if (n.id === node.id) {
        return {
          ...n,
          data: {
            ...n.data,
            label: name,
            notes,
            icon,
            url
          },
          // 确保颜色应用到样式中
          style: {
            ...n.style,
            background: color
          }
        };
      }
      return n;
    })
  );
  
  return true;
}, [setNodes]);
*/

// 2. 修复 handleAttachMaterialsToNode 函数
/*
const handleAttachMaterialsToNode = useCallback((selectedMaterials: Material[]) => {
  if (!selectedNode) {
    toast({
      title: "选择节点错误",
      description: "请先选择一个节点再附加资料",
      variant: "destructive"
    });
    return;
  }
  
  console.log("附加资料到节点:", { 
    nodeId: selectedNode.id, 
    materialCount: selectedMaterials.length,
    materials: selectedMaterials
  });
  
  try {
    // 确保附加资料到节点
    if (attachMaterials(selectedNode, selectedMaterials)) {
      toast({
        title: "资料已附加",
        description: `已成功将 ${selectedMaterials.length} 个资料附加到节点`,
      });
      
      // 也更新节点编辑状态中的材料
      handleAttachMaterials(selectedNode, selectedMaterials);
      
      // 强制刷新节点数据
      setNodes(nodes => 
        nodes.map(n => {
          if (n.id === selectedNode.id) {
            return {
              ...n,
              data: {
                ...n.data,
                materials: selectedMaterials
              }
            };
          }
          return n;
        })
      );
    } else {
      throw new Error("附加资料失败");
    }
  } catch (error) {
    console.error("附加资料错误:", error);
    toast({
      title: "附加资料失败",
      description: "无法将资料附加到节点，请重试",
      variant: "destructive"
    });
  }
}, [selectedNode, attachMaterials, handleAttachMaterials, setNodes]);
*/

// 实现步骤:
// 1. 修改 src/hooks/useMindMapNodes.ts 中的 updateNode 函数
// 2. 增强 src/components/mindmap/NodeEditDialog.tsx 组件
// 3. 修复 src/hooks/useMindMapEditor.ts 中的 handleAttachMaterialsToNode 函数
