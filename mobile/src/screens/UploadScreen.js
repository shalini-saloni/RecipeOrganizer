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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
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

    if (servingsMax && (isNaN(servingsMax) || parseInt(servingsMax) < parseInt(servings))) {
      Alert.alert('Error', 'Maximum servings must be greater than or equal to minimum servings');
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
      Alert.alert('Success', 'Recipe uploaded successfully!');

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
      <ScrollView style={styles.uploadContainer}>
        <LinearGradient colors={['#F97316', '#EF4444']} style={styles.header}>
          <Text style={styles.headerTitle}>Upload Recipe</Text>
        </LinearGradient>

        <View style={styles.uploadForm}>
          <Text style={styles.label}>Recipe Image</Text>
          <TouchableOpacity 
            style={styles.imageUploadContainer} 
            onPress={showImageOptions}
            disabled={loading}
          >
            {image ? (
              <Image source={{ uri: image.uri }} style={styles.uploadedImage} />
            ) : (
              <View style={styles.imageUploadPlaceholder}>
                <Text style={styles.imageUploadIcon}>📸</Text>
                <Text style={styles.imageUploadText}>Tap to add image</Text>
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

          <Text style={styles.label}>Cuisine Type *</Text>
          <TextInput
            style={styles.uploadInput}
            placeholder="e.g., Italian, Indian, Mexican"
            value={cuisine}
            onChangeText={setCuisine}
            placeholderTextColor="#9CA3AF"
            editable={!loading}
          />

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

          <Text style={styles.label}>Prep Time *</Text>
          <TextInput
            style={styles.uploadInput}
            placeholder="e.g., 30 min"
            value={prepTime}
            onChangeText={setPrepTime}
            placeholderTextColor="#9CA3AF"
            editable={!loading}
          />

          <Text style={styles.label}>Servings *</Text>
          <View style={styles.servingsContainer}>
            <View style={styles.servingsInputWrapper}>
              <Text style={styles.servingsLabel}>Min</Text>
              <TextInput
                style={styles.servingsInput}
                placeholder="3"
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
          <Text style={styles.servingsHint}>
            💡 Leave max empty for exact serving (e.g., "4"), or fill both for range (e.g., "3-4")
          </Text>

          <Text style={styles.label}>Instructions *</Text>
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
            onPress={handleUpload} 
            activeOpacity={0.8}
            disabled={loading}
          >
            <LinearGradient colors={['#F97316', '#EF4444']} style={styles.uploadButton}>
              <Text style={styles.uploadButtonText}>
                {loading ? 'Uploading...' : 'Upload Recipe'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UploadScreen;