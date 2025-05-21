# 备份目录清理脚本
# 用于清理或归档旧的备份目录

# 创建日志文件
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logFile = "backup_cleanup_log_${timestamp}.txt"
Start-Transcript -Path $logFile -Append

# 定义要处理的备份目录
$backupDirs = @(
    "backup_20250422_172634",
    "backup_20250422_172621"
)

# 创建归档目录
$archiveDir = "archived_backups"
if (-not (Test-Path $archiveDir)) {
    New-Item -Path $archiveDir -ItemType Directory -Force | Out-Null
    Write-Host "创建归档目录: $archiveDir" -ForegroundColor Green
}

Write-Host "=== 开始处理备份目录 ===" -ForegroundColor Cyan

# 询问用户选择处理方式
Write-Host "`n以下备份目录将被处理:" -ForegroundColor Yellow
foreach ($dir in $backupDirs) {
    if (Test-Path $dir) {
        Write-Host "- $dir" -ForegroundColor Yellow
    }
    else {
        Write-Host "- $dir (不存在)" -ForegroundColor Gray
    }
}

Write-Host "`n请选择处理方式:" -ForegroundColor Cyan
Write-Host "1. 移动到归档目录 (推荐)" -ForegroundColor White
Write-Host "2. 完全删除" -ForegroundColor White
Write-Host "3. 取消操作" -ForegroundColor White

$choice = Read-Host "请输入选项 (1-3)"

switch ($choice) {
    "1" {
        # 移动到归档目录
        Write-Host "`n正在将备份目录移动到归档目录..." -ForegroundColor Cyan
        $movedCount = 0
        
        foreach ($dir in $backupDirs) {
            if (Test-Path $dir) {
                $targetDir = Join-Path $archiveDir $dir
                
                # 如果目标目录已存在，添加时间戳
                if (Test-Path $targetDir) {
                    $newName = "$dir`_archived_$timestamp"
                    $targetDir = Join-Path $archiveDir $newName
                }
                
                # 移动目录
                Move-Item -Path $dir -Destination $targetDir -Force
                Write-Host "✓ 已归档: $dir -> $targetDir" -ForegroundColor Green
                $movedCount++
            }
            else {
                Write-Host "× 目录不存在: $dir" -ForegroundColor Yellow
            }
        }
        
        Write-Host "`n已将 $movedCount 个备份目录移动到归档目录" -ForegroundColor Green
    }
    "2" {
        # 删除备份目录
        Write-Host "`n警告: 此操作将永久删除所选备份目录!" -ForegroundColor Red
        $confirmation = Read-Host "确认删除这些目录吗? (输入 'yes' 继续)"
        
        if ($confirmation -eq "yes") {
            $removedCount = 0
            
            foreach ($dir in $backupDirs) {
                if (Test-Path $dir) {
                    # 删除目录
                    Remove-Item -Path $dir -Recurse -Force
                    Write-Host "✓ 已删除: $dir" -ForegroundColor Green
                    $removedCount++
                }
                else {
                    Write-Host "× 目录不存在: $dir" -ForegroundColor Yellow
                }
            }
            
            Write-Host "`n已永久删除 $removedCount 个备份目录" -ForegroundColor Green
        }
        else {
            Write-Host "操作已取消" -ForegroundColor Yellow
        }
    }
    "3" {
        Write-Host "操作已取消" -ForegroundColor Yellow
    }
    default {
        Write-Host "无效选项，操作已取消" -ForegroundColor Red
    }
}

Write-Host "`n=== 备份目录处理完成 ===" -ForegroundColor Cyan

Stop-Transcript
Write-Host "`n处理日志已保存到: $logFile" -ForegroundColor Green 