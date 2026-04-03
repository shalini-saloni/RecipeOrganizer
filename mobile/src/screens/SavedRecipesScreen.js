import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import RecipeContext from '../context/RecipeContext';
import { View, Text, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getSavedRecipes, toggleLike, toggleSave } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import RecipeDetailModal from '../components/RecipeDetailModal';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../styles/styles';

const { width } = Dimensions.get('window');

const SavedRecipesScreen = ({ user, token }) => {
  const { savedRecipes, setSavedRecipes } = useContext(RecipeContext);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    if (savedRecipes.length === 0) {
      loadSaved();
    } else {
      setLoading(false);
    }
  }, []);

  const loadSaved = async () => {
    try {
      setLoading(true);
      const data = await getSavedRecipes(token);
      const filtered = data.filter(recipe => (recipe.rating ?? 0) >= 4);
      setSavedRecipes(filtered);
    } catch (e) {
      console.log('Failed to fetch saved recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (recipeId) => {
    try {
      const response = await toggleLike(token, recipeId);
      setSavedRecipes(prevRecipes =>
        prevRecipes.map(recipe =>
          recipe._id === recipeId
            ? { ...recipe, likesCount: response.likesCount, liked: response.liked }
            : recipe
        )
      );

      if (selectedRecipe && selectedRecipe._id === recipeId) {
        setSelectedRecipe(prev => ({ ...prev, likesCount: response.likesCount, liked: response.liked }));
      }
    } catch (e) { console.log(e); }
  };

  const handleSave = async (recipeId) => {
    try {
      const response = await toggleSave(token, recipeId);
      // For saved screen, if we unsave, we might want to remove it or just update the icon
      // Setting response status directly
      setSavedRecipes(prevRecipes =>
        prevRecipes.map(recipe =>
          recipe._id === recipeId
            ? { ...recipe, savesCount: response.savesCount, saved: response.saved }
            : recipe
        )
      );

      if (selectedRecipe && selectedRecipe._id === recipeId) {
        setSelectedRecipe(prev => ({ ...prev, savesCount: response.savesCount, saved: response.saved }));
      }
      
      // If it's unsaved, we could optionally filter it out, but let's keep it until next refresh for consistency
    } catch (e) { console.log(e); }
  };

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={[styles.safeArea, { backgroundColor: '#FFFFFF' }]}>
      <LinearGradient
        colors={['#FDBA74', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={[styles.topHeader, { paddingBottom: 20 }]}>
          <Text style={styles.sectionTitleBlack}>My Collection</Text>
        </View>
      </LinearGradient>
      
      {loading ? (
        <View style={styles.loadingContainer}>
           <ActivityIndicator size="small" color="#F97316" />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={savedRecipes}
            keyExtractor={item => item._id}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 150 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <RecipeCard 
                recipe={item} 
                currentUser={user}
                isVertical={true}
                onPress={() => setSelectedRecipe(item)}
                onLike={handleLike}
                onSave={handleSave}
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTextInline}>You haven't saved any recipes yet.</Text>
              </View>
            }
          />
        </View>
      )}

      <RecipeDetailModal
        visible={!!selectedRecipe}
        recipe={selectedRecipe}
        currentUser={user}
        onClose={() => setSelectedRecipe(null)}
        onLike={handleLike}
        onSave={handleSave}
        token={token}
      />
    </SafeAreaView>
  );
};

export default SavedRecipesScreen;