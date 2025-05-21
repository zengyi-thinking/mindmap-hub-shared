# 思维导图模块整理脚本
# 本脚本将实现以下操作：
# 1. 创建新的bridges目录结构
# 2. 将桥接文件移动到适当位置
# 3. 删除冗余的桥接文件
# 4. 创建索引文件

Write-Host "开始整理思维导图模块..." -ForegroundColor Green

# 创建新的目录结构
$directories = @(
    "src/modules/mindmap/bridges/components",
    "src/modules/mindmap/bridges/hooks",
    "src/modules/mindmap/bridges/types",
    "src/features/material-search/bridges/components", 
    "src/features/material-search/bridges/utils"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -Path $dir -ItemType Directory -Force | Out-Null
        Write-Host "已创建目录: $dir" -ForegroundColor Cyan
    }
}

# 移动模块组件到bridges目录
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

foreach ($file in $componentFiles) {
    if (Test-Path $file) {
        $newLocation = $file -replace "components", "bridges/components"
        Copy-Item -Path $file -Destination $newLocation -Force
        Write-Host "已移动文件: $file -> $newLocation" -ForegroundColor Cyan
    }
    else {
        Write-Host "文件不存在: $file" -ForegroundColor Yellow
    }
}

# 移动material-search组件到bridges目录
$materialSearchFiles = @(
    @{
        Source      = "src/features/material-search/components/MaterialMermaidMindMap.tsx"
        Destination = "src/features/material-search/bridges/components/MaterialMermaidMindMap.tsx"
    },
    @{
        Source      = "src/features/material-search/utils/mermaidGenerator.ts"
        Destination = "src/features/material-search/bridges/utils/mermaidGenerator.ts"
    }
)

foreach ($fileMapping in $materialSearchFiles) {
    if (Test-Path $fileMapping.Source) {
        Copy-Item -Path $fileMapping.Source -Destination $fileMapping.Destination -Force
        Write-Host "已移动文件: $($fileMapping.Source) -> $($fileMapping.Destination)" -ForegroundColor Cyan
    }
    else {
        Write-Host "文件不存在: $($fileMapping.Source)" -ForegroundColor Yellow
    }
}

# 移动types桥接文件
if (Test-Path "src/modules/mindmap/types/mindmap.ts") {
    Copy-Item -Path "src/modules/mindmap/types/mindmap.ts" -Destination "src/modules/mindmap/bridges/types/mindmap.ts" -Force
    Write-Host "已移动文件: src/modules/mindmap/types/mindmap.ts -> src/modules/mindmap/bridges/types/mindmap.ts" -ForegroundColor Cyan
}

# 移动hooks桥接文件
Copy-Item -Path "src/modules/mindmap/hooks/index.ts" -Destination "src/modules/mindmap/bridges/hooks/index.ts" -Force
Write-Host "已移动文件: src/modules/mindmap/hooks/index.ts -> src/modules/mindmap/bridges/hooks/index.ts" -ForegroundColor Cyan

# 创建组件索引文件
$componentsIndexContent = @"
/**
 * 桥接组件索引文件 - 导出所有思维导图组件桥接
 */

export { default as MindMapCard } from './MindMapCard';
export { default as MindMapControls } from './MindMapControls';
export { default as MindMapEditor } from './MindMapEditor';
export { default as MindMapEdge } from './MindMapEdge';
export { default as MindMapHeader } from './MindMapHeader';
export { default as MindMapTags } from './MindMapTags';
export { default as MindMapWorkspace } from './MindMapWorkspace';
export { default as MaterialNode } from './MaterialNode';
export { default as NodeEditDialog } from './NodeEditDialog';
"@

Set-Content -Path "src/modules/mindmap/bridges/components/index.ts" -Value $componentsIndexContent -Encoding UTF8
Write-Host "已创建索引文件: src/modules/mindmap/bridges/components/index.ts" -ForegroundColor Green

# 创建material-search组件索引文件
$materialSearchComponentsIndexContent = @"
/**
 * 桥接组件索引文件 - 导出所有material-search组件桥接
 */

export { MaterialMermaidMindMap } from './MaterialMermaidMindMap';
"@

Set-Content -Path "src/features/material-search/bridges/components/index.ts" -Value $materialSearchComponentsIndexContent -Encoding UTF8
Write-Host "已创建索引文件: src/features/material-search/bridges/components/index.ts" -ForegroundColor Green

# 创建material-search工具索引文件
$materialSearchUtilsIndexContent = @"
/**
 * 桥接工具索引文件 - 导出所有material-search工具桥接
 */

export * from './mermaidGenerator';
"@

Set-Content -Path "src/features/material-search/bridges/utils/index.ts" -Value $materialSearchUtilsIndexContent -Encoding UTF8
Write-Host "已创建索引文件: src/features/material-search/bridges/utils/index.ts" -ForegroundColor Green

# 创建模块统一索引文件
$moduleBridgesIndexContent = @"
/**
 * 思维导图桥接模块索引文件
 * 统一导出所有桥接组件、hooks和类型
 */

