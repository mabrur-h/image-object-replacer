import express from 'express';
import { env } from './config/env';
import { imageRoutes } from './routes/image.route';
import { docsRoutes } from './routes/docs.route';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { httpLogger } from './middleware/http-logger';

const app = express();

app.use(httpLogger);
app.use(express.json());
app.use('/', docsRoutes);
app.use('/api', imageRoutes);

// Handle favicon requests
app.get('/favicon.ico', (_req, res) => res.status(204).end());

// Handle 404 errors
app.use(notFoundHandler);
// Global error handler
app.use(errorHandler);

export const server = app.listen(env.port, () => {
  if (env.nodeEnv !== 'test') {
    console.info(`Server is running on port ${env.port}`);
  }
});

export default app;
