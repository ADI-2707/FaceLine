import express, { Express } from 'express';
import cors from 'cors';
import { keysRouter } from './routes/keys.js';
import { conversationsRouter } from './routes/conversations.js';
import { usersRouter } from './routes/users.js';

export const app: Express = express();

app.use(cors());
app.use(express.json());

app.use('/api/keys', keysRouter);
app.use('/api/conversations', conversationsRouter);
app.use('/api/users', usersRouter);

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});
