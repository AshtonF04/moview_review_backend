// Review Routes
import express from 'express';
import { getAllReviews, createReview, getReviewsByMovieId } from '../controllers/reviewController.js';

const router = express.Router();

router.get('/', getAllReviews);
router.post('/', createReview);
router.get('/:id', getReviewsByMovieId);

export default router;

