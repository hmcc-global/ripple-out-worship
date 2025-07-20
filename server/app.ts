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

app.use('/external-api', (req, _, next) => {
  console.log('Original URL:', req.originalUrl);
  console.log('Base URL:', req.baseUrl);
  console.log('Path:', req.path);
  console.log('Full URL being proxied to:', `${process.env.MAIN_URL}/api${req.path}`);
  next();
});

app.use(
  createProxyMiddleware('/external-api', {
    target: process.env.MAIN_URL,
    changeOrigin: true,
    secure: true,
    pathRewrite: {
      '^/external-api': '/api',
    },
    logLevel: 'debug',
    onProxyReq: (proxyReq) => {
      console.log('Proxying request to:', proxyReq.path);
      console.log('Host:', proxyReq.getHeader('host'));
    },
    onProxyRes: (proxyRes) => {
      console.log('Received response with status:', proxyRes.statusCode);
    },
  })
);
app.use(express.json());
app.use('/api', getRoutes());
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
