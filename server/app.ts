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
  // app.use(express.static(path.join(__dirname, '../client')));
  app.use(express.static('client'));
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
