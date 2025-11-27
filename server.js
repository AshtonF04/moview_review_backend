import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import pool from './db.js';
import userRoutes from './routes/userRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

// Create express app
const app = express();
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');

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

