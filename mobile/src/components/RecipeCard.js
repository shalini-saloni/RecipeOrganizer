import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import styles from '../styles/styles';

const { width } = Dimensions.get('window');

const RecipeCard = ({ recipe, onPress, onLike, onSave, currentUser, isVertical }) => {
  // Use exact 'liked' boolean from latest response, or check if current user is in the likes array
  const currentUserId = currentUser?.id || currentUser?._id;
  
  const isLiked = recipe.liked !== undefined 
    ? recipe.liked 
    : (recipe.likes && currentUserId && recipe.likes.includes(currentUserId));
    
  const isSaved = recipe.saved !== undefined 
    ? recipe.saved 
    : (recipe.saves && currentUserId && recipe.saves.includes(currentUserId));

  return (
    <TouchableOpacity
      style={[
        styles.premiumRecipeCard, 
        isVertical && { width: '100%', marginRight: 0 }
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.premiumImageContainer}>
        <Image
          source={{ uri: recipe.image }}
          style={styles.premiumRecipeImage}
          resizeMode="cover"
        />
        
        {/* Time Pill */}
        <View style={styles.timePill}>
          <Feather name="clock" size={12} color="#F97316" />
          <Text style={styles.timePillText}>{recipe.prepTime}</Text>
        </View>

        {/* Like Button */}
        <TouchableOpacity 
          style={styles.heartButtonOverlay}
          onPress={() => onLike(recipe._id)}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={isLiked ? "heart" : "heart-outline"} 
            size={18} 
            color={isLiked ? "#EF4444" : "#6B7280"} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.premiumInfoContainer}>
        <View style={styles.titleRatingRow}>
          <Text style={styles.premiumRecipeTitle} numberOfLines={1}>
            {recipe.title}
          </Text>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={10} color="#EA580C" />
            <Text style={styles.ratingText}>{recipe.rating || '4.8'}</Text>
          </View>
        </View>

        <Text style={styles.premiumRecipeDesc} numberOfLines={2}>
          {recipe.description}
        </Text>

        <View style={styles.premiumAuthorRow}>
          <Image
            source={{ uri: recipe.userId?.avatar || 'https://ui-avatars.com/api/?name=User&background=F97316&color=fff' }}
            style={styles.premiumAuthorAvatar}
          />
          <Text style={styles.premiumAuthorName}>
            {recipe.userId?.name?.split(' ')[0] || 'Chef'}
          </Text>
          
          <View style={{ flex: 1 }} />
          
          <TouchableOpacity onPress={() => onSave(recipe._id)}>
             <Ionicons 
                name={isSaved ? "bookmark" : "bookmark-outline"} 
                size={16} 
                color={isSaved ? "#F97316" : "#6B7280"} 
             />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RecipeCard;