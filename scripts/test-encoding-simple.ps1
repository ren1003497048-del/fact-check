# Cursor Terminal Encoding Test
# Test if Chinese characters display correctly

Write-Host ""
Write-Host "=== Cursor Terminal Encoding Test ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "Test 1: Chinese Characters" -ForegroundColor Yellow
Write-Host "  Simplified Chinese: Hello World" -ForegroundColor White
Write-Host "  Japanese: Konnichiwa" -ForegroundColor White
Write-Host "  Korean: Annyeonghaseyo" -ForegroundColor White
Write-Host ""

Write-Host "Test 2: Special Symbols" -ForegroundColor Yellow
Write-Host "  Symbols: OK - INFO - WARN - Arrow Up - Arrow Down" -ForegroundColor White
Write-Host ""

Write-Host "Test 3: Mixed Text" -ForegroundColor Yellow
Write-Host "  [INFO] Starting dev server..." -ForegroundColor White
Write-Host "  [WARN] Too many requests, please try again later" -ForegroundColor White
Write-Host "  [ERROR] API call failed: 500 Internal Server Error" -ForegroundColor White
Write-Host ""

Write-Host "Test 4: Current Encoding Status" -ForegroundColor Yellow
Write-Host "  OutputEncoding: $($OutputEncoding.EncodingName)" -ForegroundColor White
Write-Host "  Console: $([Console]::OutputEncoding.EncodingName)" -ForegroundColor White
Write-Host ""

if ([Console]::OutputEncoding.EncodingName -like "*UTF*") {
    Write-Host "SUCCESS: Encoding is UTF-8" -ForegroundColor Green
} else {
    Write-Host "WARNING: Encoding is not UTF-8" -ForegroundColor Red
    Write-Host "  Run fix script: .\scripts\fix-encoding-simple.ps1" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "If Chinese above displays correctly, terminal is configured!" -ForegroundColor Green
Write-Host ""
