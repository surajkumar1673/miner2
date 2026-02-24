# Medical Appointment System

## How to Run

### Option 1: One-Click Start (Recommended)
Double-click the `start_app.bat` file in this directory. 
This will verify that MongoDB is connected and launch both the **Server** (backend) and **Client** (frontend) in separate windows.

### Option 2: Manual Start
If you prefer to run them separately, you will need two terminal windows:

**1. Start the Server:**
```powershell
cd server
npm start
```
*Runs on http://localhost:5000*

**2. Start the Client:**
```powershell
cd client
npm run dev
```
*Runs on http://localhost:5173*
