// Review Routes
import express from 'express';
import { getAllReviews, createReview, getReviewsByMovieId, updateReview, deleteReview, getReviewsByUserId } from '../controllers/reviewController.js';

const router = express.Router();

router.get('/', getAllReviews);
router.post('/', createReview);
router.get('/user/:id', getReviewsByUserId);
router.get('/:id', getReviewsByMovieId);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router;

