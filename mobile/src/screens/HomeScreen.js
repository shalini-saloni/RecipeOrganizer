import React, { useState, useEffect } from 'react';
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
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAllRecipes, setShowAllRecipes] = useState(null); // null or section title string

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning,';
    if (hour < 18) return 'Good Afternoon,';
    return 'Good Evening,';
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const data = await getRecipes(token);
      setRecipes(data);
    } catch (error) {
      console.log("Recipe Fetch Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await getRecipes(token, searchQuery);
      setRecipes(data);
    } catch (error) {
      console.log('Search failed', error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = async () => {
    setSearchQuery('');
    await loadRecipes();
  };

  const handleLike = async (recipeId) => {
    try {
      const response = await toggleLike(token, recipeId);
      setRecipes(prevRecipes =>
        prevRecipes.map(recipe =>
          recipe._id === recipeId
            ? { ...recipe, likesCount: response.likesCount, liked: response.liked }
            : recipe
        )
      );
      
      if (selectedRecipe && selectedRecipe._id === recipeId) {
        setSelectedRecipe(prev => ({ ...prev, likesCount: response.likesCount, liked: response.liked }));
      }
    } catch (error) {
      console.error('Failed to like', error);
    }
  };

  const handleSave = async (recipeId) => {
    try {
      const response = await toggleSave(token, recipeId);
      setRecipes(prevRecipes =>
        prevRecipes.map(recipe =>
          recipe._id === recipeId
            ? { ...recipe, savesCount: response.savesCount, saved: response.saved }
            : recipe
        )
      );

      if (selectedRecipe && selectedRecipe._id === recipeId) {
        setSelectedRecipe(prev => ({ ...prev, savesCount: response.savesCount, saved: response.saved }));
      }
    } catch (error) {
      console.error('Failed to save', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecipes();
    setRefreshing(false);
  };

  // Popular recipes — sorted by likes, only 4+ rating
  const popularRecipes = [...recipes]
    .filter(r =>
      (activeCategory === 'All' ||
      (r.cuisine && r.cuisine.toLowerCase() === activeCategory.toLowerCase())) &&
      (r.rating >= 4 || r.reviewsCount === 0)
    )
    .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));

  // Recently added — sorted by date, show latest 5
  const newestRecipes = [...recipes]
    .filter(r => activeCategory === 'All' || (r.cuisine && r.cuisine.toLowerCase() === activeCategory.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const renderSectionHeader = (title, showSeeAll = true) => (
    <View style={styles.sectionHeaderLine}>
      <Text style={styles.sectionTitleBlack}>{title}</Text>
      {showSeeAll && (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => setShowAllRecipes(true)}
        >
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // If "See All" was tapped, show the full-screen reel view
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F97316" />}
        contentContainerStyle={styles.homeScrollContent}
      >
        <LinearGradient
          colors={['#FDBA74', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          {/* Compact Header */}
          <View style={styles.topHeader}>
            <View style={styles.greetingRow}>
              <Image 
                source={{ uri: user?.avatar || 'https://ui-avatars.com/api/?name=User&background=F97316&color=fff' }} 
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

          {/* Compact Search Bar */}
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
              <TouchableOpacity onPress={() => clearSearch()}>
                <Feather name="x" size={18} color="#F97316" />
              </TouchableOpacity>
            ) : (
              <Feather name="sliders" size={18} color="#9CA3AF" />
            )}
          </View>

          {/* Cuisines Filters */}
          <View style={{ marginBottom: 8 }}>
              <CategoryPills 
              activeCategory={activeCategory} 
              onSelectCategory={setActiveCategory} 
              />
          </View>
        </LinearGradient>

        {/* Popular Recipes Section */}
        {renderSectionHeader('Popular Recipes')}
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

        {/* Recently Added Section */}
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