export * from './components';
export * from './hooks';
export * from './types';
"@

Set-Content -Path "src/modules/mindmap/bridges/index.ts" -Value $moduleBridgesIndexContent -Encoding UTF8
Write-Host "已创建索引文件: src/modules/mindmap/bridges/index.ts" -ForegroundColor Green

# 创建material-search统一索引文件
$materialSearchBridgesIndexContent = @"
/**
 * Material Search桥接模块索引文件
 * 统一导出所有桥接组件和工具
 */

export * from './components';
export * from './utils';
"@

Set-Content -Path "src/features/material-search/bridges/index.ts" -Value $materialSearchBridgesIndexContent -Encoding UTF8
Write-Host "已创建索引文件: src/features/material-search/bridges/index.ts" -ForegroundColor Green

# 创建types索引文件
$typesIndexContent = @"
/**
 * 桥接类型索引文件 - 导出所有思维导图类型桥接
 */

export * from './mindmap';
"@

Set-Content -Path "src/modules/mindmap/bridges/types/index.ts" -Value $typesIndexContent -Encoding UTF8
Write-Host "已创建索引文件: src/modules/mindmap/bridges/types/index.ts" -ForegroundColor Green

# 删除冗余文件（可选，取消注释以执行删除）
$filesToDelete = @(
    # 冗余的MaterialMermaidMindMap桥接文件
    "src/features/material-search/MaterialMermaidMindMap.tsx",
    
    # 单独的hook桥接文件（index.ts已经导出所有hooks）
    "src/modules/mindmap/hooks/useMindMap.ts",
    "src/modules/mindmap/hooks/useMindMapConnections.ts",
    "src/modules/mindmap/hooks/useMindMapData.ts",
    "src/modules/mindmap/hooks/useMindMapEditor.ts",
    "src/modules/mindmap/hooks/useMindMapLayout.ts",
    "src/modules/mindmap/hooks/useMindMapNodeEdit.ts",
    "src/modules/mindmap/hooks/useMyMindMaps.ts"
)

$confirmDelete = Read-Host "是否删除冗余文件? (Y/N)"
if ($confirmDelete -eq "Y" -or $confirmDelete -eq "y") {
    foreach ($file in $filesToDelete) {
        if (Test-Path $file) {
            Remove-Item -Path $file -Force
            Write-Host "已删除文件: $file" -ForegroundColor Yellow
        }
        else {
            Write-Host "文件不存在: $file" -ForegroundColor DarkYellow
        }
    }
}
else {
    Write-Host "已跳过删除操作，冗余文件将保留" -ForegroundColor Magenta
}

# 创建自动更新导入路径的脚本（可选）
$updateImportsScriptContent = @"
# 更新导入路径脚本
# 本脚本将查找并替换对旧桥接文件的导入，改为使用新的导入方式
# 注意：此脚本可能会影响文件内容，请提前备份重要文件

Write-Host "开始更新导入路径..." -ForegroundColor Green

# 找出所有需要更新的文件
\$sourceFiles = Get-ChildItem -Path "src" -Recurse -Include "*.ts","*.tsx" | Where-Object { \$_.FullName -notlike "*node_modules*" }

foreach (\$file in \$sourceFiles) {
    \$content = Get-Content -Path \$file.FullName -Raw
    \$originalContent = \$content

    # 更新组件导入
    \$content = \$content -replace "from ['\""]@/modules/mindmap/components/(.*?)['\"]", "from '@/modules/mindmap/bridges/components'"
    \$content = \$content -replace "from ['\""]@/features/material-search/components/MaterialMermaidMindMap['\"]", "from '@/features/material-search/bridges/components'"
    
    # 更新hooks导入
    \$content = \$content -replace "from ['\""]@/modules/mindmap/hooks/(.*?)['\"]", "from '@/modules/mindmap/bridges/hooks'"
    
    # 更新types导入
    \$content = \$content -replace "from ['\""]@/modules/mindmap/types/mindmap['\"]", "from '@/modules/mindmap/bridges/types'"
    
    # 更新utils导入
    \$content = \$content -replace "from ['\""]@/features/material-search/utils/mermaidGenerator['\"]", "from '@/features/material-search/bridges/utils'"

    # 只有当内容有变化时才写入文件
    if (\$content -ne \$originalContent) {
        Set-Content -Path \$file.FullName -Value \$content
        Write-Host "已更新导入路径: \$(\$file.FullName)" -ForegroundColor Cyan
    }
}

Write-Host "导入路径更新完成" -ForegroundColor Green
"@

Set-Content -Path "update-imports.ps1" -Value $updateImportsScriptContent -Encoding UTF8
Write-Host "已创建导入路径更新脚本: update-imports.ps1" -ForegroundColor Green

Write-Host "项目整理完成!" -ForegroundColor Green
Write-Host "注意：已保留原始文件，新文件位于bridges目录中。确认新结构正常工作后，可执行删除操作。" -ForegroundColor Yellow
Write-Host "要更新导入路径，可运行 ./update-imports.ps1 脚本，但请提前备份重要文件。" -ForegroundColor Yellow 