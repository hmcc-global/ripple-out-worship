import express from 'express';
import { connectToDB } from './src/mongoose';
import { getRoutes } from './src/routes';
import * as path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 1338; // development port is 1338
const isDevelopment = process.env.NODE_ENV === 'test';

// Use EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(
  cors({
    origin: [process.env.MAIN_URL as string],
    methods: ['GET', 'POST', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'],
    credentials: true,
  })
);
app.use(express.json());
app.use('/api', getRoutes());
app.use(
  '/external-api',
  createProxyMiddleware({
    target: process.env.MAIN_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/external-api': '/api',
    },
    logger: console,
    on: {
      proxyReq: (_, req) => {
        console.log(
          `[PROXY] Forwarding ${req.method} ${req.url} to ${
            process.env.MAIN_URL
          }/api${req.url?.replace('/external-api', '')}`
        );
      },
      proxyRes: (proxyRes, req) => {
        console.log(`[PROXY] Response status: ${proxyRes.statusCode} for ${req.url}`);
      },
      error: (err) => {
        console.error(`[PROXY ERROR] ${err.message}`);
        // Properly handle the error response
      },
    },
  })
);
if (!isDevelopment) {
  app.use(express.static(path.join(__dirname, '/client/')));
  app.use(express.static(path.join(__dirname, '/client/images')));
  app.use(express.static(path.join(__dirname, '/client/static')));
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname + '/client/index.html'));
  });
}

// Starts the server after connecting to the database
connectToDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}.`);
    });
  })
  .catch(() => {
    console.log('Server failed to start.');
  });
