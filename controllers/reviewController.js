import pool from '../db.js';

// Get all reviews with username
export const getAllReviews = async (req, res) => {
    try {
        const [reviews] = await pool.execute(
            `SELECT r.*, u.username 
             FROM reviews r 
             INNER JOIN users u ON r.user_id = u.id 
             ORDER BY r.created_at DESC`
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

    // Input validation
    if (!user_id || !movie_id || rating === undefined) {
        return res.status(400).json({ 
            error: 'user_id, movie_id, and rating are required' 
        });
    }

    // Validate rating range
    if (typeof rating !== 'number' || rating < 0 || rating > 10) {
        return res.status(400).json({ 
            error: 'Rating must be a number between 0 and 10' 
        });
    }

    // Validate comment length
    if (comment && comment.length > 200) {
        return res.status(400).json({ 
            error: 'Comment must be 200 characters or less' 
        });
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO reviews (user_id, movie_id, rating, comment) VALUES (?, ?, ?, ?)',
            [user_id, movie_id, rating, comment || null]
        );
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        console.error('Error creating review:', error);
        
        // Handle duplicate review error
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ 
                error: 'You have already reviewed this movie' 
            });
        }
        
        // Handle foreign key constraint (invalid user_id)
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ 
                error: 'Invalid user_id' 
            });
        }
        
        res.status(500).json({ error: 'Failed to create review' });
    }
};

// Get reviews by movie id with username
export const getReviewsByMovieId = async (req, res) => {
    const { id } = req.params;
    try {
        const [reviews] = await pool.execute(
            `SELECT r.*, u.username 
             FROM reviews r 
             INNER JOIN users u ON r.user_id = u.id 
             WHERE r.movie_id = ? 
             ORDER BY r.created_at DESC`,
            [id]
        );
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews by movie id:', error);
        res.status(500).json({ error: 'Failed to fetch reviews for the movie' });
    }
};

