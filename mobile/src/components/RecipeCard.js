import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../styles/styles';

const { width } = Dimensions.get('window');

const RecipeCard = ({ recipe, onPress, onLike, onSave }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation(); // Prevent card press
    setIsLiked(!isLiked);
    onLike(recipe._id);
  };

  const handleSave = (e) => {
    e.stopPropagation(); // Prevent card press
    setIsSaved(!isSaved);
    onSave(recipe._id);
  };

  return (
    <View style={[styles.recipeCard, { width }]}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.95}
        style={styles.recipeCardTouchable}
      >
        <Image source={{ uri: recipe.image }} style={styles.recipeImage} />

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.85)']}
          style={styles.recipeGradient}
        >
          <View style={styles.recipeInfo}>
            <View style={styles.recipeUserInfo}>
              <Image 
                source={{ uri: recipe.userId?.avatar || 'https://ui-avatars.com/api/?name=User&background=F97316&color=fff' }} 
                style={styles.recipeUserAvatarImage}
              />
              <Text style={styles.recipeUserName}>
                {recipe.userId?.name || 'Unknown'}
              </Text>
            </View>

            <Text style={styles.recipeTitle}>{recipe.title}</Text>
            
            <Text style={styles.recipeDescription} numberOfLines={2}>
              {recipe.description}
            </Text>

            {/* <View style={styles.recipeMetaRow}>
              <Text style={styles.recipeMeta}>⏱️ {recipe.prepTime}</Text>
              <Text style={styles.recipeMeta}>👥 {recipe.servings}</Text>
              <Text style={styles.recipeMeta}>🏷️ {recipe.cuisine}</Text>
            </View> */}

            {/* <View style={styles.recipeStats}>
              <Text style={styles.recipeStat}>❤️ {recipe.likesCount || 0}</Text>
              <Text style={styles.recipeStat}>🔖 {recipe.savesCount || 0}</Text>
            </View> */}
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Buttons OUTSIDE TouchableOpacity */}
      <View style={styles.recipeActionsBottomRight}>
        <TouchableOpacity
          style={[styles.actionButtonNew, isSaved && styles.actionButtonSaved]}
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIconNew}>
            {isSaved ? '🔖' : '📑'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButtonNew, isLiked && styles.actionButtonLiked]}
          onPress={handleLike}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIconNew}>
            {isLiked ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RecipeCard;