require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const PORT = process.env.PORT || 5000;
const BOT_TOKEN = process.env.BOT_API_TOKEN;

// Validate environment variables
if (!BOT_TOKEN) {
  console.error('BOT_API_TOKEN is not set in environment variables');
  process.exit(1);
}

if (!process.env.FRONTEND_URL) {
  console.error('FRONTEND_URL is not set in environment variables');
  process.exit(1);
}

// Initialize Telegram Bot with error handling
let bot;
try {
  bot = new TelegramBot(BOT_TOKEN, { polling: true });
  console.log('Telegram bot successfully initialized');
} catch (error) {
  console.error('Failed to initialize Telegram bot:', error);
  process.exit(1);
}

// Handle bot polling errors
bot.on('polling_error', (error) => {
  console.error('Bot polling error:', error);
});

// Handle /start command with error handling
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  
  try {
    // Create keyboard with Web App button
    const keyboard = {
      keyboard: [
        [{
          text: '🚀 Open Web App',
          web_app: { url: process.env.FRONTEND_URL }
        }]
      ],
      resize_keyboard: true
    };

    await bot.sendMessage(
      chatId, 
      '👋 Welcome to our Mini App!\n\nClick the button below to open the application:', 
      { reply_markup: keyboard }
    );
    console.log(`Start command handled for chat ID: ${chatId}`);
  } catch (error) {
    console.error(`Error handling /start command for chat ${chatId}:`, error);
    bot.sendMessage(chatId, '❌ Sorry, something went wrong. Please try again later.');
  }
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://brot-tg-web.vercel.app'
    : 'http://localhost:3000'
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    botActive: !!bot
  });
});

// Update routes to use /api prefix in production
const apiPrefix = process.env.NODE_ENV === 'production' ? '/api' : '';

// Handle data from Mini App
app.post(`${apiPrefix}/send-data`, async (req, res) => {
  try {
    console.log("Received data:", req.body);
    
    // Validate request body
    if (!req.body || !req.body.message) {
      return res.status(400).json({ 
        error: "Bad Request", 
        message: "Request body must contain a 'message' field" 
      });
    }

    // Process the data
    // TODO: Add your data processing logic here

    res.status(200).json({ 
      message: "Data received successfully!",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error processing data:", error);
    res.status(500).json({ 
      error: "Internal server error",
      message: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`${new Date().toISOString()} - Error:`, err);
  res.status(500).json({ 
    error: "Something went wrong!",
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server with error handling
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
}); 