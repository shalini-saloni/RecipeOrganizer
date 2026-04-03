import React, { useState, useEffect, useContext } from 'react';
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
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import RecipeContext from '../context/RecipeContext';
import {
  getUserRecipes,
  getSavedRecipes,
  getLikedRecipes,
  updateProfile,
  toggleLike,
  toggleSave,
} from '../services/api';
import RecipeDetailModal from '../components/RecipeDetailModal';
import styles from '../styles/styles';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ user, token, onLogout, onUserUpdate }) => {
  const {
    uploadedRecipes, setUploadedRecipes,
    savedRecipes,    setSavedRecipes,
    likedRecipes,    setLikedRecipes,
  } = useContext(RecipeContext);

  const [activeTab, setActiveTab] = useState('uploaded');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Map tab name → context getter/setter pairs
  const tabConfig = {
    uploaded: { data: uploadedRecipes, setter: setUploadedRecipes, fetch: () => getUserRecipes(token) },
    saved:    { data: savedRecipes,    setter: setSavedRecipes,    fetch: () => getSavedRecipes(token) },
    liked:    { data: likedRecipes,    setter: setLikedRecipes,    fetch: () => getLikedRecipes(token) },
  };

  // Current tab's data from context
  const currentRecipes = tabConfig[activeTab].data;

  // Load only if context is empty for this tab
  useEffect(() => {
    if (currentRecipes.length === 0) {
      loadRecipes();
    }
  }, [activeTab]);

  const loadRecipes = async () => {
    const { setter, fetch } = tabConfig[activeTab];
    try {
      setLoading(true);
      const data = await fetch();
      setter(data || []);
    } catch (error) {
      console.error('Profile load error:', error);
      setter([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Force refresh — always re-fetch on pull
    const { setter, fetch } = tabConfig[activeTab];
    try {
      const data = await fetch();
      setter(data || []);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Helper: update a recipe across ALL context lists that contain it
  const updateRecipeInAllLists = (recipeId, updater) => {
    const applyUpdate = (list) =>
      list.map(r => (r._id === recipeId ? updater(r) : r));

    setUploadedRecipes(prev => applyUpdate(prev));
    setSavedRecipes(prev => applyUpdate(prev));
    setLikedRecipes(prev => applyUpdate(prev));

    if (selectedRecipe?._id === recipeId) {
      setSelectedRecipe(prev => updater(prev));
    }
  };

  const handleLikeLocal = async (recipeId) => {
    try {
      const response = await toggleLike(token, recipeId);
      updateRecipeInAllLists(recipeId, r => ({
        ...r,
        likesCount: response.likesCount,
        liked: response.liked,
      }));
    } catch (e) {
      console.error('Like error:', e);
    }
  };

  const handleSaveLocal = async (recipeId) => {
    try {
      const response = await toggleSave(token, recipeId);
      updateRecipeInAllLists(recipeId, r => ({
        ...r,
        savesCount: response.savesCount,
        saved: response.saved,
      }));
    } catch (e) {
      console.error('Save error:', e);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setUpdatingProfile(true);
      const result = await updateProfile(token, {
        name: editName,
        bio: editBio,
        avatar: editAvatar,
      });
      if (onUserUpdate) onUserUpdate(result.user);
      Alert.alert('Success', 'Profile updated!');
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

  const handleLogoutPress = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: onLogout, style: 'destructive' },
    ]);
  };

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permission Denied', 'Camera roll permissions are needed.');
    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      setEditAvatar(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const TAB_LABELS = { uploaded: 'Uploaded', saved: 'Saved', liked: 'Liked' };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#FDBA74', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.profileHeader}
      >
        <SafeAreaView edges={['left', 'right', 'bottom']}>
          <View style={styles.topHeader}>
            <Text style={styles.sectionTitleBlack}>Profile</Text>
            <TouchableOpacity onPress={openEditModal} style={styles.editProfileButtonSmall}>
              <Text style={{ color: '#F97316', fontWeight: '800', fontSize: 13 }}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <Image
              source={{
                uri: user?.avatar ||
                  'https://ui-avatars.com/api/?name=User&background=F97316&color=fff',
              }}
              style={styles.profileAvatarImage}
            />
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            {user?.bio ? <Text style={styles.profileBio}>{user.bio}</Text> : null}
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {Object.keys(TAB_LABELS).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {TAB_LABELS[tab]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recipe List */}
      <ScrollView
        style={styles.recipeList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F97316" />
        }
        contentContainerStyle={{ paddingBottom: 220, backgroundColor: 'transparent' }}
      >
        {loading ? (
          <View style={{ marginTop: 40, alignItems: 'center' }}>
            <ActivityIndicator color="#F97316" />
          </View>
        ) : currentRecipes.length > 0 ? (
          currentRecipes.map((recipe) => (
            <TouchableOpacity
              key={recipe._id}
              style={styles.recipeListItem}
              onPress={() => setSelectedRecipe(recipe)}
            >
              <Image source={{ uri: recipe.image }} style={styles.recipeListImage} />
              <View style={styles.recipeListInfo}>
                <Text style={styles.recipeListTitle} numberOfLines={1}>{recipe.title}</Text>
                <Text style={styles.recipeListMeta}>{recipe.cuisine} • {recipe.prepTime}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="heart" size={12} color="#EF4444" />
                  <Text style={{ marginLeft: 4, fontSize: 12, color: '#6B7280' }}>
                    {recipe.likesCount || 0}
                  </Text>
                  <Ionicons name="bookmark" size={12} color="#F97316" style={{ marginLeft: 12 }} />
                  <Text style={{ marginLeft: 4, fontSize: 12, color: '#6B7280' }}>
                    {recipe.savesCount || 0}
                  </Text>
                </View>
              </View>
              <View style={styles.recipeListActions}>
                <TouchableOpacity style={styles.recipeActionButton}>
                  <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No recipes found here.</Text>
          </View>
        )}
      </ScrollView>

      {/* Logout */}
      <TouchableOpacity
        onPress={handleLogoutPress}
        style={{
          marginHorizontal: 20,
          backgroundColor: '#FFF1F2',
          padding: 16,
          borderRadius: 16,
          alignItems: 'center',
          marginBottom: 120,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          borderWidth: 1,
          borderColor: '#FFE4E6',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="log-out-outline" size={18} color="#EF4444" style={{ marginRight: 8 }} />
          <Text style={{ color: '#EF4444', fontWeight: '800' }}>Logout</Text>
        </View>
      </TouchableOpacity>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            padding: 24,
            paddingBottom: Platform.OS === 'ios' ? 40 : 24,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827' }}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Avatar picker */}
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <TouchableOpacity onPress={pickAvatar}>
                <Image
                  source={{
                    uri: editAvatar ||
                      user?.avatar ||
                      'https://ui-avatars.com/api/?name=User&background=F97316&color=fff',
                  }}
                  style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#FFEDD5' }}
                />
                <View style={{
                  position: 'absolute', bottom: 0, right: 0,
                  backgroundColor: '#F97316', padding: 8, borderRadius: 20,
                  borderWidth: 3, borderColor: '#FFFFFF',
                }}>
                  <Ionicons name="camera" size={16} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { marginTop: 0 }]}>Name</Text>
            <TextInput
              style={styles.uploadInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Your name"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={[styles.label, { marginTop: 16 }]}>Bio</Text>
            <TextInput
              style={[styles.uploadInput, { height: 100, textAlignVertical: 'top' }]}
              value={editBio}
              onChangeText={setEditBio}
              placeholder="Write a little about yourself"
              multiline
              placeholderTextColor="#9CA3AF"
            />

            <TouchableOpacity
              style={[styles.uploadButton, { marginBottom: 0, marginTop: 32 }]}
              onPress={handleUpdateProfile}
              disabled={updatingProfile}
            >
              {updatingProfile
                ? <ActivityIndicator color="#FFFFFF" />
                : <Text style={styles.uploadButtonText}>Save Changes</Text>
              }
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        visible={!!selectedRecipe}
        recipe={selectedRecipe}
        currentUser={user}
        onClose={() => setSelectedRecipe(null)}
        onLike={handleLikeLocal}
        onSave={handleSaveLocal}
        token={token}
      />
    </View>
  );
};

export default ProfileScreen;