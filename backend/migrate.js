require('dotenv').config();
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe');

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const recipes = await Recipe.find({});
    console.log(`Found ${recipes.length} recipes. Updating...`);

    const categories = ['Appetizers', 'Main Course', 'Dessert', 'Breakfast', 'Soup', 'Salad'];

    for (let recipe of recipes) {
      if (!recipe.category || recipe.category === 'All') {
        // Assign a random category for existing recipes
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        recipe.category = randomCategory;
      }
      
      if (!recipe.rating || recipe.rating === 4.5) {
        // Random rating between 3.5 and 5.0
        recipe.rating = (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1);
      }

      if (!recipe.reviewsCount || recipe.reviewsCount === 0) {
        // Random reviews count
        recipe.reviewsCount = Math.floor(Math.random() * 200) + 5;
      }

      await recipe.save();
    }

    console.log('Migration complete.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
