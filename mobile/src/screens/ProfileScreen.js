import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  RefreshControl,
  Alert,
  TextInput,
  Modal,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { 
  getUserRecipes, 
  getSavedRecipes, 
  getLikedRecipes, 
  updateProfile, 
  uploadImage,
  deleteRecipe,
  updateRecipe
} from '../services/api';
import RecipeDetailModal from '../components/RecipeDetailModal';
import styles from '../styles/styles';

const ProfileScreen = ({ user, token, onLogout, onUserUpdate }) => {
  const [activeTab, setActiveTab] = useState('uploaded');
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const [editRecipeModalVisible, setEditRecipeModalVisible] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [editRecipeTitle, setEditRecipeTitle] = useState('');
  const [editRecipeDescription, setEditRecipeDescription] = useState('');
  const [editRecipeCuisine, setEditRecipeCuisine] = useState('');
  const [editRecipeIngredients, setEditRecipeIngredients] = useState('');
  const [editRecipePrepTime, setEditRecipePrepTime] = useState('');
  const [editRecipeServings, setEditRecipeServings] = useState('');
  const [editRecipeInstructions, setEditRecipeInstructions] = useState('');
  const [editRecipeImage, setEditRecipeImage] = useState(null);
  const [editRecipeServingsMax, setEditRecipeServingsMax] = useState('');

  useEffect(() => {
    loadRecipes();
  }, [activeTab]);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      let data;
      
      switch (activeTab) {
        case 'uploaded':
          data = await getUserRecipes(token);
          break;
        case 'saved':
          data = await getSavedRecipes(token);
          break;
        case 'liked':
          data = await getLikedRecipes(token);
          break;
        default:
          data = [];
      }
      
      setRecipes(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecipes();
    setRefreshing(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLogoutPress = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: onLogout, style: 'destructive' }
      ]
    );
  };

  const pickProfileImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled) {
        const uploadResult = await uploadImage(token, `data:image/jpeg;base64,${result.assets[0].base64}`);
        setEditAvatar(uploadResult.url);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setUpdatingProfile(true);
      const result = await updateProfile(token, {
        name: editName,
        bio: editBio,
        avatar: editAvatar
      });
      
      if (onUserUpdate) {
        onUserUpdate(result.user);
      }
      
      Alert.alert('Success', 'Profile updated successfully!');
      setEditModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const openEditModal = () => {
    setEditName(user?.name || '');
    setEditBio(user?.bio || '');
    setEditAvatar(user?.avatar || '');
    setEditModalVisible(true);
  };

  const handleDeleteRecipe = (recipe) => {
    Alert.alert(
      'Delete Recipe',
      `Are you sure you want to delete "${recipe.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRecipe(token, recipe._id);
              Alert.alert('Success', 'Recipe deleted successfully!');
              loadRecipes();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete recipe');
            }
          }
        }
      ]
    );
  };

  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setEditRecipeTitle(recipe.title);
    setEditRecipeDescription(recipe.description);
    setEditRecipeCuisine(recipe.cuisine);
    setEditRecipeIngredients(recipe.ingredients.join(', '));
    setEditRecipePrepTime(recipe.prepTime);
    setEditRecipeServings(recipe.servings.toString());
    setEditRecipeInstructions(recipe.instructions);
    setEditRecipeImage(null);
    setEditRecipeModalVisible(true);
    setEditRecipeServingsMax(recipe.servingsMax ? recipe.servingsMax.toString() : '');
  };

  const pickRecipeImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled) {
        setEditRecipeImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleUpdateRecipe = async () => {
    if (!editRecipeTitle || !editRecipeDescription || !editRecipeCuisine || 
        !editRecipeIngredients || !editRecipePrepTime || !editRecipeServings || 
        !editRecipeInstructions) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      let imageUrl = editingRecipe.image;
      
      if (editRecipeImage && editRecipeImage.base64) {
        const uploadResult = await uploadImage(token, `data:image/jpeg;base64,${editRecipeImage.base64}`);
        imageUrl = uploadResult.url;
      }

      const updatedRecipe = {
        title: editRecipeTitle,
        description: editRecipeDescription,
        cuisine: editRecipeCuisine,
        ingredients: editRecipeIngredients.split(',').map(i => i.trim()).filter(i => i),
        prepTime: editRecipePrepTime,
        servings: parseInt(editRecipeServings),
        servingsMax: editRecipeServingsMax ? parseInt(editRecipeServingsMax) : null,
        instructions: editRecipeInstructions,
        image: imageUrl
      };

      await updateRecipe(token, editingRecipe._id, updatedRecipe);
      Alert.alert('Success', 'Recipe updated successfully!');
      setEditRecipeModalVisible(false);
      loadRecipes();
    } catch (error) {
      Alert.alert('Error', 'Failed to update recipe');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#F97316', '#EF4444']} style={styles.profileHeader}>
        <TouchableOpacity 
          style={styles.editProfileButton}
          onPress={openEditModal}
        >
          <Text style={styles.editProfileText}>✏️ Edit</Text>
        </TouchableOpacity>
        
        <View style={styles.profileInfo}>
          <Image 
            source={{ uri: user?.avatar }} 
            style={styles.profileAvatarImage}
          />
          <Text style={styles.profileName}>{user?.name}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
          <Text style={styles.profileBio}>{user?.bio}</Text>
        </View>
      </LinearGradient>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'uploaded' && styles.tabActive]}
          onPress={() => handleTabChange('uploaded')}
        >
          <Text style={[styles.tabText, activeTab === 'uploaded' && styles.tabTextActive]}>
            Uploaded
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'saved' && styles.tabActive]}
          onPress={() => handleTabChange('saved')}
        >
          <Text style={[styles.tabText, activeTab === 'saved' && styles.tabTextActive]}>
            Saved
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'liked' && styles.tabActive]}
          onPress={() => handleTabChange('liked')}
        >
          <Text style={[styles.tabText, activeTab === 'liked' && styles.tabTextActive]}>
            Liked
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.recipeList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : recipes.length > 0 ? (
          recipes.map((recipe) => (
            <View key={recipe._id} style={styles.recipeListItem}>
              <TouchableOpacity
                style={styles.recipeListItemTouchable}
                onPress={() => setSelectedRecipe(recipe)}
              >
                <Image source={{ uri: recipe.image }} style={styles.recipeListImage} />
                <View style={styles.recipeListInfo}>
                  <Text style={styles.recipeListTitle} numberOfLines={2}>
                    {recipe.title}
                  </Text>
                  <Text style={styles.recipeListMeta}>
                    {recipe.cuisine} • {recipe.prepTime}
                  </Text>
                  <View style={styles.recipeListStats}>
                    <Text style={styles.recipeListStat}>❤️ {recipe.likesCount}</Text>
                    <Text style={styles.recipeListStat}>🔖 {recipe.savesCount}</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Show Edit/Delete buttons only for uploaded recipes */}
              {activeTab === 'uploaded' && (
                <View style={styles.recipeListActions}>
                  <TouchableOpacity
                    style={styles.recipeActionButton}
                    onPress={() => handleEditRecipe(recipe)}
                  >
                    <Text style={styles.recipeActionIcon}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.recipeActionButton, styles.deleteButton]}
                    onPress={() => handleDeleteRecipe(recipe)}
                  >
                    <Text style={styles.recipeActionIcon}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {activeTab === 'uploaded' && 'No recipes uploaded yet'}
              {activeTab === 'saved' && 'No saved recipes'}
              {activeTab === 'liked' && 'No liked recipes'}
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity onPress={handleLogoutPress} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
          <View style={styles.editModalHeader}>
            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <Text style={styles.editModalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.editModalTitle}>Edit Profile</Text>
            <TouchableOpacity 
              onPress={handleUpdateProfile}
              disabled={updatingProfile}
            >
              <Text style={[styles.editModalSave, updatingProfile && { opacity: 0.5 }]}>
                {updatingProfile ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={{ flex: 1, padding: 20 }}
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.editAvatarContainer}>
              <Image 
                source={{ uri: editAvatar }} 
                style={styles.editAvatarImage}
              />
              <TouchableOpacity 
                style={styles.changeAvatarButton}
                onPress={pickProfileImage}
              >
                <Text style={styles.changeAvatarText}>Change Photo</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.uploadInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Your name"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.uploadInput, styles.textArea]}
              value={editBio}
              onChangeText={setEditBio}
              placeholder="Tell us about yourself..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Edit Recipe Modal */}
      <Modal
        visible={editRecipeModalVisible}
        animationType="slide"
        onRequestClose={() => setEditRecipeModalVisible(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
          <View style={styles.editModalHeader}>
            <TouchableOpacity onPress={() => setEditRecipeModalVisible(false)}>
              <Text style={styles.editModalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.editModalTitle}>Edit Recipe</Text>
            <TouchableOpacity onPress={handleUpdateRecipe}>
              <Text style={styles.editModalSave}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={{ flex: 1, padding: 20 }}
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Image Upload */}
            <Text style={styles.label}>Recipe Image</Text>
            <TouchableOpacity 
              style={styles.imageUploadContainer} 
              onPress={pickRecipeImage}
            >
              {editRecipeImage ? (
                <Image source={{ uri: editRecipeImage.uri }} style={styles.uploadedImage} />
              ) : editingRecipe ? (
                <Image source={{ uri: editingRecipe.image }} style={styles.uploadedImage} />
              ) : (
                <View style={styles.imageUploadPlaceholder}>
                  <Text style={styles.imageUploadIcon}>📸</Text>
                  <Text style={styles.imageUploadText}>Tap to change image</Text>
                </View>
              )}
            </TouchableOpacity>

            <Text style={styles.label}>Recipe Title *</Text>
            <TextInput
              style={styles.uploadInput}
              placeholder="e.g., Classic Margherita Pizza"
              value={editRecipeTitle}
              onChangeText={setEditRecipeTitle}
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.uploadInput, styles.textArea]}
              placeholder="Brief description of your recipe"
              value={editRecipeDescription}
              onChangeText={setEditRecipeDescription}
              multiline
              numberOfLines={3}
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>Cuisine Type *</Text>
            <TextInput
              style={styles.uploadInput}
              placeholder="e.g., Italian, Indian, Mexican"
              value={editRecipeCuisine}
              onChangeText={setEditRecipeCuisine}
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>Ingredients (comma-separated) *</Text>
            <TextInput
              style={[styles.uploadInput, styles.textArea]}
              placeholder="e.g., Flour, Tomatoes, Cheese"
              value={editRecipeIngredients}
              onChangeText={setEditRecipeIngredients}
              multiline
              numberOfLines={3}
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>Prep Time *</Text>
            <TextInput
              style={styles.uploadInput}
              placeholder="e.g., 30 min"
              value={editRecipePrepTime}
              onChangeText={setEditRecipePrepTime}
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>Servings *</Text>
              <View style={styles.servingsContainer}>
                <View style={styles.servingsInputWrapper}>
                  <Text style={styles.servingsLabel}>Min</Text>
                  <TextInput
                    style={styles.servingsInput}
                    placeholder="3"
                    value={editRecipeServings}
                    onChangeText={setEditRecipeServings}
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                
                <Text style={styles.servingsSeparator}>-</Text>
                
                <View style={styles.servingsInputWrapper}>
                  <Text style={styles.servingsLabel}>Max (Optional)</Text>
                  <TextInput
                    style={styles.servingsInput}
                    placeholder="4"
                    value={editRecipeServingsMax}
                    onChangeText={setEditRecipeServingsMax}
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

            <Text style={styles.label}>Instructions *</Text>
            <TextInput
              style={[styles.uploadInput, styles.textAreaLarge]}
              placeholder="Step by step cooking instructions"
              value={editRecipeInstructions}
              onChangeText={setEditRecipeInstructions}
              multiline
              numberOfLines={6}
              placeholderTextColor="#9CA3AF"
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <RecipeDetailModal
        visible={!!selectedRecipe}
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onLike={() => loadRecipes()}
        onSave={() => loadRecipes()}
        token={token}
      />
    </View>
  );
};

export default ProfileScreen;