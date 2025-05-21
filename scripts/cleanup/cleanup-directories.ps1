# 冗余目录清理脚本
# 此脚本在完成迁移和验证后，用于删除冗余的目录结构

# 创建日志文件
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logFile = "cleanup_log_${timestamp}.txt"
Start-Transcript -Path $logFile -Append

# 检查是否存在标记文件
$markFile = "directories-to-remove.txt"
if (-not (Test-Path $markFile)) {
    Write-Host "错误: 未找到标记文件 $markFile" -ForegroundColor Red
    Write-Host "请先运行目录合并和验证脚本" -ForegroundColor Yellow
    Stop-Transcript
    exit 1
}

# 读取要删除的目录
$directoriesToRemove = Get-Content -Path $markFile

# 提示确认
Write-Host "=== 即将删除以下目录 ===" -ForegroundColor Cyan
foreach ($dir in $directoriesToRemove) {
    if (Test-Path $dir) {
        Write-Host "- $dir" -ForegroundColor Yellow
    }
    else {
        Write-Host "- $dir (不存在)" -ForegroundColor Gray
    }
}

Write-Host "`n警告: 此操作将删除上述所有目录及其内容!" -ForegroundColor Red
Write-Host "建议在执行此脚本前备份您的项目" -ForegroundColor Red

$confirmation = Read-Host "`n确认删除这些目录吗? (输入 'yes' 继续)"

if ($confirmation -ne "yes") {
    Write-Host "操作已取消" -ForegroundColor Yellow
    Stop-Transcript
    exit 0
}

# 删除目录
$removedCount = 0
foreach ($dir in $directoriesToRemove) {
    if (Test-Path $dir) {
        try {
            Remove-Item -Path $dir -Recurse -Force
            Write-Host "✓ 已删除: $dir" -ForegroundColor Green
            $removedCount++
        }
        catch {
            Write-Host "✗ 删除失败: $dir" -ForegroundColor Red
            Write-Host "  错误: $_" -ForegroundColor Red
        }
    }
    else {
        Write-Host "- 跳过 (不存在): $dir" -ForegroundColor Gray
    }
}

# 删除标记文件
if (Test-Path $markFile) {
    Remove-Item -Path $markFile -Force
    Write-Host "`n已删除标记文件: $markFile" -ForegroundColor Green
}

Write-Host "`n=== 清理完成 ===" -ForegroundColor Cyan
Write-Host "已删除 $removedCount 个目录" -ForegroundColor Green
Write-Host "`n恭喜! 目录结构整理和代码迁移已全部完成" -ForegroundColor Green
Write-Host "项目现在使用领域驱动设计架构" -ForegroundColor Green

Stop-Transcript
Write-Host "`n清理日志已保存到: $logFile" -ForegroundColor Green 