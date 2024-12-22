# Telegram Mini App

## Deployment

### Vercel Setup
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel:
   - `BOT_API_TOKEN`
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://brot-tg-web.vercel.app`
3. Deploy

### Development
- Frontend: `npm run start:frontend`
- Backend: `npm run start:backend`

### Production Build
```bash
npm run build
```

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
- `FRONTEND_URL`: Frontend application URL (http://localhost:3000)
- `BOT_API_TOKEN`: Your Telegram Bot API token

## Important Notes
- Make sure to run both servers simultaneously
- Keep both terminal windows open while developing
- The backend and frontend need to be started separately