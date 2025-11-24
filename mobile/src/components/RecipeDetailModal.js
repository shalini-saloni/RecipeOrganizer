import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { toggleLike, toggleSave } from '../services/api';
import styles from '../styles/styles';

const RecipeDetailModal = ({ visible, recipe, onClose, onLike, onSave, token }) => {
  if (!recipe) return null;

  const handleLike = async () => {
    await onLike(recipe._id);
  };

  const handleSave = async () => {
    await onSave(recipe._id);
  };

  const formatServings = (servings, servingsMax) => {
    if (servingsMax && servingsMax !== servings) {
      return `${servings}-${servingsMax} servings`;
    }
    return `${servings} servings`;
  };

  const getImageUri = (imageUrl) => {
    if (!imageUrl) {
      return 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800';
    }
    
    if (imageUrl.startsWith('data:image') || imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    return 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800';
  };

  const getUserAvatar = () => {
    if (recipe.userId?.avatar) {
      if (recipe.userId.avatar.startsWith('http') || recipe.userId.avatar.startsWith('data:image')) {
        return recipe.userId.avatar;
      }
    }
    const userName = recipe.userId?.name || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=F97316&color=fff&size=200`;
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.modalContainer}>
        <ScrollView>
          {/* Recipe Image */}
          <Image 
            source={{ uri: getImageUri(recipe.image) }} 
            style={styles.modalImage}
            resizeMode="cover"
          />

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.modalContent}>
            {/* Header with Title and Actions */}
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>{recipe.title}</Text>
                
                {/* User Info*/}
                <View style={styles.modalUserInfo}>
                  <Image 
                    source={{ uri: getUserAvatar() }}
                    style={styles.modalUserAvatar}
                  />
                  <View style={styles.modalUserTextContainer}>
                    <Text style={styles.modalUserName}>
                      {recipe.userId?.name || 'Unknown Chef'}
                    </Text>
                    {recipe.userId?.bio && (
                      <Text style={styles.modalUserBio} numberOfLines={1}>
                        {recipe.userId.bio}
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleSave}
                >
                  <Text style={styles.iconButtonText}>🔖</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleLike}
                >
                  <Text style={styles.iconButtonText}>❤️</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Description */}
            <Text style={styles.description}>{recipe.description}</Text>

            {/* Recipe Info Row */}
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>⏱️</Text>
                <Text style={styles.infoText}>{recipe.prepTime}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>👥</Text>
                <Text style={styles.infoText}>
                  {formatServings(recipe.servings, recipe.servingsMax)}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>🏷️</Text>
                <Text style={styles.infoText}>{recipe.cuisine}</Text>
              </View>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <Text style={styles.statText}>❤️ {recipe.likesCount || 0} likes</Text>
              <Text style={styles.statText}>🔖 {recipe.savesCount || 0} saves</Text>
            </View>

            {/* Ingredients Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              {recipe.ingredients?.map((ingredient, index) => (
                <Text key={index} style={styles.ingredientItem}>
                  • {ingredient}
                </Text>
              ))}
            </View>

            {/* Instructions Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Instructions</Text>
              <Text style={styles.instructions}>{recipe.instructions}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default RecipeDetailModal;