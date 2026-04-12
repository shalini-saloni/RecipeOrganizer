const express = require('express');
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const Recipe = require('../models/Recipe');
const auth = require('../middleware/Auth');

const router = express.Router();

// Get reviews for a recipe
router.get('/:recipeId', async (req, res) => {
  try {
    const reviews = await Review.find({ recipeId: req.params.recipeId })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add or update a review
router.post('/:recipeId', auth, [
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment } = req.body;
    const recipeId = req.params.recipeId;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const review = await Review.findOneAndUpdate(
      { recipeId, userId: req.userId },
      { rating, comment, recipeId, userId: req.userId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await review.populate('userId', 'name avatar');

    const allReviews = await Review.find({ recipeId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    recipe.rating = Math.round(avgRating * 10) / 10;
    recipe.reviewsCount = allReviews.length;
    await recipe.save();

    res.json({
      review,
      recipeRating: recipe.rating,
      reviewsCount: recipe.reviewsCount
    });
  } catch (error) {
    console.error('Post review error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a review
router.delete('/:recipeId', auth, async (req, res) => {
  try {
    const recipeId = req.params.recipeId;
    const deleted = await Review.findOneAndDelete({ recipeId, userId: req.userId });
    
    if (!deleted) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const recipe = await Recipe.findById(recipeId);
    const allReviews = await Review.find({ recipeId });
    
    if (allReviews.length > 0) {
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      recipe.rating = Math.round(avgRating * 10) / 10;
    } else {
      recipe.rating = 0;
    }
    recipe.reviewsCount = allReviews.length;
    await recipe.save();

    res.json({
      message: 'Review deleted',
      recipeRating: recipe.rating,
      reviewsCount: recipe.reviewsCount
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
