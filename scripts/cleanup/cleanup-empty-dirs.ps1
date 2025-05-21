# 清理空目录脚本
# 本脚本将删除不再需要的空目录

Write-Host "开始清理空目录..." -ForegroundColor Green

# 要检查的目录列表
$dirsToCheck = @(
    "src/modules/mindmap/components",
    "src/modules/mindmap/hooks",
    "src/modules/mindmap/types",
    "src/features/material-search/components",
    "src/features/material-search/utils"
)

# 检查并删除空目录
foreach ($dir in $dirsToCheck) {
    if (Test-Path $dir) {
        $hasFiles = Get-ChildItem -Path $dir -ErrorAction SilentlyContinue
        if ($null -eq $hasFiles) {
            # 目录为空，可以删除
            Remove-Item -Path $dir -Force
            Write-Host "已删除空目录: $dir" -ForegroundColor Yellow
        }
        else {
            Write-Host "目录非空，保留: $dir" -ForegroundColor Cyan
            Write-Host "  包含文件:" -ForegroundColor DarkCyan
            foreach ($item in $hasFiles) {
                Write-Host "  - $($item.Name)" -ForegroundColor DarkCyan
            }
        }
    }
    else {
        Write-Host "目录不存在: $dir" -ForegroundColor Magenta
    }
}

Write-Host "空目录清理完成。" -ForegroundColor Green 