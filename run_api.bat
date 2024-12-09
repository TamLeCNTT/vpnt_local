@echo off
:start
cd /d api
python API_v2.py
echo "API đã dừng, đang khởi động lại..."
timeout /t 5 /nobreak
goto start
