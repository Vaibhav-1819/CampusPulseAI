import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './db/init';
import reportsRouter from './routes/reports';
import incidentsRouter from './routes/incidents';
import dashboardRouter from './routes/dashboard';
import healthRouter from './routes/health';

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// 1. Global Middlewares
app.use(cors({
  origin: CORS_ORIGIN === '*' ? true : [CORS_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// 2. Initialize Database on startup
try {
  initializeDatabase();
} catch (error) {
  console.error('[Server] Failed to initialize SQLite database:', error);
}

// 3. Mount Routes conforming to shared/api-contract.md
app.use('/api', healthRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/incidents', incidentsRouter);
app.use('/api/dashboard', dashboardRouter);

// 4. 404 Route Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    data: null,
    error: {
      code: 'NOT_FOUND',
      message: `The endpoint ${req.method} ${req.originalUrl} does not exist.`
    }
  });
});

// 5. Centralized Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[ServerError]', err);

  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
  const errorMessage = err.message || 'An unexpected error occurred processing your request.';

  res.status(statusCode).json({
    success: false,
    data: null,
    error: {
      code: errorCode,
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
});

// 6. Start listening only if executed directly as entrypoint
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` CampusPulse AI Backend Server Running on Port ${PORT}`);
    console.log(` Mode: ${process.env.NODE_ENV || 'development'} | AI Provider: ${process.env.AI_PROVIDER || 'mock'}`);
    console.log(` API Endpoint: http://localhost:${PORT}/api`);
    console.log(` Healthcheck:  http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
}
