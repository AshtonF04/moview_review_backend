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

    // Validate rating range (must be integer between 1-10)
    if (typeof rating !== 'number' || rating < 1 || rating > 10 || !Number.isInteger(rating)) {
        return res.status(400).json({ 
            error: 'Rating must be an integer between 1 and 10' 
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

// Update a review
export const updateReview = async (req, res) => {
    const { id } = req.params;
    const { user_id, rating, comment } = req.body;

    // Input validation
    if (!user_id || rating === undefined) {
        return res.status(400).json({ 
            error: 'user_id and rating are required' 
        });
    }

    // Validate rating range (must be integer between 1-10)
    if (typeof rating !== 'number' || rating < 1 || rating > 10 || !Number.isInteger(rating)) {
        return res.status(400).json({ 
            error: 'Rating must be an integer between 1 and 10' 
        });
    }

    // Validate comment length
    if (comment && comment.length > 200) {
        return res.status(400).json({ 
            error: 'Comment must be 200 characters or less' 
        });
    }

    try {
        // Check if review exists and belongs to user
        const [existingReview] = await pool.execute(
            'SELECT * FROM reviews WHERE id = ? AND user_id = ?',
            [id, user_id]
        );

        if (existingReview.length === 0) {
            return res.status(404).json({ 
                error: 'Review not found or you do not have permission to update it' 
            });
        }

        // Update the review
        await pool.execute(
            'UPDATE reviews SET rating = ?, comment = ? WHERE id = ? AND user_id = ?',
            [rating, comment || null, id, user_id]
        );

        res.json({ message: 'Review updated successfully' });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ error: 'Failed to update review' });
    }
};

// Delete a review
export const deleteReview = async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ 
            error: 'user_id is required' 
        });
    }

    try {
        // Check if review exists and belongs to user
        const [existingReview] = await pool.execute(
            'SELECT * FROM reviews WHERE id = ? AND user_id = ?',
            [id, user_id]
        );

        if (existingReview.length === 0) {
            return res.status(404).json({ 
                error: 'Review not found or you do not have permission to delete it' 
            });
        }

        // Delete the review
        await pool.execute(
            'DELETE FROM reviews WHERE id = ? AND user_id = ?',
            [id, user_id]
        );

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Failed to delete review' });
    }
};

// Get reviews by user id
export const getReviewsByUserId = async (req, res) => {
    const { id } = req.params;
    try {
        const [reviews] = await pool.execute(
            `SELECT r.*, u.username 
             FROM reviews r 
             INNER JOIN users u ON r.user_id = u.id 
             WHERE r.user_id = ? 
             ORDER BY r.created_at DESC`,
            [id]
        );
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews by user id:', error);
        res.status(500).json({ error: 'Failed to fetch reviews for the user' });
    }
};

