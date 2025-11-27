import pool from '../db.js';

// Get all reviews
export const getAllReviews = async (req, res) => {
    try {
        const [reviews] = await pool.execute(
            'SELECT * FROM reviews ORDER BY created_at DESC'
        );
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
};

// Create a new review
export const createReview = async (req, res) => {
    const { user_id, movie_id, rating, comment } = req.body;
    try {
        const [result] = await pool.execute(
            'INSERT INTO reviews (user_id, movie_id, rating, comment) VALUES (?, ?, ?, ?)',
            [user_id, movie_id, rating, comment]
        );
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ error: 'Failed to create review' });
    }
};

// Get reviews by movie id
export const getReviewsByMovieId = async (req, res) => {
    const { id } = req.params;
    try {
        const [reviews] = await pool.execute(
            'SELECT * FROM reviews WHERE movie_id = ? ORDER BY created_at DESC',
            [id]
        );
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews by movie id:', error);
        res.status(500).json({ error: 'Failed to fetch reviews for the movie' });
    }
};

