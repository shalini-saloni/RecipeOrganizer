import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useContext } from 'react';
import RecipeContext from '../context/RecipeContext';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native';
import { useSafeAreaInsets as useInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { toggleLike, toggleSave } from '../services/api';
import RecipeDetailModal from '../components/RecipeDetailModal';
import styles from '../styles/styles';

const { width, height } = Dimensions.get('window');

// Tab bar height constant — adjust if your tab bar height differs
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 83 : 60;

const AllRecipesScreen = ({ user, token, onBack }) => {
  const { homeRecipes, setHomeRecipes } = useContext(RecipeContext);
  const insets = useInsets();
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardHeight, setCardHeight] = useState(height - TAB_BAR_HEIGHT);

  useEffect(() => {
    if (homeRecipes.length > 0) {
      setLoading(false);
    }
  }, [homeRecipes]);

  const recipes = [...homeRecipes].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Update homeRecipes in context after like/save so HomeScreen stays in sync
  const handleLike = async (recipeId) => {
    try {
      const response = await toggleLike(token, recipeId);
      setHomeRecipes(prev =>
        prev.map(r =>
          r._id === recipeId
            ? { ...r, likesCount: response.likesCount, liked: response.liked }
            : r
        )
      );
      if (selectedRecipe && selectedRecipe._id === recipeId) {
        setSelectedRecipe(prev => ({
          ...prev,
          likesCount: response.likesCount,
          liked: response.liked,
        }));
      }
    } catch (error) {
      console.error('Like failed', error);
    }
  };

  const handleSave = async (recipeId) => {
    try {
      const response = await toggleSave(token, recipeId);
      setHomeRecipes(prev =>
        prev.map(r =>
          r._id === recipeId
            ? { ...r, savesCount: response.savesCount, saved: response.saved }
            : r
        )
      );
      if (selectedRecipe && selectedRecipe._id === recipeId) {
        setSelectedRecipe(prev => ({
          ...prev,
          savesCount: response.savesCount,
          saved: response.saved,
        }));
      }
    } catch (error) {
      console.error('Save failed', error);
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 60 }).current;

  const currentUserId = user?.id || user?._id;

  // Measure container height dynamically to perfectly snap cards
  const onContainerLayout = useCallback((e) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0) setCardHeight(h);
  }, []);

  const renderReelCard = ({ item }) => {
    const isLiked = item.liked !== undefined
      ? item.liked
      : (item.likes && currentUserId && item.likes.includes(currentUserId));

    const isSaved = item.saved !== undefined
      ? item.saved
      : (item.saves && currentUserId && item.saves.includes(currentUserId));

    return (
      <View style={[reelStyles.cardContainer, { height: cardHeight }]}>
        {/* Full-screen background image */}
        <Image
          source={{ uri: item.image }}
          style={reelStyles.backgroundImage}
          resizeMode="cover"
        />

        {/* Gradient overlay — stronger at bottom to clear tab bar */}
        <LinearGradient
          colors={[
            'rgba(0,0,0,0.15)',
            'transparent',
            'rgba(0,0,0,0.3)',
            'rgba(0,0,0,0.92)',
          ]}
          locations={[0, 0.25, 0.55, 1]}
          style={reelStyles.gradientOverlay}
        />

        {/* Right side action buttons */}
        <View style={[reelStyles.actionColumn, { bottom: TAB_BAR_HEIGHT + 100 }]}>
          <TouchableOpacity
            style={reelStyles.actionBtn}
            onPress={() => handleLike(item._id)}
            activeOpacity={0.7}
          >
            <View style={reelStyles.actionCircle}>
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={26}
                color={isLiked ? '#EF4444' : '#FFFFFF'}
              />
            </View>
            <Text style={reelStyles.actionCount}>{item.likesCount || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={reelStyles.actionBtn}
            onPress={() => handleSave(item._id)}
            activeOpacity={0.7}
          >
            <View style={reelStyles.actionCircle}>
              <Ionicons
                name={isSaved ? 'bookmark' : 'bookmark-outline'}
                size={24}
                color={isSaved ? '#F97316' : '#FFFFFF'}
              />
            </View>
            <Text style={reelStyles.actionCount}>{item.savesCount || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={reelStyles.actionBtn}
            onPress={() => setSelectedRecipe(item)}
            activeOpacity={0.7}
          >
            <View style={reelStyles.actionCircle}>
              <Ionicons name="expand-outline" size={22} color="#FFFFFF" />
            </View>
            <Text style={reelStyles.actionCount}>View</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom content — sits above tab bar */}
        <View style={[reelStyles.bottomContent, { bottom: TAB_BAR_HEIGHT + 16 }]}>
          {/* Author row */}
          <View style={reelStyles.authorRow}>
            <Image
              source={{
                uri: item.userId?.avatar ||
                  'https://ui-avatars.com/api/?name=User&background=F97316&color=fff',
              }}
              style={reelStyles.authorAvatar}
            />
            <Text style={reelStyles.authorName} numberOfLines={1}>
              {item.userId?.name || 'Chef'}
            </Text>
            <View style={reelStyles.cuisinePill}>
              <Text style={reelStyles.cuisineText}>{item.cuisine || 'All'}</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={reelStyles.title} numberOfLines={2}>{item.title}</Text>

          {/* Description */}
          <Text style={reelStyles.desc} numberOfLines={2}>{item.description}</Text>

          {/* Stats row */}
          <View style={reelStyles.statsRow}>
            <View style={reelStyles.statItem}>
              <Feather name="clock" size={14} color="#F97316" />
              <Text style={reelStyles.statText}>{item.prepTime}</Text>
            </View>
            <View style={reelStyles.statItem}>
              <Ionicons name="star" size={14} color="#FBBF24" />
              <Text style={reelStyles.statText}>
                {item.reviewsCount > 0 ? item.rating?.toFixed(1) : 'New'}
              </Text>
            </View>
            <View style={reelStyles.statItem}>
              <Ionicons name="restaurant-outline" size={14} color="#F97316" />
              <Text style={reelStyles.statText}>
                {item.servings}{item.servingsMax ? `-${item.servingsMax}` : ''} Serv.
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: '#000' }]}>
        <ActivityIndicator size="large" color="#F97316" />
        <Text style={[styles.loadingText, { color: '#FFF' }]}>Loading recipes...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar barStyle="light-content" />

      {/* Header overlay — sits above everything */}
      <View style={[reelStyles.headerOverlay, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          onPress={onBack}
          style={reelStyles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={reelStyles.headerTitle}>All Recipes</Text>
        <View style={reelStyles.countBadge}>
          <Text style={reelStyles.headerCount}>{recipes.length}</Text>
        </View>
      </View>

      {/* FlatList container — stops at tab bar top */}
      <View
        style={{ flex: 1, marginBottom: TAB_BAR_HEIGHT }}
        onLayout={onContainerLayout}
      >
        <FlatList
          data={homeRecipes}
          keyExtractor={(item) => item._id}
          renderItem={renderReelCard}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          snapToAlignment="start"
          decelerationRate="fast"
          getItemLayout={(data, index) => ({
            length: cardHeight,
            offset: cardHeight * index,
            index,
          })}
          ListEmptyComponent={
            <View style={{ height: cardHeight, justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="restaurant-outline" size={48} color="rgba(255,255,255,0.3)" />
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, marginTop: 12 }}>
                No recipes yet.
              </Text>
            </View>
          }
        />
      </View>

      {/* Scroll progress dots */}
      {recipes.length > 1 && (
        <View style={[reelStyles.scrollIndicator, { bottom: TAB_BAR_HEIGHT + 80 }]}>
          {recipes.slice(0, Math.min(recipes.length, 10)).map((_, i) => (
            <View
              key={i}
              style={[reelStyles.dot, activeIndex === i && reelStyles.dotActive]}
            />
          ))}
          {recipes.length > 10 && (
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, marginTop: 2 }}>
              +{recipes.length - 10}
            </Text>
          )}
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
    </View>
  );
};

const reelStyles = StyleSheet.create({
  cardContainer: {
    width: width,
    position: 'relative',
    backgroundColor: '#000',
  },
  backgroundImage: {
    position: 'absolute',
    top: 100,
    left: 0,
    width: width,        
    height: 550,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingHorizontal: 20,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginLeft: 14,
    flex: 1,
    letterSpacing: -0.3,
  },
  countBadge: {
    backgroundColor: 'rgba(249, 115, 22, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  headerCount: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  // Dynamic bottom set inline using TAB_BAR_HEIGHT
  actionColumn: {
    position: 'absolute',
    right: 14,
    alignItems: 'center',
    zIndex: 10,
    gap: 18,
  },
  actionBtn: {
    alignItems: 'center',
    gap: 4,
  },
  actionCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  actionCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  // Dynamic bottom set inline using TAB_BAR_HEIGHT
  bottomContent: {
    position: 'absolute',
    left: 0,
    right: 72,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#F97316',
    marginRight: 10,
  },
  authorName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  cuisinePill: {
    backgroundColor: 'rgba(249, 115, 22, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  cuisineText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  desc: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  // Dynamic bottom set inline using TAB_BAR_HEIGHT
  scrollIndicator: {
    position: 'absolute',
    right: 5,
    alignItems: 'center',
    gap: 3,
    zIndex: 15,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    backgroundColor: '#F97316',
    width: 5,
    height: 18,
    borderRadius: 3,
  },
});

export default AllRecipesScreen;