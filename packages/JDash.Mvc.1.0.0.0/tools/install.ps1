param($installPath, $toolsPath, $package, $project)
Start-Process $installPath'\lib\setup\JDash.Mvc.PackageInstaller.exe'
Write-Host "You need to restart Visual Studio for the plugin to be loaded." -BackgroundColor Black -ForegroundColor Yellow
