# 最终清理脚本
# 删除所有不再需要的桥接文件和目录

Write-Host "开始最终清理过程..." -ForegroundColor Cyan

# 定义要删除的文件列表
$filesToDelete = @(
    # 桥接文件
    "src/features/material-search/bridges/components/MaterialMermaidMindMap.tsx",
    "src/features/material-search/bridges/components/index.ts",
    "src/features/material-search/bridges/utils/mermaidGenerator.ts",
    "src/features/material-search/bridges/utils/index.ts",
    "src/features/material-search/bridges/index.ts"
)

# 删除文件
foreach ($file in $filesToDelete) {
    if (Test-Path $file) {
        Write-Host "正在删除文件: $file" -ForegroundColor Yellow
        Remove-Item $file -Force
        Write-Host "已删除: $file" -ForegroundColor Green
    }
    else {
        Write-Host "文件不存在或已删除: $file" -ForegroundColor Gray
    }
}

# 定义要删除的空目录
$emptyDirsToCheck = @(
    "src/features/material-search/bridges/components",
    "src/features/material-search/bridges/utils",
    "src/features/material-search/bridges"
)

# 删除空目录
foreach ($dir in $emptyDirsToCheck) {
    if (Test-Path $dir) {
        $isEmpty = (Get-ChildItem $dir -Force | Measure-Object).Count -eq 0
        if ($isEmpty) {
            Write-Host "正在删除空目录: $dir" -ForegroundColor Yellow
            Remove-Item $dir -Force
            Write-Host "已删除: $dir" -ForegroundColor Green
        }
        else {
            Write-Host "目录不为空，无法删除: $dir" -ForegroundColor Magenta
            Write-Host "目录内容:" -ForegroundColor DarkYellow
            Get-ChildItem $dir -Force | ForEach-Object {
                Write-Host "  - $($_.FullName)" -ForegroundColor DarkGray
            }
        }
    }
    else {
        Write-Host "目录不存在或已删除: $dir" -ForegroundColor Gray
    }
}

Write-Host "清理过程完成!" -ForegroundColor Cyan 