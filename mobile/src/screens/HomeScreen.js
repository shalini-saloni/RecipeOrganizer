import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getRecipes, toggleLike, toggleSave } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import RecipeDetailModal from '../components/RecipeDetailModal';
import styles from '../styles/styles';

const { width } = Dimensions.get('window');

const HomeScreen = ({ user, token }) => {
  const [recipes, setRecipes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const data = await getRecipes(token);
      setRecipes(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      const data = await getRecipes(token, searchQuery);
      setRecipes(data);
      setCurrentIndex(0);
    } catch (error) {
      Alert.alert('Error', 'Search failed');
    }
  };

  const clearSearch = async () => {
    setSearchQuery('');
    await loadRecipes();
    setCurrentIndex(0);
  };

  // FIXED: Don't reload all recipes, just update state
  const handleLike = async (recipeId) => {
    try {
      await toggleLike(token, recipeId);
      // Update only the affected recipe
      setRecipes(prevRecipes => 
        prevRecipes.map(recipe => 
          recipe._id === recipeId 
            ? { ...recipe, likesCount: (recipe.likesCount || 0) + 1 }
            : recipe
        )
      );
    } catch (error) {
      console.error('Failed to like recipe', error);
    }
  };

  const handleSave = async (recipeId) => {
    try {
      await toggleSave(token, recipeId);
      // Update only the affected recipe
      setRecipes(prevRecipes => 
        prevRecipes.map(recipe => 
          recipe._id === recipeId 
            ? { ...recipe, savesCount: (recipe.savesCount || 0) + 1 }
            : recipe
        )
      );
    } catch (error) {
      console.error('Failed to save recipe', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecipes();
    setRefreshing(false);
  };

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading recipes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#F97316', '#EF4444']} style={styles.header}>
        <Text style={styles.headerTitle}>Recipes</Text>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes, cuisine, ingredients..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={clearSearch}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {recipes.length > 0 ? (
        <>
          <FlatList
            ref={flatListRef}
            data={recipes}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            keyExtractor={(item) => item._id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
              <RecipeCard
                recipe={item}
                onPress={() => setSelectedRecipe(item)}
                onLike={handleLike}
                onSave={handleSave}
              />
            )}
          />

        <View style={styles.pagination}>
          {recipes.slice(0, 5).map((_, index) => ( // Show max 5 dots
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive
              ]}
            />
          ))}
        </View>
        
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No recipes found</Text>
        </View>
      )}

      <RecipeDetailModal
        visible={!!selectedRecipe}
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onLike={handleLike}
        onSave={handleSave}
        token={token}
      />
    </View>
  );
};

export default HomeScreen;