cd "C:\Users\yepca\Downloads\driveapproved-mvp-fixed"
git init
git remote remove origin
git remote add origin https://github.com/SMG930/driveapproved.git
git add .
git commit -m "Initial DriveApproved MVP Full Upload"
git branch -M main
git push -u origin main --force
pause
