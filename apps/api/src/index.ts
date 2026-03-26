import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import client from 'prom-client';
import itemsRoutes from './routes/items';
import shopsRoutes from './routes/shops';
import listsRoutes from './routes/lists';
import dashboardRoutes from './routes/dashboard';
import { requestLogger } from './middlewares/logger';
import { errorHandler } from './middlewares/error.handler';

const app = express();
const port = process.env.PORT || 5001;

// ── Prometheus metrics ────────────────────────────────────────────────────────
const register = new client.Registry();
client.collectDefaultMetrics({ register, prefix: 'grocery_tracker_' });

const httpRequestDuration = new client.Histogram({
  name: 'grocery_tracker_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Instrument all routes
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.route?.path ?? req.path, status_code: res.statusCode });
  });
  next();
});

// API Routes
app.use('/api/items', itemsRoutes);
app.use('/api/shops', shopsRoutes);
app.use('/api/lists', listsRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
