# Stop any running Nuxt processes
Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*nuxt*" } | Stop-Process -Force

# Remove cache directories
Write-Host "Removing cache directories..." -ForegroundColor Green
if (Test-Path ".nuxt") {
    Remove-Item -Recurse -Force .nuxt -ErrorAction SilentlyContinue
}
if (Test-Path ".output") {
    Remove-Item -Recurse -Force .output -ErrorAction SilentlyContinue
}
if (Test-Path "node_modules/.vite") {
    Remove-Item -Recurse -Force node_modules/.vite -ErrorAction SilentlyContinue
}

# Clear browser cache instructions
Write-Host "Please also clear your browser cache by:" -ForegroundColor Yellow
Write-Host "1. Opening Developer Tools (F12)" -ForegroundColor Yellow
Write-Host "2. Right-clicking the refresh button and selecting 'Empty Cache and Hard Reload'" -ForegroundColor Yellow
Write-Host "3. Or use Ctrl+Shift+R for a hard refresh" -ForegroundColor Yellow

# Start the development server
Write-Host "Starting development server..." -ForegroundColor Green
pnpm run dev 