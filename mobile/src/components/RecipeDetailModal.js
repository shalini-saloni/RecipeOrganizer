import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Platform,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getReviews, submitReview } from '../services/api';
import styles from '../styles/styles';

const { width, height } = Dimensions.get('window');

const RecipeDetailModal = ({ visible, recipe, onClose, onLike, onSave, token, currentUser }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [localRating, setLocalRating] = useState(null);
  const [localReviewsCount, setLocalReviewsCount] = useState(null);

  useEffect(() => {
    if (visible && recipe) {
      setShowReviewForm(false);
      setReviewRating(0);
      setReviewComment('');
      setLocalRating(null);
      setLocalReviewsCount(null);
    }
  }, [visible, recipe?._id]);

  if (!recipe) return null;

  const currentUserId = currentUser?.id || currentUser?._id;
  
  const isLiked = recipe.liked !== undefined 
    ? recipe.liked 
    : (recipe.likes && currentUserId && recipe.likes.includes(currentUserId));
    
  const isSaved = recipe.saved !== undefined 
    ? recipe.saved 
    : (recipe.saves && currentUserId && recipe.saves.includes(currentUserId));

  const isAiRecipe = recipe.userId?.name === 'AI Chef' || recipe.userId?.name === 'AI';

  const displayRating = localRating !== null ? localRating : recipe.rating;
  const displayReviewsCount = localReviewsCount !== null ? localReviewsCount : recipe.reviewsCount;

  const handleOpenReviews = async () => {
    setShowReviewForm(true);
    setLoadingReviews(true);
    try {
      const data = await getReviews(token, recipe._id);
      setReviews(data);
      // Pre-fill if the user already reviewed
      const myReview = data.find(r =>
        (r.userId?._id || r.userId) === currentUserId
      );
      if (myReview) {
        setReviewRating(myReview.rating);
        setReviewComment(myReview.comment || '');
      }
    } catch (error) {
      console.log('Failed to load reviews:', error.message);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleSubmitReview = async () => {
    if (reviewRating === 0) {
      Alert.alert('Rating Required', 'Please tap a star to rate this recipe.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitReview(token, recipe._id, reviewRating, reviewComment);
      // Update local display
      setLocalRating(result.recipeRating);
      setLocalReviewsCount(result.reviewsCount);
      // Refresh review list
      const data = await getReviews(token, recipe._id);
      setReviews(data);
      Alert.alert('Thank you!', 'Your review has been submitted.');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review. Please try again.');
      console.error('Submit review error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarSelector = () => (
    <View style={reviewStyles.starRow}>
      {[1, 2, 3, 4, 5].map(star => (
        <TouchableOpacity
          key={star}
          onPress={() => setReviewRating(star)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={star <= reviewRating ? 'star' : 'star-outline'}
            size={36}
            color={star <= reviewRating ? '#FBBF24' : '#D1D5DB'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStars = (rating) => (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <Ionicons
          key={star}
          name={star <= rating ? 'star' : star - 0.5 <= rating ? 'star-half' : 'star-outline'}
          size={14}
          color={star <= rating ? '#FBBF24' : '#D1D5DB'}
        />
      ))}
    </View>
  );

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

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

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            {!isAiRecipe && (
              <View style={{ height: 400, position: 'relative' }}>
                 <Image source={{ uri: recipe.image }} style={{ width: '100%', height: '100%' }} />
                 <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.4)']}
                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100 }}
                 />
              </View>
            )}
            
            <View style={[styles.modalContent, { marginTop: isAiRecipe ? 20 : -40 }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} numberOfLines={3}>{recipe.title}</Text>
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
                  <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937' }} numberOfLines={1}>{recipe.userId?.name || 'Chef'}</Text>
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

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  {renderStars(displayRating || 0)}
                  <Text style={[styles.reviewCountText, { fontSize: 14, fontWeight: '700', marginBottom: 0 }]}>
                    {displayRating?.toFixed(1) || 'N/A'}
                  </Text>
                </View>
                <Text style={[styles.reviewCountText, { fontSize: 14, fontWeight: '700', marginBottom: 0 }]}>
                  {displayReviewsCount || 0} reviews
                </Text>
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

              {/* Review Button */}
              <TouchableOpacity
                style={reviewStyles.reviewButton}
                onPress={handleOpenReviews}
                activeOpacity={0.8}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={20} color="#FFFFFF" />
                <Text style={reviewStyles.reviewButtonText}>
                  {showReviewForm ? 'Reviews & Rate' : 'Write a Review'}
                </Text>
              </TouchableOpacity>

              {/* Review Section (shown when button is tapped) */}
              {showReviewForm && (
                <View style={reviewStyles.reviewSection}>
                  {/* Star rating input */}
                  <Text style={reviewStyles.sectionLabel}>Your Rating</Text>
                  {renderStarSelector()}

                  {/* Comment input */}
                  <Text style={[reviewStyles.sectionLabel, { marginTop: 16 }]}>Your Review</Text>
                  <TextInput
                    style={reviewStyles.commentInput}
                    placeholder="Share your experience with this recipe..."
                    placeholderTextColor="#9CA3AF"
                    value={reviewComment}
                    onChangeText={setReviewComment}
                    multiline
                    numberOfLines={3}
                  />

                  {/* Submit button */}
                  <TouchableOpacity
                    style={[reviewStyles.submitButton, submitting && { opacity: 0.6 }]}
                    onPress={handleSubmitReview}
                    disabled={submitting}
                    activeOpacity={0.8}
                  >
                    {submitting ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={reviewStyles.submitButtonText}>Submit Review</Text>
                    )}
                  </TouchableOpacity>

                  {/* Existing reviews */}
                  <View style={reviewStyles.existingReviews}>
                    <Text style={[reviewStyles.sectionLabel, { marginTop: 24, marginBottom: 12 }]}>
                      All Reviews ({reviews.length})
                    </Text>

                    {loadingReviews ? (
                      <ActivityIndicator size="small" color="#F97316" style={{ marginVertical: 20 }} />
                    ) : reviews.length === 0 ? (
                      <View style={reviewStyles.emptyReviews}>
                        <Ionicons name="chatbubble-outline" size={32} color="#D1D5DB" />
                        <Text style={reviewStyles.emptyReviewsText}>
                          No reviews yet. Be the first to review!
                        </Text>
                      </View>
                    ) : (
                      reviews.map((review, index) => (
                        <View key={review._id || index} style={reviewStyles.reviewCard}>
                          <View style={reviewStyles.reviewHeader}>
                            <Image
                              source={{
                                uri: review.userId?.avatar ||
                                  'https://ui-avatars.com/api/?name=User&background=F97316&color=fff'
                              }}
                              style={reviewStyles.reviewAvatar}
                            />
                            <View style={{ flex: 1 }}>
                              <Text style={reviewStyles.reviewerName}>
                                {review.userId?.name || 'User'}
                              </Text>
                              <Text style={reviewStyles.reviewDate}>
                                {formatDate(review.createdAt)}
                              </Text>
                            </View>
                            {renderStars(review.rating)}
                          </View>
                          {review.comment ? (
                            <Text style={reviewStyles.reviewText}>{review.comment}</Text>
                          ) : null}
                        </View>
                      ))
                    )}
                  </View>

                  <View style={{ height: 80 }} />
                </View>
              )}

              {!showReviewForm && <View style={{ height: 60 }} />}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const reviewStyles = {
  reviewButton: {
    backgroundColor: '#F97316',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  reviewButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  reviewSection: {
    marginTop: 24,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
  },
  starRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  commentInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    fontSize: 15,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#10B981',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  existingReviews: {
    marginTop: 8,
  },
  emptyReviews: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  emptyReviewsText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  reviewDate: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  reviewText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginTop: 4,
  },
};

export default RecipeDetailModal;