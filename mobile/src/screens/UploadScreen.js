import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { createRecipe, uploadImage } from '../services/api';
import styles from '../styles/styles';

const UploadScreen = ({ user, token }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [servings, setServings] = useState('');
  const [servingsMax, setServingsMax] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to upload images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled) {
        setImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera permissions to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled) {
        setImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Add Recipe Image',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleUpload = async () => {
    if (!title || !description || !cuisine || !ingredients || !prepTime || !servings || !instructions) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (isNaN(servings) || parseInt(servings) < 1) {
      Alert.alert('Error', 'Minimum servings must be a valid number');
      return;
    }

    try {
      setLoading(true);
      let imageUrl = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800';

      if (image && image.base64) {
        const uploadResult = await uploadImage(token, `data:image/jpeg;base64,${image.base64}`);
        imageUrl = uploadResult.url;
      }

      const recipe = {
        title,
        description,
        cuisine,
        ingredients: ingredients.split(',').map(i => i.trim()).filter(i => i),
        prepTime,
        servings: parseInt(servings),
        servingsMax: servingsMax ? parseInt(servingsMax) : null,
        instructions,
        image: imageUrl
      };

      await createRecipe(token, recipe);
      Alert.alert('Success', 'Your delicious recipe is now live!');

      setTitle('');
      setDescription('');
      setCuisine('');
      setIngredients('');
      setPrepTime('');
      setServings('');
      setServingsMax('');
      setInstructions('');
      setImage(null);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to upload recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex1}
    >
      <SafeAreaView style={[styles.uploadContainer, { backgroundColor: '#FFFFFF' }]}>
        <LinearGradient
          colors={['#FDBA74', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={[styles.topHeader, { paddingBottom: 20 }]}>
            <Text style={styles.sectionTitleBlack}>Upload Recipe</Text>
            <Feather name="upload-cloud" size={24} color="#F97316" />
          </View>
        </LinearGradient>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>

          <View style={styles.uploadForm}>
            <Text style={styles.label}>Recipe Image</Text>
            <TouchableOpacity
              style={styles.imageUploadContainer}
              onPress={showImageOptions}
              disabled={loading}
              activeOpacity={0.7}
            >
              {image ? (
                <Image source={{ uri: image.uri }} style={styles.uploadedImage} />
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <Ionicons name="image-outline" size={48} color="#D1D5DB" style={styles.imageUploadIcon} />
                  <Text style={styles.imageUploadText}>Tap to add a mouth-watering photo</Text>
                </View>
              )}
            </TouchableOpacity>

            <Text style={styles.label}>Recipe Title *</Text>
            <TextInput
              style={styles.uploadInput}
              placeholder="e.g., Classic Margherita Pizza"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#9CA3AF"
              editable={!loading}
            />

            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.uploadInput, styles.textArea]}
              placeholder="Brief description of your recipe"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              placeholderTextColor="#9CA3AF"
              editable={!loading}
            />

            <View style={{ flexDirection: 'row', gap: 16 }}>
               <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Cuisine *</Text>
                    <TextInput
                    style={styles.uploadInput}
                    placeholder="e.g., Italian"
                    value={cuisine}
                    onChangeText={setCuisine}
                    placeholderTextColor="#9CA3AF"
                    editable={!loading}
                    />
               </View>
               <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Prep Time *</Text>
                    <TextInput
                    style={styles.uploadInput}
                    placeholder="e.g., 30 min"
                    value={prepTime}
                    onChangeText={setPrepTime}
                    placeholderTextColor="#9CA3AF"
                    editable={!loading}
                    />
               </View>
            </View>

            <Text style={styles.label}>Ingredients (comma-separated) *</Text>
            <TextInput
              style={[styles.uploadInput, styles.textArea]}
              placeholder="e.g., Flour, Tomatoes, Cheese"
              value={ingredients}
              onChangeText={setIngredients}
              multiline
              numberOfLines={3}
              placeholderTextColor="#9CA3AF"
              editable={!loading}
            />

            <Text style={styles.label}>Servings *</Text>
            <View style={styles.servingsContainer}>
              <View style={styles.servingsInputWrapper}>
                <Text style={styles.servingsLabel}>Min</Text>
                <TextInput
                  style={styles.servingsInput}
                  placeholder="2"
                  value={servings}
                  onChangeText={setServings}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                  editable={!loading}
                />
              </View>

              <Text style={styles.servingsSeparator}>-</Text>

              <View style={styles.servingsInputWrapper}>
                <Text style={styles.servingsLabel}>Max (Optional)</Text>
                <TextInput
                  style={styles.servingsInput}
                  placeholder="4"
                  value={servingsMax}
                  onChangeText={setServingsMax}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                  editable={!loading}
                />
              </View>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, backgroundColor: '#F3F4F6', padding: 12, borderRadius: 12 }}>
                <Ionicons name="information-circle-outline" size={18} color="#6B7280" style={{ marginRight: 8 }} />
                <Text style={{ fontSize: 13, color: '#6B7280', flex: 1 }}>
                   Leave max empty for exact serving, or fill both for range.
                </Text>
            </View>

            <Text style={styles.label}>Cooking Instructions *</Text>
            <TextInput
              style={[styles.uploadInput, styles.textAreaLarge]}
              placeholder="Step by step cooking instructions"
              value={instructions}
              onChangeText={setInstructions}
              multiline
              numberOfLines={6}
              placeholderTextColor="#9CA3AF"
              editable={!loading}
            />

            <TouchableOpacity
              onPress={() => handleUpload()}
              activeOpacity={0.8}
              disabled={loading}
              style={styles.uploadButton}
            >
                {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={styles.uploadButtonText}>Share Recipe</Text>
                )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default UploadScreen;