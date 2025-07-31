# delay-task.ps1
Write-Host "Ready for excute tasks..." -ForegroundColor Yellow
$delaySeconds = 5
$startTime = Get-Date

for ($i = 0; $i -lt $delaySeconds; $i++) {
    $remainingTime = $delaySeconds - $i
    Write-Host "after $remainingTime seconds excute tasks..." -ForegroundColor Cyan
    Start-Sleep -Seconds 1
}

$endTime = Get-Date
$actualDelay = ($endTime - $startTime).TotalSeconds
Write-Host "defere finished, cost $actualDelay seconds" -ForegroundColor Green
Write-Host "start excuting tasks..." -ForegroundColor Green

# 在这里添加你的实际命令
# 例如：
# npm start
# 或其他你需要执行的命令