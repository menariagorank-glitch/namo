import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env, isWhatsAppConfigured, getWhatsAppDestinationNumber } from './config/env.js';
import apiRouter from './routes/index.js';
import enquiryRoutes from './routes/enquiry.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { notFoundHandler } from './middleware/notFound.middleware.js';
import { apiRateLimiter } from './middleware/rateLimit.middleware.js';
import { logger } from './utils/logger.js';
import { WhatsAppService } from './services/whatsapp/whatsapp.service.js';

export const createApp = (): Application => {
  const app = express();

  // Security HTTP headers
  app.use(helmet());

  // CORS Configuration
  const allowedOrigins = [
    env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, postman)
        if (!origin || allowedOrigins.includes(origin) || env.NODE_ENV === 'development') {
          callback(null, true);
        } else {
          callback(new Error(`CORS origin ${origin} not allowed`));
        }
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );

  // General rate limiting
  app.use(apiRateLimiter);

  // Cookie Parsing Middleware
  app.use(cookieParser());

  // Body Parsing Middleware with request size limits
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // Direct Enquiry Endpoints
  app.use('/api/enquiry', enquiryRoutes);

  // Versioned API Routes
  app.use('/api/v1', apiRouter);

  // Real-time QR Code Web Viewer (Fixes Render log buffering issues)
  app.get('/api/qr', (req, res) => {
    const qrData = WhatsAppService.getLatestQrCode();
    const isReady = WhatsAppService.getIsReady();
    
    if (isReady) {
      res.send(`<h2>✅ WhatsApp is successfully connected! You can close this window.</h2>`);
      return;
    }
    
    if (!qrData) {
      res.send(`<h2>⏳ Generating QR Code... Please refresh in a few seconds.</h2>`);
      return;
    }

    res.send(`
      <html>
      <head>
        <title>WhatsApp QR Scan</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
        <style>
          body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #f0f2f5; }
          .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center; }
          #qrcode { margin: 20px auto; display: flex; justify-content: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Scan to Link WhatsApp</h2>
          <p>Scan this QR code with your WhatsApp mobile app.</p>
          <div id="qrcode"></div>
          <p style="color: gray; font-size: 14px;">(This code refreshes automatically. If it fails, refresh the page)</p>
        </div>
        <script>
          new QRCode(document.getElementById("qrcode"), {
            text: "${qrData}",
            width: 256,
            height: 256
          });
          
          // Auto-refresh the page every 15 seconds to fetch new QR code if it expires
          setTimeout(() => {
            window.location.reload();
          }, 15000);
        </script>
      </body>
      </html>
    `);
  });

  // 404 Route Handler
  app.use(notFoundHandler);

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
};

const startServer = async () => {
  const app = createApp();

  WhatsAppService.initialize();

  const destNumber = getWhatsAppDestinationNumber();
  if (destNumber) {
    logger.info(`📱 WhatsApp Destination Number configured: ${destNumber}`);
  } else {
    logger.warn('⚠️ WHATSAPP_DESTINATION_NUMBER is not set in environment variables.');
  }

  if (!isWhatsAppConfigured()) {
    logger.info('ℹ️ WhatsApp Cloud API credentials not full set in .env. Operating in dev simulation mode.');
  } else {
    logger.info('🟢 WhatsApp Integration Status: CONFIGURED & READY');
  }

  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 NAMO Hotel Backend running on http://localhost:${env.PORT} in [${env.NODE_ENV}] mode`);
    logger.info(`📋 Health endpoint available at: http://localhost:${env.PORT}/api/v1/health`);
    logger.info(`📩 Primary enquiry endpoint available at: http://localhost:${env.PORT}/api/enquiry`);
  });

  // Graceful Shutdown Logic
  const gracefulShutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);

    server.close(() => {
      logger.info('HTTP server closed cleanly.');
      process.exit(0);
    });

    // Force exit after 10 seconds if shutdown hangs
    setTimeout(() => {
      logger.error('Could not close connections in time, forcing shutdown');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  process.on('unhandledRejection', (reason: unknown) => {
    logger.error('Unhandled Promise Rejection:', reason);
  });

  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception thrown:', error);
    process.exit(1);
  });
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

