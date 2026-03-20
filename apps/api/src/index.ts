import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import itemsRoutes from './routes/items';
import shopsRoutes from './routes/shops';
import listsRoutes from './routes/lists';
import dashboardRoutes from './routes/dashboard';
import { requestLogger } from './middlewares/logger';
import { errorHandler } from './middlewares/error.handler';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(requestLogger);

// API Routes
app.use('/api/items', itemsRoutes);
app.use('/api/shops', shopsRoutes);
app.use('/api/lists', listsRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
