# ==========================================
# Cursor 终端编码修复脚本
# ==========================================
# 用途：修复 Cursor 内置终端中文乱码问题
# 使用：在 PowerShell 中运行此脚本

Write-Host "=== Cursor 终端编码修复 ===" -ForegroundColor Cyan
Write-Host ""

# 检查 PowerShell 配置文件是否存在
$profilePath = $PROFILE
$profileDir = Split-Path $profilePath -Parent

if (-not (Test-Path $profileDir)) {
    Write-Host "创建 PowerShell 配置目录: $profileDir" -ForegroundColor Yellow
    New-Item -Path $profileDir -ItemType Directory -Force | Out-Null
}

# 配置内容
$profileContent = @'
# ==========================================
# PowerShell UTF-8 编码配置
# ==========================================
# 修复 Cursor 终端中文乱码

# 设置控制台编码为 UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# 设置语言环境
$env:LANG = "zh_CN.UTF-8"

# 修改代码页为 UTF-8 (65001)
if ($IsWindows -or $null -eq $IsWindows) {
    try {
        [System.Console]::OutputEncoding = [System.Text.Encoding]::UTF8
        chcp 65001 | Out-Null
    } catch {
        # 忽略错误（在某些环境下 chcp 可能不可用）
    }
}

# 显示编码状态
Write-Host "✓ 终端编码已设置为 UTF-8" -ForegroundColor Green
Write-Host "  OutputEncoding: $($OutputEncoding.EncodingName)" -ForegroundColor Gray
Write-Host "  Console: $([Console]::OutputEncoding.EncodingName)" -ForegroundColor Gray
'@

# 写入配置文件
Write-Host "写入 PowerShell 配置文件: $profilePath" -ForegroundColor Yellow
$profileContent | Out-File -FilePath $profilePath -Encoding UTF8 -Force

Write-Host ""
Write-Host "✓ 配置完成！" -ForegroundColor Green
Write-Host ""
Write-Host "后续步骤：" -ForegroundColor Cyan
Write-Host "1. 重启 Cursor 终端（关闭所有终端标签页后重新打开）" -ForegroundColor White
Write-Host "2. 运行测试命令验证: echo '测试中文 / Test: 中文简体'" -ForegroundColor White
Write-Host "3. 如果仍有乱码，手动运行: . `$PROFILE" -ForegroundColor White
Write-Host ""
Write-Host "当前配置内容：" -ForegroundColor Gray
Get-Content $profilePath | Write-Host
