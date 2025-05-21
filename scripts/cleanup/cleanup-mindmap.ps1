# 思维导图文件清理脚本

# 旧文件路径列表
$filesToRemove = @(
    # 旧的思维导图组件
    "src/features/materials/components/mindmap/MindMapCreateDialog.tsx",
    "src/features/materials/components/mindmap/MaterialMermaidMindMap.tsx",
    "src/features/material-search/MaterialMermaidMindMap.tsx",
    "src/features/material-search/components/MaterialMermaidMindMap.tsx",
    "src/features/material-search/components/MermaidMindMap.tsx",
    "src/features/material-search/utils/mermaidGenerator.ts",
    
    # 旧的模块目录中的思维导图组件
    "src/modules/mindmap/components/CreateMindMapDialog.tsx",
    "src/modules/mindmap/components/MindMapAdapter.tsx",
    "src/modules/mindmap/components/MindMapWorkspace.tsx",
    "src/modules/mindmap/components/MaterialNode.tsx",
    "src/modules/mindmap/components/NodeUploadForm.tsx",
    "src/modules/mindmap/components/NodeIconDialog.tsx",
    "src/modules/mindmap/components/NodeEditForm.tsx",
    "src/modules/mindmap/components/NodeEditDialog.tsx",
    "src/modules/mindmap/components/MindMapTabs.tsx",
    "src/modules/mindmap/components/MindMapCard.tsx",
    "src/modules/mindmap/components/AttachMaterialDialog.tsx",
    "src/modules/mindmap/components/MindMapNode.tsx",
    "src/modules/mindmap/components/FilePreview.tsx",
    "src/modules/mindmap/components/MindMapEditor.tsx",
    "src/modules/mindmap/components/MindMapControls.tsx",
    "src/modules/mindmap/components/MindMapEdge.tsx",
    "src/modules/mindmap/components/MindMapHeader.tsx",
    "src/modules/mindmap/components/MindMapTags.tsx",
    "src/modules/mindmap/components/SearchBar.tsx",
    "src/modules/mindmap/components/NodeIconSelector.tsx",
    
    # 旧的模块目录中的思维导图服务和类型
    "src/modules/mindmap/services/mindmap.ts",
    "src/modules/mindmap/types/mindmap.ts",
    "src/modules/mindmap/hooks/useMindMapNodes.ts"
)

# 删除文件
foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        Remove-Item -Path $file -Force
        Write-Host "已删除文件: $file"
    }
    else {
        Write-Host "文件不存在: $file"
    }
}

# 检查目录是否为空，如果为空则删除
$dirsToCheck = @(
    "src/features/materials/components/mindmap",
    "src/modules/mindmap/components",
    "src/modules/mindmap/services",
    "src/modules/mindmap/types",
    "src/modules/mindmap/hooks",
    "src/modules/mindmap/utils",
    "src/modules/mindmap",
    "src/features/mindmap",
    "src/features/material-search/utils"
)

foreach ($dir in $dirsToCheck) {
    if (Test-Path $dir) {
        $items = Get-ChildItem -Path $dir
        if ($items.Count -eq 0) {
            Remove-Item -Path $dir -Force
            Write-Host "已删除空目录: $dir"
        }
        else {
            Write-Host "目录非空，保留: $dir，包含以下文件:"
            foreach ($item in $items) {
                Write-Host "  - $($item.Name)"
            }
        }
    }
}

Write-Host "清理完成。请检查应用是否正常工作。" 