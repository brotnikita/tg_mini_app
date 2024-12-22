require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');

// Constants
const app = express();
const PORT = process.env.PORT || 5000;
const BOT_TOKEN = process.env.BOT_API_TOKEN;
const ALLOWED_ORIGINS = [process.env.FRONTEND_URL, 'http://localhost:3000'];

/**
 * Environment validation
 * Checks if required environment variables are set
 */
const validateEnvironment = () => {
  const requiredVars = {
    'BOT_API_TOKEN': BOT_TOKEN,
    'FRONTEND_URL': process.env.FRONTEND_URL
  };

  for (const [name, value] of Object.entries(requiredVars)) {
    if (!value) {
      console.error(`${name} is not set in environment variables`);
      process.exit(1);
    }
  }
};

validateEnvironment();

/**
 * Initialize Telegram Bot
 * Sets up the bot with error handling and polling
 */
const initializeBot = () => {
  try {
    const bot = new TelegramBot(BOT_TOKEN, { polling: true });
    console.log('Telegram bot successfully initialized');
    return bot;
  } catch (error) {
    console.error('Failed to initialize Telegram bot:', error);
    process.exit(1);
  }
};

const bot = initializeBot();

// Handle bot polling errors
bot.on('polling_error', (error) => {
  console.error('Bot polling error:', error);
});

/**
 * Handle /start command
 * Creates a keyboard with Web App button and sends welcome message
 */
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  
  try {
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

// Middleware setup
app.use(cors({
  origin: ALLOWED_ORIGINS,
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Request logging middleware with timestamp
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

/**
 * Health check endpoint
 * Returns server status and bot availability
 */
app.get("/health", (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    botActive: !!bot,
    environment: process.env.NODE_ENV
  });
});

// API prefix for production environment
const apiPrefix = process.env.NODE_ENV === 'production' ? '/api' : '';

/**
 * Handle data from Mini App
 * Validates and processes incoming data
 */
app.post(`${apiPrefix}/send-data`, async (req, res) => {
  const timestamp = new Date().toISOString();
  
  try {
    console.log(`[${timestamp}] Received data:`, req.body);
    
    // Input validation
    if (!req.body?.message) {
      return res.status(400).json({ 
        error: "Bad Request", 
        message: "Request body must contain a 'message' field",
        timestamp
      });
    }

    // Process the data
    // TODO: Add your data processing logic here

    res.status(200).json({ 
      message: "Data received successfully!",
      timestamp
    });
  } catch (error) {
    console.error(`[${timestamp}] Error processing data:`, error);
    res.status(500).json({ 
      error: "Internal server error",
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp
    });
  }
});

// Global error handling middleware
app.use((err, req, res, next) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] Error:`, err);
  
  res.status(500).json({ 
    error: "Something went wrong!",
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    timestamp
  });
});

// Server initialization with error handling
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
}); 