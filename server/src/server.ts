import app from './app';
import { connectDB } from './config/database';
import { config } from './config/env';

const startServer = async () => {
  await connectDB();
  app.listen(config.port, '0.0.0.0', () => {
    console.log(`Server running on port ${config.port}`);
  });
};

startServer();
