@echo off
echo Starting Server...
start "Server" cmd /k "cd server && npm start"
timeout /t 5
echo Starting Client...
start "Client" cmd /k "cd client && npm run dev"
echo App started! Client running on port 5173, Server on port 5000.
