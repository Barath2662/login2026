import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import routes from './routes';
import { notFoundHandler } from './middlewares/notFoundMiddleware';
import { globalErrorHandler } from './middlewares/errorMiddleware';
import { ENV } from './config/env';

const app: Application = express();

// Security & Optimization Middlewares
app.use(helmet());
app.use(compression());
app.use(morgan(ENV.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);

// Mount API Routes
app.use('/api', routes);

// 404 Handler & Global Error Middleware
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
