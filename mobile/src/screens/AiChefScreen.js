import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { generateAiRecipe } from '../services/api';
import { toggleLike, toggleSave } from '../services/api';
import RecipeDetailModal from '../components/RecipeDetailModal';
import styles from '../styles/styles';

const { width } = Dimensions.get('window');

const AiChefScreen = ({ user, token }) => {
  const [ingredients, setIngredients] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleGenerate = async () => {
    if (!ingredients.trim()) {
      Alert.alert('Missing Ingredients', 'Please enter some ingredients you have on hand!');
      return;
    }
    
    setLoading(true);
    try {
      const recipe = await generateAiRecipe(token, ingredients);
      setGeneratedRecipe(recipe);
    } catch (error) {
      console.error('Generation Error:', error);
      Alert.alert(
        'AI Chef Error',
        error.response?.data?.error || 'Failed to generate a recipe. Please try again in a moment.'
      );
    } finally {
      setLoading(false);
    }
  };

  const openRecipeDetails = (recipe = null) => {
    setSelectedRecipe(recipe || generatedRecipe);
    setIsModalVisible(true);
  };

  const handleLike = async (recipeId) => {
    try {
      const response = await toggleLike(token, recipeId);
      // Update the current generated recipe if it's the one being liked
      if (generatedRecipe && generatedRecipe._id === recipeId) {
        setGeneratedRecipe(prev => ({ ...prev, likesCount: response.likesCount, liked: response.liked }));
      }
    } catch (error) {
      console.error('Failed to like', error);
    }
  };

  const handleSave = async (recipeId) => {
    try {
      const response = await toggleSave(token, recipeId);
      // Update the current generated recipe if it's the one being saved
      if (generatedRecipe && generatedRecipe._id === recipeId) {
        setGeneratedRecipe(prev => ({ ...prev, savesCount: response.savesCount, saved: response.saved }));
      }
    } catch (error) {
      console.error('Failed to save', error);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#FFFFFF' }]}>
      <LinearGradient
        colors={['#FDBA74', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.topHeader}>
          <Text style={styles.sectionTitleBlack}>AI Chef</Text>
          <MaterialCommunityIcons name="chef-hat" size={26} color="#F97316" />
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 12, marginBottom: 12 }}>
          <Text style={styles.heroText}>What's in your</Text>
          <Text style={{ fontSize: 28, fontWeight: '300', color: '#1F2937' }}>fridge?</Text>
          <Text style={{ fontSize: 14, color: '#4B5563', marginTop: 8, lineHeight: 20 }}>
            Enter your ingredients, and our AI will create a professional recipe for you instantly.
          </Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: 8 }}>

          <TextInput
            style={[styles.uploadInput, { 
              minHeight: 120, 
              backgroundColor: '#F9FAFB', 
              borderRadius: 20, 
              padding: 16, 
              textAlignVertical: 'top',
              borderWidth: 1,
              borderColor: '#F3F4F6'
            }]}
            placeholder="e.g., chicken, rice, tomatoes, garlic..."
            value={ingredients}
            onChangeText={setIngredients}
            multiline
            placeholderTextColor="#9CA3AF"
          />

          <TouchableOpacity 
            style={[styles.uploadButton, { marginTop: 20 }]}
            onPress={() => handleGenerate()}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="sparkles" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.uploadButtonText}>Generate Recipe</Text>
              </View>
            )}
          </TouchableOpacity>

          {generatedRecipe && (
            <TouchableOpacity 
              style={{ 
                marginTop: 32, 
                backgroundColor: '#FFFFFF', 
                padding: 20, 
                borderRadius: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.05,
                shadowRadius: 15,
                elevation: 5,
                borderWidth: 1,
                borderColor: '#F97316'
              }}
              onPress={() => openRecipeDetails()}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827', flex: 1 }}>{generatedRecipe.title}</Text>
                  <Ionicons name="chevron-forward" size={22} color="#F97316" />
              </View>
              
              <Text style={{ fontSize: 14, color: '#4B5563', marginTop: 8, lineHeight: 20 }} numberOfLines={2}>
                {generatedRecipe.description}
              </Text>
              
              <View style={{ flexDirection: 'row', marginTop: 16, alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginRight: 10 }}>
                  <Ionicons name="time-outline" size={14} color="#F97316" />
                  <Text style={{ marginLeft: 4, fontSize: 13, fontWeight: '700', color: '#4B5563' }}>{generatedRecipe.prepTime}</Text>
                </View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF7ED', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 }}>
                  <Ionicons name="star" size={14} color="#EA580C" />
                  <Text style={{ marginLeft: 4, fontSize: 13, fontWeight: '700', color: '#4B5563' }}>{generatedRecipe.rating || '4.9'}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}

        </View>
      </ScrollView>

      {selectedRecipe && (
        <RecipeDetailModal
          visible={isModalVisible}
          recipe={{
            ...selectedRecipe,
            userId: { name: 'AI Chef', avatar: 'https://ui-avatars.com/api/?name=AI&background=F97316&color=fff' }
          }}
          onClose={() => setIsModalVisible(false)}
          onLike={handleLike}
          onSave={handleSave}
          token={token}
          currentUser={user}
        />
      )}
    </SafeAreaView>
  );
};

export default AiChefScreen;
