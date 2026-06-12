import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Cake Shop Backend API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// Register API Routes
app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`[Server] Running on http://localhost:${port}`);
});
