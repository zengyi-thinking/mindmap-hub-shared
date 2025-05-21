# 删除原始文件脚本
# 此脚本将删除已移动到bridges目录的原始文件

Write-Host "开始删除已移动的原始文件..." -ForegroundColor Yellow

# 要删除的组件文件
$componentFiles = @(
    "src/modules/mindmap/components/MindMapCard.tsx",
    "src/modules/mindmap/components/MindMapControls.tsx",
    "src/modules/mindmap/components/MindMapEditor.tsx",
    "src/modules/mindmap/components/MindMapEdge.tsx",
    "src/modules/mindmap/components/MindMapHeader.tsx",
    "src/modules/mindmap/components/MindMapTags.tsx",
    "src/modules/mindmap/components/MindMapWorkspace.tsx",
    "src/modules/mindmap/components/MaterialNode.tsx",
    "src/modules/mindmap/components/NodeEditDialog.tsx"
)

# 删除组件文件
foreach ($file in $componentFiles) {
    if (Test-Path $file) {
        Remove-Item -Path $file -Force
        Write-Host "已删除文件: $file" -ForegroundColor Cyan
    }
    else {
        Write-Host "文件不存在: $file" -ForegroundColor Magenta
    }
}

# 删除material-search组件文件
$materialSearchFiles = @(
    "src/features/material-search/components/MaterialMermaidMindMap.tsx",
    "src/features/material-search/utils/mermaidGenerator.ts"
)

foreach ($file in $materialSearchFiles) {
    if (Test-Path $file) {
        Remove-Item -Path $file -Force
        Write-Host "已删除文件: $file" -ForegroundColor Cyan
    }
    else {
        Write-Host "文件不存在: $file" -ForegroundColor Magenta
    }
}

# 删除types文件
if (Test-Path "src/modules/mindmap/types/mindmap.ts") {
    Remove-Item -Path "src/modules/mindmap/types/mindmap.ts" -Force
    Write-Host "已删除文件: src/modules/mindmap/types/mindmap.ts" -ForegroundColor Cyan
}

# 清理原始目录，如果为空
$dirsToCheck = @(
    "src/modules/mindmap/components",
    "src/modules/mindmap/hooks",
    "src/modules/mindmap/types",
    "src/features/material-search/components",
    "src/features/material-search/utils"
)

foreach ($dir in $dirsToCheck) {
    if (Test-Path $dir) {
        $hasFiles = Get-ChildItem -Path $dir -ErrorAction SilentlyContinue
        if ($null -eq $hasFiles) {
            # 目录为空，可以删除
            Remove-Item -Path $dir -Force
            Write-Host "已删除空目录: $dir" -ForegroundColor Yellow
        }
        else {
            Write-Host "目录非空，保留: $dir" -ForegroundColor DarkYellow
            Write-Host "  包含文件:" -ForegroundColor DarkCyan
            foreach ($item in $hasFiles) {
                Write-Host "  - $($item.Name)" -ForegroundColor DarkCyan
            }
        }
    }
}

Write-Host "文件删除完成。" -ForegroundColor Green 