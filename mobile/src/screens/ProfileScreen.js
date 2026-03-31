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
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  getUserRecipes,
  getSavedRecipes,
  getLikedRecipes,
  updateProfile,
  uploadImage,
  deleteRecipe,
  updateRecipe,
  toggleLike,
  toggleSave
} from '../services/api';
import RecipeDetailModal from '../components/RecipeDetailModal';
import styles from '../styles/styles';

const { width } = Dimensions.get('window');

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
      setRecipes((data || []).filter(r => (r.rating ?? 0) >= 4));
    } catch (error) {
      console.error('Profile load error:', error);
      setRecipes([]);
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

  const handleUpdateProfile = async () => {
    try {
      setUpdatingProfile(true);
      const result = await updateProfile(token, {
        name: editName,
        bio: editBio,
        avatar: editAvatar
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

  // Dynamic updates for likes/saves within profile view
  const handleLikeLocal = async (recipeId) => {
    try {
      const response = await toggleLike(token, recipeId);
      // Update local state without full reload
      setRecipes(prev => prev.map(r => 
        r._id === recipeId 
          ? { ...r, likesCount: response.likesCount, liked: response.liked } 
          : r
      ));
      
      if (selectedRecipe && selectedRecipe._id === recipeId) {
        setSelectedRecipe(prev => ({ ...prev, likesCount: response.likesCount, liked: response.liked }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveLocal = async (recipeId) => {
    try {
      const response = await toggleSave(token, recipeId);
      // Update local state
      setRecipes(prev => prev.map(r => 
        r._id === recipeId 
          ? { ...r, savesCount: response.savesCount, saved: response.saved } 
          : r
      ));
      
      if (selectedRecipe && selectedRecipe._id === recipeId) {
        setSelectedRecipe(prev => ({ ...prev, savesCount: response.savesCount, saved: response.saved }));
      }
      
      // If we're on the saved tab and just unsaved, we don't necessarily remove it yet for UI feel, 
      // but the icon will update.
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FDBA74', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.profileHeader}
      >
        <SafeAreaView edges={['left', 'right', 'bottom']}>
          <View style={styles.topHeader}>
            <Text style={styles.sectionTitleBlack}>Profile</Text>
            <TouchableOpacity onPress={() => openEditModal()} style={styles.editProfileButtonSmall}>
              <Text style={{color: '#F97316', fontWeight: '800', fontSize: 13}}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <Image
              source={{ uri: user?.avatar }}
              style={styles.profileAvatarImage}
            />
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            {user?.bio && <Text style={styles.profileBio}>{user?.bio}</Text>}
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.tabContainer}>
        {['uploaded', 'saved', 'liked'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => handleTabChange(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.recipeList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F97316" />}
        contentContainerStyle={{ paddingBottom: 220, backgroundColor: 'transparent' }}
      >
        {loading ? (
          <View style={{ marginTop: 40, alignItems: 'center' }}>
            <ActivityIndicator color="#F97316" />
          </View>
        ) : recipes.length > 0 ? (
          recipes.map((recipe) => (
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
                  <Text style={{ marginLeft: 4, fontSize: 12, color: '#6B7280' }}>{recipe.likesCount || 0}</Text>
                  <Ionicons name="bookmark" size={12} color="#F97316" style={{ marginLeft: 12 }} />
                  <Text style={{ marginLeft: 4, fontSize: 12, color: '#6B7280' }}>{recipe.savesCount || 0}</Text>
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

      <TouchableOpacity onPress={() => handleLogoutPress()} style={{ marginHorizontal: 20, backgroundColor: '#FFF1F2', padding: 16, borderRadius: 16, alignItems: 'center', marginBottom: 120, position: 'absolute', bottom: 0, left: 0, right: 0, borderWidth: 1, borderColor: '#FFE4E6' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="log-out-outline" size={18} color="#EF4444" style={{ marginRight: 8 }} />
            <Text style={{ color: '#EF4444', fontWeight: '800' }}>Logout</Text>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
               <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827' }}>Edit Profile</Text>
               <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#6B7280" />
               </TouchableOpacity>
            </View>

            <View style={{ alignItems: 'center', marginBottom: 24 }}>
               <TouchableOpacity 
                  onPress={async () => {
                     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                     if (status !== 'granted') return Alert.alert('Permission Denied', 'Camera roll permissions are needed.');
                     const result = await ImagePicker.launchImageLibraryAsync({
                        base64: true, allowsEditing: true, aspect: [1, 1], quality: 0.5
                     });
                     if (!result.canceled) setEditAvatar(`data:image/jpeg;base64,${result.assets[0].base64}`);
                  }}
               >
                 <Image source={{ uri: editAvatar || user?.avatar || 'https://ui-avatars.com/api/?name=User&background=F97316&color=fff' }} style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#FFEDD5' }} />
                 <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#F97316', padding: 8, borderRadius: 20, borderWidth: 3, borderColor: '#FFFFFF' }}>
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
               onPress={() => handleUpdateProfile()}
               disabled={updatingProfile}
            >
               {updatingProfile ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.uploadButtonText}>Save Changes</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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