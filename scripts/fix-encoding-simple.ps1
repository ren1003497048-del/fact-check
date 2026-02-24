# Cursor Terminal Encoding Fix
# Fix Chinese character display issues in Cursor terminal

Write-Host "=== Cursor Terminal Encoding Fix ===" -ForegroundColor Cyan
Write-Host ""

$profilePath = $PROFILE
$profileDir = Split-Path $profilePath -Parent

if (-not (Test-Path $profileDir)) {
    Write-Host "Creating PowerShell profile directory: $profileDir" -ForegroundColor Yellow
    New-Item -Path $profileDir -ItemType Directory -Force | Out-Null
}

$scriptContent = @'
# PowerShell UTF-8 Encoding Configuration
# Fix Cursor terminal Chinese encoding issues

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$env:LANG = "zh_CN.UTF-8"

if ($null -eq $IsWindows -or $IsWindows) {
    try {
        chcp 65001 | Out-Null
    } catch {
        # Ignore error
    }
}
'@

Write-Host "Writing PowerShell profile: $profilePath" -ForegroundColor Yellow
$scriptContent | Out-File -FilePath $profilePath -Encoding UTF8 -Force

Write-Host ""
Write-Host "Configuration completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Restart Cursor terminal (close and reopen terminal tabs)" -ForegroundColor White
Write-Host "2. Test with: echo 'Test Chinese'" -ForegroundColor White
Write-Host "3. If still issues, run: . `$PROFILE" -ForegroundColor White
Write-Host ""
Write-Host "Profile content:" -ForegroundColor Gray
Get-Content $profilePath
