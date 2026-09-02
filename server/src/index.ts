import { createServer } from 'http';
import { app } from './app.js';
import { env } from './config/env.js';
import { initSocketServer } from './socket/index.js';

const port = parseInt(env.PORT, 10);
const httpServer = createServer(app);

initSocketServer(httpServer);

httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
