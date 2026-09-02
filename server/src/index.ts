import { app } from './app.js';
import { env } from './config/env.js';

const port = parseInt(env.PORT, 10);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
