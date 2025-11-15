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

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.modalContainer}>
        <ScrollView>
          <Image source={{ uri: recipe.image }} style={styles.modalImage} />

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>{recipe.title}</Text>
                <View style={styles.userInfo}>
                  <Text style={styles.userAvatar}>
                    {recipe.userId?.avatar || '👤'}
                  </Text>
                  <Text style={styles.userName}>
                    {recipe.userId?.name || 'Unknown Chef'}
                  </Text>
                </View>
              </View>

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

            <Text style={styles.description}>{recipe.description}</Text>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>⏱️</Text>
                <Text style={styles.infoText}>{recipe.prepTime}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>👥</Text>
                <Text style={styles.infoText}>{recipe.servings} servings</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>🏷️</Text>
                <Text style={styles.infoText}>{recipe.cuisine}</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <Text style={styles.statText}>❤️ {recipe.likesCount || 0} likes</Text>
              <Text style={styles.statText}>🔖 {recipe.savesCount || 0} saves</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              {recipe.ingredients?.map((ingredient, index) => (
                <Text key={index} style={styles.ingredientItem}>
                  • {ingredient}
                </Text>
              ))}
            </View>

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