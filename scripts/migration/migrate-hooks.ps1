# 思维导图Hooks和Utils迁移脚本

# 创建所需的目录结构
$dirsToCreate = @(
    "src/domains/mindmap/external/ui/hooks",
    "src/domains/mindmap/external/utils/mindmap"
)

foreach ($dir in $dirsToCreate) {
    if (-not (Test-Path $dir)) {
        New-Item -Path $dir -ItemType Directory -Force
        Write-Host "已创建目录: $dir"
    }
}

# 迁移hooks
$hooksToMigrate = @(
    @{
        Source = "src/modules/mindmap/hooks/useMindMap.ts"
        Destination = "src/domains/mindmap/external/ui/hooks/useMindMap.ts"
    },
    @{
        Source = "src/modules/mindmap/hooks/useMindMapConnections.ts"
        Destination = "src/domains/mindmap/external/ui/hooks/useMindMapConnections.ts"
    },
    @{
        Source = "src/modules/mindmap/hooks/useMindMapData.ts"
        Destination = "src/domains/mindmap/external/ui/hooks/useMindMapData.ts"
    },
    @{
        Source = "src/modules/mindmap/hooks/useMindMapNodeEdit.ts"
        Destination = "src/domains/mindmap/external/ui/hooks/useMindMapNodeEdit.ts"
    },
    @{
        Source = "src/modules/mindmap/hooks/useMindMapLayout.ts"
        Destination = "src/domains/mindmap/external/ui/hooks/useMindMapLayout.ts"
    },
    @{
        Source = "src/modules/mindmap/hooks/useMyMindMaps.ts"
        Destination = "src/domains/mindmap/external/ui/hooks/useMyMindMaps.ts"
    },
    @{
        Source = "src/modules/mindmap/hooks/useMindMapEditor.ts"
        Destination = "src/domains/mindmap/external/ui/hooks/useMindMapEditor.ts"
    }
)

# 迁移utils
$utilsToMigrate = @(
    @{
        Source = "src/modules/mindmap/utils/MindMapGenerator.ts"
        Destination = "src/domains/mindmap/external/utils/mindmap/MindMapGenerator.ts"
    }
)

# 迁移hook文件
foreach ($hook in $hooksToMigrate) {
    if (Test-Path $hook.Source) {
        Copy-Item -Path $hook.Source -Destination $hook.Destination -Force
        Write-Host "已迁移hooks: $($hook.Source) -> $($hook.Destination)"
    }
    else {
        Write-Host "文件不存在: $($hook.Source)"
    }
}

# 迁移utils文件
foreach ($util in $utilsToMigrate) {
    if (Test-Path $util.Source) {
        Copy-Item -Path $util.Source -Destination $util.Destination -Force
        Write-Host "已迁移utils: $($util.Source) -> $($util.Destination)"
    }
    else {
        Write-Host "文件不存在: $($util.Source)"
    }
}

# 创建hooks索引文件
$hooksIndexContent = @"
/**
 * 思维导图Hooks索引文件
 * 导出所有思维导图相关的React Hooks
 */

export * from './useMindMap';
export * from './useMindMapConnections';
export * from './useMindMapData';
export * from './useMindMapNodeEdit';
export * from './useMindMapLayout';
export * from './useMyMindMaps';
export * from './useMindMapEditor';
"@

Set-Content -Path "src/domains/mindmap/external/ui/hooks/index.ts" -Value $hooksIndexContent
Write-Host "已创建hooks索引文件: src/domains/mindmap/external/ui/hooks/index.ts"

# 更新主索引文件以包含新的hooks和utils
$mainIndexPath = "src/domains/mindmap/index.ts"
$mainIndexContent = Get-Content -Path $mainIndexPath -Raw

# 添加hooks导出
if (-not ($mainIndexContent -match "// UI Hooks导出")) {
    $hooksExport = @"

// UI Hooks导出
export * from './external/ui/hooks';
"@
    $mainIndexContent = $mainIndexContent + $hooksExport
    Set-Content -Path $mainIndexPath -Value $mainIndexContent
    Write-Host "已更新主索引文件，添加了hooks导出"
}

# 添加MindMapGenerator导出
if (-not ($mainIndexContent -match "MindMapGenerator")) {
    $generatorExport = @"

// MindMap生成器导出
export * from './external/utils/mindmap/MindMapGenerator';
"@
    $mainIndexContent = $mainIndexContent + $generatorExport
    Set-Content -Path $mainIndexPath -Value $mainIndexContent
    Write-Host "已更新主索引文件，添加了MindMapGenerator导出"
}

Write-Host "迁移完成。请检查导入路径并更新相关依赖。" 