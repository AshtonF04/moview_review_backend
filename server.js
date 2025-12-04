import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import pool from './db.js';
import userRoutes from './routes/userRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

// Create express app
const app = express();

// Middleware
// CORS configuration - allow frontend URL in production, all origins in development
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*', // Use environment variable or allow all in dev
  credentials: true
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    // Database connection Test
    pool.getConnection()
    .then(connection => {
        console.log('Database connected successfully');
        connection.release();
    })
    .catch(err => {
        console.error('Database connection error:', err.message);
    });
});

