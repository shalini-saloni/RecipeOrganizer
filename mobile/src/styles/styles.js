import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Common
  flex1: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },

  // Header
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  // Auth Screen
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  authScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  authCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  authIconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  authIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authIconText: {
    fontSize: 40,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#F97316',
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    color: '#1F2937',
  },
  authButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  authToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authToggleText: {
    color: '#6B7280',
    fontSize: 14,
  },
  authToggleButton: {
    color: '#F97316',
    fontSize: 14,
    fontWeight: '600',
  },

  // Search
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  clearIcon: {
    fontSize: 18,
    color: '#9CA3AF',
    padding: 4,
  },

// Recipe Card
recipeCard: {
  height: Dimensions.get('window').height - 300,
  backgroundColor: '#000',
  position: 'relative',
},

recipeImage: {
  width: '100%',
  height: '100%',
  resizeMode: 'cover',
},

recipeCardOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
},

recipeGradient: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: '50%',
  justifyContent: 'flex-end',
  paddingHorizontal: 20,
  paddingBottom: 20,
},

recipeInfo: {
  marginBottom: 10,
},

recipeUserInfo: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 10,
},

recipeUserAvatarImage: {
  width: 36,
  height: 36,
  borderRadius: 18,
  marginRight: 10,
  borderWidth: 2,
  borderColor: '#FFFFFF',
},

recipeUserName: {
  color: '#FFFFFF',
  fontSize: 20,
  fontWeight: '600',
},

recipeTitle: {
  fontSize: 26,
  fontWeight: 'bold',
  color: '#FFFFFF',
  marginBottom: 8,
  lineHeight: 32,
},

recipeDescription: {
  fontSize: 15,
  color: '#E5E7EB',
  marginBottom: 14,
  lineHeight: 22,
  opacity: 0.95,
  width: 250,
},

recipeMetaRow: {
  flexDirection: 'row',
  marginBottom: 10,
  flexWrap: 'wrap',
},

recipeMeta: {
  color: '#FFFFFF',
  fontSize: 14,
  marginRight: 16,
  opacity: 0.9,
},

recipeStats: {
  flexDirection: 'row',
  marginTop: 4,
},

recipeStat: {
  color: '#FFFFFF',
  fontSize: 14,
  marginRight: 16,
  fontWeight: '500',
},

recipeActionsBottomRight: {
  position: 'absolute',
  bottom: 120, 
  right: 20,
  flexDirection: 'column',
  zIndex: 10,
  elevation: 10,
},

actionButtonNew: {
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderRadius: 28,
  width: 56,
  height: 56,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 10,
  borderWidth: 3,
  borderColor: '#FFFFFF',
},

actionButtonLiked: {
  backgroundColor: '#FEE2E2',
  borderColor: '#EF4444',
},

actionButtonSaved: {
  backgroundColor: '#DBEAFE',
  borderColor: '#3B82F6',
},

actionIconNew: {
  fontSize: 28,
},

// Pagination Dots
pagination: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  height: 20, 
},

paginationDot: {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: '#D1D5DB',
  marginHorizontal: 4,
},

paginationDotActive: {
  width: 24,
  backgroundColor: '#F97316',
},

// Bottom nav adjustment
bottomNav: {
  flexDirection: 'row',
  backgroundColor: '#FFFFFF',
  borderTopWidth: 1,
  borderTopColor: '#E5E7EB',
  paddingBottom: 20,
  paddingTop: 10, // Reduced from 12
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 10,
  height: 80, 
},

  // Upload Screen
  uploadContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  uploadForm: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    marginTop: 8,
  },
  uploadInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  textAreaLarge: {
    height: 150,
    textAlignVertical: 'top',
  },
  uploadButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },

  // Profile Screen
  profileHeader: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileAvatar: {
    fontSize: 60,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 0,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#F97316',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  tabTextActive: {
    color: '#F97316',
    fontWeight: '600',
  },

  // Recipe List
  recipeList: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  recipeListItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeListImage: {
    width: 120,
    height: 120,
  },
  recipeListInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  recipeListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  recipeListMeta: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  recipeListStats: {
    flexDirection: 'row',
  },
  recipeListStat: {
    fontSize: 13,
    color: '#9CA3AF',
    marginRight: 12,
  },
  
  recipeListItemTouchable: {
    flex: 1,
    flexDirection: 'row',
  },

  recipeListActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },

  recipeActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  deleteButton: {
    backgroundColor: '#FEE2E2',
  },

  recipeActionIcon: {
    fontSize: 18,
  },

  // Logout Button
  logoutButton: {
    backgroundColor: '#EF4444',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalImage: {
    width: '100%',
    height: 300,
  },
  editModalContent: {
  flex: 1,
  padding: 20,
  backgroundColor: '#F9FAFB',
},

editModalHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingVertical: 16,
  backgroundColor: '#FFFFFF',
  borderBottomWidth: 1,
  borderBottomColor: '#E5E7EB',
  zIndex: 10,
},
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    fontSize: 20,
    marginRight: 8,
  },
  userName: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    backgroundColor: '#F9FAFB',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconButtonActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  iconButtonText: {
    fontSize: 20,
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#6B7280',
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statText: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  ingredientItem: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 28,
    paddingLeft: 8,
  },
  instructions: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 24,
  },

  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 20,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.5,
  },
  navIconActive: {
    opacity: 1,
  },
  navLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#F97316',
    fontWeight: '600',
  },
  imageUploadContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageUploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageUploadIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  imageUploadText: {
    fontSize: 16,
    color: '#6B7280',
  },

  //Recipe Card Actions 
  recipeActionsBottomRight: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'column',
    gap: 12,
  },
  actionButtonNew: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  actionButtonLiked: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  actionButtonSaved: {
    backgroundColor: '#DBEAFE',
    borderColor: '#3B82F6',
  },
  actionIconNew: {
    fontSize: 28,
  },

  // Profile Avatar Image 
  profileAvatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  profileBio: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  recipeUserAvatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  // Edit Profile Button 
  editProfileButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  editProfileText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Edit Profile Modal 
  editModalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  editModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  editModalCancel: {
    fontSize: 16,
    color: '#6B7280',
  },
  editModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  editModalSave: {
    fontSize: 16,
    color: '#F97316',
    fontWeight: '600',
  },
  editModalContent: {
    flex: 1,
    padding: 20,
  },
  editAvatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  editAvatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#F97316',
  },
  changeAvatarButton: {
    backgroundColor: '#F97316',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  changeAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  
  servingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  servingsInputWrapper: {
    flex: 1,
  },

  servingsLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
  },

  servingsInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    textAlign: 'center',
  },

  servingsSeparator: {
    fontSize: 24,
    color: '#9CA3AF',
    fontWeight: 'bold',
    marginHorizontal: 12,
    marginTop: 20,
  },

  servingsHint: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  modalUserInfo: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 12,
  paddingVertical: 8,
},

  modalUserAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#F97316',
  },

  modalUserTextContainer: {
    flex: 1,
  },

  modalUserName: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
    marginBottom: 2,
  },

  modalUserBio: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  userAvatar: {
    fontSize: 20,
    marginRight: 8,
  },

  userName: {
    fontSize: 14,
    color: '#6B7280',
  },
  
});

export default styles;