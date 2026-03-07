# Auto-commit and push script for Logistix
# Run this script to automatically commit and push all changes

Write-Host "Checking for changes..." -ForegroundColor Cyan

# Add all changes
git add .

# Check if there are changes to commit
$status = git status --porcelain
if ($status) {
    # Get current timestamp
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    
    # Commit with timestamp
    git commit -m "Auto-update: $timestamp"
    
    # Push to GitHub
    Write-Host "Pushing to GitHub..." -ForegroundColor Green
    git push origin master
    
    Write-Host "✓ Changes pushed successfully!" -ForegroundColor Green
} else {
    Write-Host "No changes to commit." -ForegroundColor Yellow
}
