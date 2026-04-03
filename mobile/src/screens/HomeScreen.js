import React, { useState, useEffect, useRef } from 'react';
import { useContext } from 'react';
import RecipeContext from '../context/RecipeContext';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
  StatusBar,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getRecipes, toggleLike, toggleSave } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import RecipeDetailModal from '../components/RecipeDetailModal';
import CategoryPills from '../components/CategoryPills';
import AllRecipesScreen from './AllRecipesScreen';
import styles from '../styles/styles';

const { width } = Dimensions.get('window');

const HomeScreen = ({ user, token }) => {
  // allRecipes does NOT exist in context — use a ref to cache the unfiltered base list locally
  const { homeRecipes, setHomeRecipes } = useContext(RecipeContext);
  const allRecipesRef = useRef([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAllRecipes, setShowAllRecipes] = useState(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning,';
    if (hour < 18) return 'Good Afternoon,';
    return 'Good Evening,';
  };

  useEffect(() => {
    if (homeRecipes.length === 0) {
      loadRecipes();
    } else {
      // Seed ref if context already populated (e.g. coming back from AllRecipes)
      if (allRecipesRef.current.length === 0) {
        allRecipesRef.current = homeRecipes;
      }
      setLoading(false);
    }
  }, []);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const data = await getRecipes(token);
      allRecipesRef.current = data; // cache base list
      setHomeRecipes(data);
    } catch (error) {
      console.log('Recipe Fetch Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      setLoading(true);
      const data = await getRecipes(token, searchQuery);
      setHomeRecipes(data);
      setIsSearching(true);
    } catch (error) {
      console.log('Search failed', error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = async () => {
    setSearchQuery('');
    setIsSearching(false);
    if (allRecipesRef.current.length > 0) {
      // Restore from local cache — no API call needed
      setHomeRecipes(allRecipesRef.current);
    } else {
      // Edge case: cache empty, re-fetch
      try {
        setLoading(true);
        const data = await getRecipes(token);
        allRecipesRef.current = data;
        setHomeRecipes(data);
      } catch (error) {
        console.log('Clear search fetch failed', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLike = async (recipeId) => {
    try {
      const response = await toggleLike(token, recipeId);
      setHomeRecipes(prevRecipes =>
        prevRecipes.map(recipe =>
          recipe._id === recipeId
            ? { ...recipe, likesCount: response.likesCount, liked: response.liked }
            : recipe
        )
      );
      // Keep ref in sync so cancel-search restores correct state
      allRecipesRef.current = allRecipesRef.current.map(r =>
        r._id === recipeId
          ? { ...r, likesCount: response.likesCount, liked: response.liked }
          : r
      );
      if (selectedRecipe?._id === recipeId) {
        setSelectedRecipe(prev => ({ ...prev, likesCount: response.likesCount, liked: response.liked }));
      }
    } catch (error) {
      console.error('Failed to like', error);
    }
  };

  const handleSave = async (recipeId) => {
    try {
      const response = await toggleSave(token, recipeId);
      setHomeRecipes(prevRecipes =>
        prevRecipes.map(recipe =>
          recipe._id === recipeId
            ? { ...recipe, savesCount: response.savesCount, saved: response.saved }
            : recipe
        )
      );
      // Keep ref in sync
      allRecipesRef.current = allRecipesRef.current.map(r =>
        r._id === recipeId
          ? { ...r, savesCount: response.savesCount, saved: response.saved }
          : r
      );
      if (selectedRecipe?._id === recipeId) {
        setSelectedRecipe(prev => ({ ...prev, savesCount: response.savesCount, saved: response.saved }));
      }
    } catch (error) {
      console.error('Failed to save', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await getRecipes(token);
      allRecipesRef.current = data;
      setHomeRecipes(data);
    } catch (error) {
      console.log('Refresh error:', error);
    }
    setRefreshing(false);
  };

  const popularRecipes = [...homeRecipes]
    .filter(r =>
      (activeCategory === 'All' ||
        (r.cuisine && r.cuisine.toLowerCase() === activeCategory.toLowerCase())) &&
      (isSearching || r.rating >= 4 || r.reviewsCount === 0)
    )
    .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));

  const newestRecipes = [...homeRecipes]
    .filter(r =>
      activeCategory === 'All' ||
      (r.cuisine && r.cuisine.toLowerCase() === activeCategory.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const renderSectionHeader = (title, showSeeAll = true) => (
    <View style={styles.sectionHeaderLine}>
      <Text style={styles.sectionTitleBlack}>{title}</Text>
      {showSeeAll && (
        <TouchableOpacity activeOpacity={0.6} onPress={() => setShowAllRecipes(true)}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (showAllRecipes) {
    return (
      <AllRecipesScreen
        user={user}
        token={token}
        onBack={() => setShowAllRecipes(null)}
      />
    );
  }

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F97316" />
        <Text style={styles.loadingText}>Fetching delicious recipes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.homeContainer}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F97316" />
        }
        contentContainerStyle={styles.homeScrollContent}
      >
        <LinearGradient
          colors={['#FDBA74', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          {/* Header */}
          <View style={styles.topHeader}>
            <View style={styles.greetingRow}>
              <Image
                source={{
                  uri: user?.avatar ||
                    'https://ui-avatars.com/api/?name=User&background=F97316&color=fff',
                }}
                style={styles.headerAvatar}
              />
              <View>
                <Text style={styles.greetingSubText}>{getGreeting()}</Text>
                <Text style={styles.greetingName}>{user?.name?.split(' ')[0] || 'Chef'}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.menuButton}>
              <Ionicons name="notifications-outline" size={22} color="#1F2937" />
            </TouchableOpacity>
          </View>

          <View style={styles.heroTextContainer}>
            <Text style={styles.heroText}>What would you like</Text>
            <Text style={{ fontSize: 28, fontWeight: '300', color: '#1F2937' }}>to cook today?</Text>
          </View>

          {/* Search Bar */}
          <View style={styles.modernSearchContainer}>
            <Feather name="search" size={18} color="#9CA3AF" />
            <TextInput
              style={styles.modernSearchInput}
              placeholder="Search recipes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              placeholderTextColor="#9CA3AF"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={clearSearch}>
                <Feather name="x" size={18} color="#F97316" />
              </TouchableOpacity>
            ) : (
              <Feather name="sliders" size={18} color="#9CA3AF" />
            )}
          </View>

          {/* Category Pills */}
          <View style={{ marginBottom: 8 }}>
            <CategoryPills
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />
          </View>
        </LinearGradient>

        {/* Popular / Search Results */}
        {renderSectionHeader(isSearching ? 'Search Results' : 'Popular Recipes')}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={popularRecipes}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <RecipeCard
              recipe={item}
              currentUser={user}
              onPress={() => setSelectedRecipe(item)}
              onLike={handleLike}
              onSave={handleSave}
            />
          )}
          ListEmptyComponent={
            <View style={{ width: width - 40, alignItems: 'center', padding: 20 }}>
              <Text style={styles.emptyTextInline}>No recipes found here yet.</Text>
            </View>
          }
        />

        {/* Recently Added — hidden during search */}
        {!isSearching && (
          <View style={{ marginTop: 12 }}>
            {renderSectionHeader('Recently Added')}
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={newestRecipes}
              keyExtractor={(item) => item._id + 'new'}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 60 }}
              renderItem={({ item }) => (
                <RecipeCard
                  recipe={item}
                  currentUser={user}
                  onPress={() => setSelectedRecipe(item)}
                  onLike={handleLike}
                  onSave={handleSave}
                />
              )}
              ListEmptyComponent={
                <View style={{ width: width - 40, alignItems: 'center', padding: 20 }}>
                  <Text style={styles.emptyTextInline}>No recipes found here yet.</Text>
                </View>
              }
            />
          </View>
        )}
      </ScrollView>

      <RecipeDetailModal
        visible={!!selectedRecipe}
        recipe={selectedRecipe}
        currentUser={user}
        onClose={() => setSelectedRecipe(null)}
        onLike={handleLike}
        onSave={handleSave}
        token={token}
      />
    </View>
  );
};

export default HomeScreen;