import React, { useState } from 'react';
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

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(recipe._id);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave(recipe._id);
  };

  return (
    <View style={[styles.recipeCard, { width }]}>
      {/* Main Image */}
      <Image source={{ uri: recipe.image }} style={styles.recipeImage} />

      <TouchableOpacity
        onPress={onPress}
        activeOpacity={1}
        style={styles.recipeCardOverlay}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.85)']}
          style={styles.recipeGradient}
        >
          <View style={styles.recipeInfo}>
            {/* User Info */}
            <View style={styles.recipeUserInfo}>
              <Image 
                source={{ uri: recipe.userId?.avatar || 'https://ui-avatars.com/api/?name=User&background=F97316&color=fff' }} 
                style={styles.recipeUserAvatarImage}
              />
              <Text style={styles.recipeUserName}>
                {recipe.userId?.name || 'Unknown'}
              </Text>
            </View>

            {/* Title */}
            <Text style={styles.recipeTitle} numberOfLines={2}>
              {recipe.title}
            </Text>
            
            {/* Description */}
            <Text style={styles.recipeDescription} numberOfLines={4}>
              {recipe.description}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Like and Save Buttons */}
      <View style={styles.recipeActionsBottomRight} pointerEvents="box-none">
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