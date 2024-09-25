@echo off
start /min /d  "C:\Program Files\obs-studio\bin\64bit" "" obs64.exe --collection "KTC Kameror" --scene "Master Scene" --disable-shutdown-check --disable-updater 
echo The OBS Control Panel will start shortly
timeout /t 5 /nobreak
start "" "path\to\control panel's\index.html" 