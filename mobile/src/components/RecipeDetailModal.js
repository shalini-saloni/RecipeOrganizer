import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../styles/styles';

const { width, height } = Dimensions.get('window');

const RecipeDetailModal = ({ visible, recipe, onClose, onLike, onSave, token, currentUser }) => {
  if (!recipe) return null;

  const currentUserId = currentUser?.id || currentUser?._id;
  
  const isLiked = recipe.liked !== undefined 
    ? recipe.liked 
    : (recipe.likes && currentUserId && recipe.likes.includes(currentUserId));
    
  const isSaved = recipe.saved !== undefined 
    ? recipe.saved 
    : (recipe.saves && currentUserId && recipe.saves.includes(currentUserId));

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Transparent Header Over Image */}
        <View style={{ position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, left: 20, right: 20, zIndex: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <TouchableOpacity onPress={onClose} style={[styles.iconButton, { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderWidth: 0 }]}>
                <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <View style={{ height: 400, position: 'relative' }}>
             <Image source={{ uri: recipe.image }} style={{ width: '100%', height: '100%' }} />
             <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.4)']}
                style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100 }}
             />
          </View>
          
          <View style={[styles.modalContent, { marginTop: -40 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{recipe.title}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                   style={[styles.iconButton, isLiked && styles.iconButtonActive]} 
                   onPress={() => onLike(recipe._id)}
                >
                  <Ionicons 
                    name={isLiked ? "heart" : "heart-outline"} 
                    size={24} 
                    color={isLiked ? "#EF4444" : "#1F2937"} 
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                   style={[styles.iconButton, isSaved && styles.iconButtonActive]} 
                   onPress={() => onSave(recipe._id)}
                >
                  <Ionicons 
                    name={isSaved ? "bookmark" : "bookmark-outline"} 
                    size={24} 
                    color={isSaved ? "#F97316" : "#1F2937"} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <Image source={{ uri: recipe.userId?.avatar || 'https://ui-avatars.com/api/?name=User&background=F97316&color=fff' }} style={{ width: 44, height: 44, borderRadius: 22, marginRight: 12 }} />
                <View>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937' }}>{recipe.userId?.name || 'Chef'}</Text>
                    <Text style={{ fontSize: 13, color: '#6B7280' }}>Recipe Creator</Text>
                </View>
            </View>

            <Text style={styles.description}>{recipe.description}</Text>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Feather name="clock" size={24} color="#F97316" />
                <Text style={styles.infoText}>{recipe.prepTime}</Text>
              </View>
              <View style={[styles.infoItem, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#D1D5DB', paddingHorizontal: 24 }]}>
                <Ionicons name="restaurant-outline" size={24} color="#F97316" />
                <Text style={styles.infoText}>
                  {recipe.servings}{recipe.servingsMax ? `-${recipe.servingsMax}` : ''} Serv.
                </Text>
              </View>
              <View style={styles.infoItem}>
                <MaterialCommunityIcons name="silverware-variant" size={24} color="#F97316" />
                <Text style={styles.infoText}>{recipe.cuisine || 'All'}</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Ingredients</Text>
            {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#F97316', marginRight: 12 }} />
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}

            <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Cooking Steps</Text>
            <Text style={styles.instructions}>{recipe.instructions}</Text>
            
            <TouchableOpacity style={[styles.authButton, { marginBottom: 60 }]}>
                 <Text style={styles.authButtonText}>Cook it Now!</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default RecipeDetailModal;