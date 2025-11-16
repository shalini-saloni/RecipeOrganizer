const express = require('express');
const { body, validationResult } = require('express-validator');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const auth = require('../middleware/Auth');

const router = express.Router();

// Get all recipes
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { cuisine: { $regex: search, $options: 'i' } },
          { ingredients: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const recipes = await Recipe.find(query)
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });

    const recipesWithStats = recipes.map(recipe => ({
      ...recipe.toObject(),
      likesCount: recipe.likes.length,
      savesCount: recipe.saves.length
    }));

    res.json(recipesWithStats);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single recipe
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('userId', 'name avatar');
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json({
      ...recipe.toObject(),
      likesCount: recipe.likes.length,
      savesCount: recipe.saves.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create recipe
router.post('/', auth, [
  body('title').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('cuisine').trim().notEmpty(),
  body('ingredients').isArray({ min: 1 }),
  body('instructions').trim().notEmpty(),
  body('prepTime').trim().notEmpty(),
  body('servings').isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const recipe = new Recipe({
      ...req.body,
      userId: req.userId
    });

    await recipe.save();
    await recipe.populate('userId', 'name avatar');

    res.status(201).json({
      ...recipe.toObject(),
      likesCount: 0,
      savesCount: 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update recipe
router.put('/:id', auth, [
  body('title').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('cuisine').trim().notEmpty(),
  body('ingredients').isArray({ min: 1 }),
  body('instructions').trim().notEmpty(),
  body('prepTime').trim().notEmpty(),
  body('servings').isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Check if user owns the recipe
    if (recipe.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to edit this recipe' });
    }

    // Update recipe fields
    Object.assign(recipe, req.body);
    await recipe.save();
    await recipe.populate('userId', 'name avatar');

    res.json({
      ...recipe.toObject(),
      likesCount: recipe.likes.length,
      savesCount: recipe.saves.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete recipe
router.delete('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Check if user owns the recipe
    if (recipe.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this recipe' });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle like
router.post('/:id/like', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const likeIndex = recipe.likes.indexOf(req.userId);
    
    if (likeIndex > -1) {
      recipe.likes.splice(likeIndex, 1);
    } else {
      recipe.likes.push(req.userId);
    }

    await recipe.save();
    
    res.json({
      liked: likeIndex === -1,
      likesCount: recipe.likes.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle save
router.post('/:id/save', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const saveIndex = recipe.saves.indexOf(req.userId);
    
    if (saveIndex > -1) {
      recipe.saves.splice(saveIndex, 1);
    } else {
      recipe.saves.push(req.userId);
    }

    await recipe.save();
    
    res.json({
      saved: saveIndex === -1,
      savesCount: recipe.saves.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's recipes
router.get('/user/uploaded', auth, async (req, res) => {
  try {
    const recipes = await Recipe.find({ userId: req.userId })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });

    const recipesWithStats = recipes.map(recipe => ({
      ...recipe.toObject(),
      likesCount: recipe.likes.length,
      savesCount: recipe.saves.length
    }));

    res.json(recipesWithStats);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get saved recipes
router.get('/user/saved', auth, async (req, res) => {
  try {
    const recipes = await Recipe.find({ saves: req.userId })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });

    const recipesWithStats = recipes.map(recipe => ({
      ...recipe.toObject(),
      likesCount: recipe.likes.length,
      savesCount: recipe.saves.length
    }));

    res.json(recipesWithStats);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get liked recipes
router.get('/user/liked', auth, async (req, res) => {
  try {
    const recipes = await Recipe.find({ likes: req.userId })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });

    const recipesWithStats = recipes.map(recipe => ({
      ...recipe.toObject(),
      likesCount: recipe.likes.length,
      savesCount: recipe.saves.length
    }));

    res.json(recipesWithStats);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;