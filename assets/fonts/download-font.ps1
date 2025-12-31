# Script to download Digital-7 Mono font
# Run this script to automatically download the font

$fontUrl = "https://www.1001fonts.com/digital-7-mono-font.html"
$outputPath = Join-Path $PSScriptRoot "digital-7-mono.ttf"

Write-Host "Please download the Digital-7 Mono font manually:"
Write-Host "1. Visit: https://www.1001fonts.com/digital-7-mono-font.html"
Write-Host "2. Or visit: https://www.wfonts.com/font/digital-7-mono"
Write-Host "3. Download the .ttf file"
Write-Host "4. Save it as: $outputPath"
Write-Host ""
Write-Host "Alternatively, you can download from:"
Write-Host "https://github.com/google/fonts (search for digital-7)"

