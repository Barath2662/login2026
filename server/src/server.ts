import app from './app';
import { ENV } from './config/env';

const PORT = ENV.PORT;

const server = app.listen(PORT, () => {
  console.log(`[LOGIN 2K26 Backend Server Running]`);
  console.log(`- Environment: ${ENV.NODE_ENV}`);
  console.log(`- Listening on: http://localhost:${PORT}`);
  console.log(`- Health Check: http://localhost:${PORT}/api/health`);
});

const handleShutdown = (signal: string) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP Server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
