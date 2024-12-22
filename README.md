# Telegram Mini App

## Project Structure
- `backend/` - Node.js backend server
- `frontend/` - React frontend application

## Setup Instructions

### 1. Start the Backend Server
Open a terminal and run:
```bash
cd backend
npm install
npm run dev
```
The backend will run on http://localhost:5000

### 2. Start the Frontend Server
Open a new terminal and run:
```bash
cd frontend
npm install
npm start
```
The frontend will run on http://localhost:3000

## Environment Variables
The `.env` file in the root directory contains:
- `PORT`: Backend server port (5000)
- `FRONTEND_URL`: Frontend application URL
- `BOT_API_TOKEN`: Your Telegram Bot API token
- `NODE_ENV`: Environment mode (development/production)

## Important Notes
- Make sure to run both servers simultaneously
- Keep both terminal windows open while developing
- The backend and frontend need to be started separately