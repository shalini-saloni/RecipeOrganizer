import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#F97316',    // Vibrant Orange
  primaryDark: '#EA580C',
  primaryLight: '#FFEDD5',
  secondary: '#8B5CF6',  // Modern Purple
  accent: '#10B981',    // Emerald Green
  background: '#FFFFFF', // Clean White
  surface: '#FFFFFF',
  textMain: '#111827',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  border: '#F3F4F6',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
};

const styles = StyleSheet.create({
  // Common Utilities
  flex1: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyTextInline: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  // Auth Screens
  authContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  authScrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  authCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 32,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 10,
  },
  authIconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  authIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authTitle: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    color: COLORS.textMain,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  authSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginBottom: 40,
    lineHeight: 24,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 18,
    fontSize: 16,
    marginBottom: 16,
    color: COLORS.textMain,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  authButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  authButtonText: {
    color: COLORS.surface,
    fontSize: 18,
    fontWeight: '700',
  },
  authToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  authToggleText: {
    color: COLORS.textSecondary,
    fontSize: 15,
  },
  authToggleButton: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 4,
  },

  // Home Screen & Headers
  homeContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  homeScrollContent: {
    paddingBottom: 150,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
    paddingBottom: 16,
    borderBottomWidth: 1, // Proper border below header area
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  greetingSubText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  greetingName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  heroTextContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  heroText: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textMain,
    letterSpacing: -0.5,
  },
  heroSubText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  modernSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  modernSearchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textMain,
    marginLeft: 10,
    fontWeight: '500',
  },

  // Section Headers
  sectionHeaderLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 16,
  },
  sectionTitleBlack: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textMain,
    letterSpacing: -0.5,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // Premium Recipe Card (Horizontal)
  premiumRecipeCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 20,
    marginRight: 16,
    width: width * 0.7, // Consistent width
    borderWidth: 1,
    borderColor: '#F9FAFB',
  },
  premiumImageContainer: {
    height: 180, // Consistent height
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F3F4F6',
  },
  premiumRecipeImage: {
    width: '100%',
    height: '100%',
  },
  timePill: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMain,
    marginLeft: 4,
  },
  heartButtonOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumInfoContainer: {
    padding: 12,
  },
  titleRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewCountText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  premiumRecipeTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textMain,
    flex: 1,
    marginRight: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EA580C',
    marginLeft: 2,
  },
  premiumRecipeDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  premiumAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumAuthorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  premiumAuthorName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },

  // Category Pills
  pillContainer: {
    marginVertical: 12,
    paddingLeft: 20,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  pillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  pillTextActive: {
    color: COLORS.surface,
  },

  // Bottom Navigation
  bottomNavContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface, // Clean White
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  navButtonCenter: {
    marginTop: -40,
  },
  aiChefButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 4,
    borderColor: COLORS.surface, // Clean white border instead of black
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    marginTop: 4,
  },
  navLabelActive: {
    color: COLORS.primary,
  },

  // Upload Screen
  uploadContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  uploadForm: {
    padding: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textMain,
    marginBottom: 8,
    marginTop: 16,
  },
  uploadInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 16,
    fontSize: 15,
    color: COLORS.textMain,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  textAreaLarge: {
    height: 180,
    textAlignVertical: 'top',
  },
  imageUploadContainer: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#F3F4F6',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: 4,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  imageUploadText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 8,
  },
  uploadButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 60,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  uploadButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '800',
  },

  // Profile Screen
  profileHeader: {
    backgroundColor: COLORS.surface,
    paddingTop: 8,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 8,
  },
  profileAvatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.primaryLight,
    marginBottom: 12,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textMain,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  profileBio: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 32,
    lineHeight: 20,
  },
  editProfileButtonSmall: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
  },

  // Profile Tabs
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: 'transparent', // Ensure no background
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: COLORS.primary,
  },

  // Recipe List Items (Vertical)
  recipeListItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    height: 100,
  },
  recipeListImage: {
    width: 100,
    height: 100,
  },
  recipeListInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  recipeListTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textMain,
    marginBottom: 2,
  },
  recipeListMeta: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
    fontWeight: '500',
  },
  recipeListStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeListActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    gap: 6,
  },
  recipeActionButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  deleteButton: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FFE4E6',
  },

  // Modal Details
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  modalContent: {
    flex: 1,
    backgroundColor: COLORS.surface,
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textMain,
    flex: 1,
    marginRight: 12,
    flexWrap: 'wrap',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  iconButtonActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryLight,
  },
  description: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textMain,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textMain,
    marginBottom: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 10,
  },
  ingredientText: {
    fontSize: 14,
    color: COLORS.textMain,
    fontWeight: '500',
  },
  instructions: {
    fontSize: 15,
    color: COLORS.textMain,
    lineHeight: 24,
    marginBottom: 40,
  },
  servingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  servingsInputWrapper: {
    flex: 1,
  },
  servingsLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
    fontWeight: '600',
  },
  servingsInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: COLORS.textMain,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  servingsSeparator: {
    fontSize: 20,
    color: COLORS.textMuted,
    marginTop: 18,
  },
  servingsHint: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default styles;