const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const auth = require('../middleware/Auth');
const Recipe = require('../models/Recipe');

const router = express.Router();

// Initialize Gemini
const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Generate recipe from ingredients
router.post('/generate', auth, async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients) {
      return res.status(400).json({ error: 'Ingredients are required' });
    }

    const prompt = `
      User has following ingredients: ${ingredients}.
      Generate a professional recipe in JSON format with the following fields:
      - title (catchy name)
      - description (brief, appetizing)
      - cuisine (e.g., Italian, Indian, Mexican)
      - prepTime (e.g., 20 min)
      - servings (number, e.g. 2)
      - ingredients (array of strings)
      - instructions (string, step by step)
      - rating (default 4.8)
      - author (set as "AI Chef")

      Only return the JSON object, no other text.
    `;

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const text = response.text;

    // Clean potential markdown formatting from JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Gemini response was not JSON:', text);
      return res.status(500).json({ error: 'AI failed to generate a complete recipe format. Try again.' });
    }

    let recipeData;
    try {
      recipeData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError, 'Raw Text:', text);
      return res.status(500).json({ error: 'AI generated invalid data format. Try again.' });
    }

    // Generate image using a reliable food image
    const imageUrl = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center';

    const recipe = new Recipe({
      ...recipeData,
      image: imageUrl,
      userId: req.userId,
      category: recipeData.category || 'AI Generated'
    });

    await recipe.save();
    await recipe.populate('userId', 'name avatar');

    res.json({
      ...recipe.toObject(),
      likesCount: 0,
      savesCount: 0
    });
  } catch (error) {
    console.error('Gemini API Error details:', error?.message || error);
    res.status(500).json({ error: `AI Error: ${error?.message || 'Failed to generate recipe.'}` });
  }
});

// Cleanup AI-generated recipes for current user (optional)
router.delete('/cleanup', auth, async (req, res) => {
  try {
    const result = await Recipe.deleteMany({ userId: req.userId, category: 'AI Generated' });
    res.json({ deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Cleanup Error:', error);
    res.status(500).json({ error: 'Failed to cleanup AI-generated recipes.' });
  }
});

module.exports = router;
