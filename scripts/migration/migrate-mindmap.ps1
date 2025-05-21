# 思维导图文件迁移脚本

# 创建目标目录结构
$directories = @(
    "src/domains/mindmap/external/frameworks",
    "src/domains/mindmap/external/ui/components"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir
    }
}

# 移动特定文件
$filesToMove = @{
    # features目录下的思维导图文件移动到domains目录下
    "src/features/materials/components/mindmap/MindMapCreateDialog.tsx"    = "src/domains/mindmap/external/ui/components/MindMapCreateDialog.tsx"
    "src/features/materials/components/mindmap/MaterialMermaidMindMap.tsx" = "src/domains/mindmap/external/ui/components/MaterialMermaidMindMap.tsx"
    # 可能存在的其他文件
    "src/features/material-search/MaterialMermaidMindMap.tsx"              = "src/domains/mindmap/external/ui/components/MaterialSearchMindMap.tsx"
}

# 移动文件
foreach ($source in $filesToMove.Keys) {
    $destination = $filesToMove[$source]
    
    if (Test-Path $source) {
        # 确保目标目录存在
        $destDir = Split-Path -Parent $destination
        if (!(Test-Path $destDir)) {
            New-Item -ItemType Directory -Force -Path $destDir
        }
        
        # 移动文件
        Copy-Item -Path $source -Destination $destination -Force
        Write-Host "已移动: $source -> $destination"
    }
    else {
        Write-Host "源文件不存在: $source"
    }
}

# 检查旧的模块目录
if (Test-Path "src/modules/mindmap") {
    # 复制可能有用的适配器文件到新的目录结构
    if (Test-Path "src/modules/mindmap/components/MindMapAdapter.tsx") {
        Copy-Item -Path "src/modules/mindmap/components/MindMapAdapter.tsx" -Destination "src/domains/mindmap/external/ui/MindMapAdapter.tsx" -Force
        Write-Host "已复制适配器: src/modules/mindmap/components/MindMapAdapter.tsx -> src/domains/mindmap/external/ui/MindMapAdapter.tsx"
    }
    
    # 我们暂时不删除旧目录，直到确认新的结构正常工作
    Write-Host "旧的模块目录存在，请在确认新结构正常工作后手动删除。"
}

Write-Host "迁移完成。请检查文件是否正确移动，然后手动更新导入路径。" 