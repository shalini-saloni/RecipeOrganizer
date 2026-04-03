import React, { createContext, useState } from 'react';

const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [homeRecipes, setHomeRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [uploadedRecipes, setUploadedRecipes] = useState([]);
  const [likedRecipes, setLikedRecipes] = useState([]);

  return (
    <RecipeContext.Provider value={{
      homeRecipes, setHomeRecipes,
      savedRecipes, setSavedRecipes,
      uploadedRecipes, setUploadedRecipes,
      likedRecipes, setLikedRecipes
    }}>
      {children}
    </RecipeContext.Provider>
  );
};

export default RecipeContext;