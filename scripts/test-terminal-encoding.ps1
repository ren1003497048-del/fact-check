# ==========================================
# Cursor 终端编码测试脚本
# ==========================================
# 用途：测试终端是否正确显示中文

Write-Host ""
Write-Host "=== Cursor 终端编码测试 ===" -ForegroundColor Cyan
Write-Host ""

# 测试 1: 中文字符
Write-Host "测试 1: 中文字符显示" -ForegroundColor Yellow
Write-Host "  简体中文: 你好世界" -ForegroundColor White
Write-Host "  繁體中文: 你好世界" -ForegroundColor White
Write-Host "  日本語: こんにちは" -ForegroundColor White
Write-Host "  한국어: 안녕하세요" -ForegroundColor White
Write-Host ""

# 测试 2: 特殊符号
Write-Host "测试 2: 特殊符号" -ForegroundColor Yellow
Write-Host "  ✅ ❗ ⚠️ ▲ ▼ ► ◄" -ForegroundColor White
Write-Host ""

# 测试 3: 混合文本
Write-Host "测试 3: 混合文本" -ForegroundColor Yellow
Write-Host "  [INFO] 正在启动开发服务器... / Starting dev server..." -ForegroundColor White
Write-Host "  [WARN] 请求过于频繁，请稍后再试" -ForegroundColor White
Write-Host "  [ERROR] API 调用失败: 500 Internal Server Error" -ForegroundColor White
Write-Host ""

# 测试 4: 当前编码状态
Write-Host "测试 4: 当前编码状态" -ForegroundColor Yellow
Write-Host "  OutputEncoding: $($OutputEncoding.EncodingName)" -ForegroundColor White
Write-Host "  Console Encoding: $([Console]::OutputEncoding.EncodingName)" -ForegroundColor White
Write-Host "  CodePage: $([System.Text.Encoding]::Default.CodePage)" -ForegroundColor White
Write-Host ""

# 判断结果
if ([Console]::OutputEncoding.EncodingName -like "*UTF*") {
    Write-Host "✓ 编码设置正确（UTF-8）" -ForegroundColor Green
} else {
    Write-Host "✗ 编码设置不正确，需要修复" -ForegroundColor Red
    Write-Host "  运行修复脚本: .\scripts\fix-cursor-terminal.ps1" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "如果上方中文显示正常，说明终端配置正确！" -ForegroundColor Green
Write-Host "如果出现乱码，请运行修复脚本。" -ForegroundColor Yellow
Write-Host ""
