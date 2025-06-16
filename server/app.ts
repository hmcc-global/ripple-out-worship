import express from 'express';
import { connectToDB } from './src/mongoose';
import { getRoutes } from './src/routes';
import * as path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 1338; // development port is 1338
const isDevelopment = process.env.NODE_ENV === 'test';

dotenv.config();

// Use EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.json());
app.use('/api', getRoutes());
if (!isDevelopment) {
  // Serve the static files from the React app
  app.use(express.static(path.join(__dirname, '/client')));
  // Serve .js files from js static folder
  app.get('*/*.js', (req, res) => {
      const urlParts = req.url.split('/');
      res.sendFile(path.join(__dirname + '/client/static/js/' + urlParts[urlParts.length - 1]));
  });
  // Serve .cssfiles from css staic folder
  app.get('*/*.css', (req, res) => {
      const urlParts = req.url.split('/');
      res.sendFile(path.join(__dirname + '/client/static/css/' + urlParts[urlParts.length - 1]));
  });
  app.get('*/*.css.map', (req, res) => {
      const urlParts = req.url.split('/');
      res.sendFile(path.join(__dirname + '/client/static/css/' + urlParts[urlParts.length - 1]));
  });
  // Serve images files from media staic folder
  app.get('*/*.(jpg|svg|png|woff|woff2)', (req, res) => {
      const urlParts = req.url.split('/');
      res.sendFile(path.join(__dirname + '/client/static/media/' + urlParts[urlParts.length - 1]));
  });
  // Handles any requests that don't match the ones above
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
