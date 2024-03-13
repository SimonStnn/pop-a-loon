import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import ApiRoutes from './routes/api';

const app = express();
app.use(express.json());

app.use('/api', ApiRoutes);

const main = async () => {
  const db = await mongoose.connect(process.env.DATABASE_URL!);
  console.log('Connected to MongoDB');
};

if (require.main === module) {
  dotenv.config();
  main();

  app.listen(3000, () => {
    console.log(`Server is running on http://localhost:${3000}`);
  });
}
