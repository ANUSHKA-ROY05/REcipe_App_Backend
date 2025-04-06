const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    author: {
        name: String,
        id: String
    },
    recipeName: String,
    ingredients: [String], 
    instructions: String,
    cuisineType: String,
    preparationTime: Number, 
    cookingTime: Number,
    servings: Number,
    image: String, 
    tags: [String]
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
