# 🍳 Recipe Organizer Mobile App

## 📌 Project Title
Recipe Organizer - Your Personal Recipe Collection & Discovery Platform

## 👤 Author
Shalini Saloni – 2024-B-27012005A

## 🛠 Problem Statement
Food enthusiasts, home cooks, and culinary professionals often struggle to organize their recipe collections effectively. Traditional methods like notebooks or scattered digital notes make it difficult to search, categorize, and share recipes. Users need a centralized platform where they can:
- Store and organize their favorite recipes
- Discover new recipes from a community
- Search recipes by ingredients, cuisine, or cooking time
- Save and like recipes for later reference
- Share their own culinary creations with others

This project aims to create a mobile-first solution that combines personal recipe management with social discovery features, making cooking more accessible and enjoyable.

## 💡 Proposed Solution
A cross-platform mobile application built with React Native that allows users to create, browse, save, and share recipes. The app features a swipeable card-based interface for recipe discovery, integrated image upload for visual appeal, and a comprehensive user profile system. Users can upload their own recipes with photos, search through the community recipe database, and maintain organized collections of their favorite dishes.

## ✨ Key Features

### User Management
- **Secure Authentication:** Email/password-based signup and login with JWT tokens
- **User Profiles:** Customizable profiles with avatar upload and bio
- **Profile Edit:** Update name, bio, and profile picture anytime
- **Persistent Sessions:** Auto-login with AsyncStorage

### Recipe Discovery
- **Swipeable Interface:** Horizontal swipe navigation through recipes (Tinder-style)
- **Recipe Cards:** Beautiful card layout with images, descriptions, and metadata
- **Real-time Search:** Filter recipes by title, cuisine, or ingredients
- **Pagination Indicators:** Visual dots showing current position in recipe list

### Recipe Management
- **Upload Recipes:** Create new recipes with image upload (camera or gallery)
- **Recipe Details:** Title, description, cuisine type, ingredients, prep time, servings, and instructions
- **Image Upload:** Take photos or choose from gallery with image preview
- **Like System:** Heart icon toggles from white (🤍) to red (❤️)
- **Save System:** Bookmark icon toggles from white (📑) to blue (🔖)

### Social Features
- **User Attribution:** See who uploaded each recipe with avatar and name
- **Engagement Metrics:** View likes and saves count for each recipe
- **Community Feed:** Browse recipes from all users

### Profile Organization
- **Three Tabs:**
  - **Uploaded:** All recipes you've created
  - **Saved:** Bookmarked recipes for later
  - **Liked:** Recipes you've hearted
- **Pull-to-Refresh:** Update lists with swipe-down gesture

### Additional Features
- **Recipe Detail Modal:** Full-screen view with complete instructions and ingredients
- **Responsive Design:** Optimized for iOS and Android devices
- **Bottom Navigation:** Easy access to Home, Upload, and Profile screens
- **Visual Feedback:** Button animations and color changes on interaction

## 🎯 Target Users
- Home cooks looking to organize their recipe collection
- Food bloggers wanting to share their creations
- Culinary students building their recipe portfolio
- Families maintaining generational recipe traditions
- Meal planners searching for new recipe ideas
- Diet-conscious individuals filtering recipes by ingredients

## 🖥 Technology Stack

### Mobile Frontend
- **Framework:** React Native with Expo
- **UI Components:** React Native core components
- **Styling:** StyleSheet API (no external CSS libraries)
- **Gradients:** expo-linear-gradient
- **Image Handling:** expo-image-picker
- **Storage:** AsyncStorage for persistent authentication
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator
- **Image Storage:** Base64 encoding (expandable to Cloudinary/AWS S3)

### Database Schema
- **Users:** name, email, password (hashed), avatar, bio, timestamps
- **Recipes:** title, description, image, cuisine, ingredients[], instructions, prepTime, servings, userId (ref), likes[], saves[], timestamps

### Development Tools
- **Backend Dev Server:** nodemon
- **Version Control:** Git
- **Package Manager:** npm
- **Environment Variables:** dotenv

## 📈 Expected Outcome
A fully functional mobile application that:
- Provides seamless recipe browsing with **<1 second** card swipe response time
- Supports **unlimited recipe uploads** per user
- Delivers **instant like/save updates** without page reloads
- Maintains **persistent login sessions** across app restarts
- Handles **image uploads up to 5MB** efficiently
- Achieves **95%+ uptime** with proper error handling
- Supports **concurrent users** with scalable backend architecture

### Success Metrics
- User can create an account and login within 30 seconds
- Recipe search returns results in under 1 second
- Image upload completes within 3 seconds on 4G connection
- App loads saved recipes within 2 seconds
- Zero crashes during normal usage scenarios

## ⏳ Timeline

| Week | Task | Deliverables |
|------|------|--------------|
| 1 | Project setup & architecture planning | Repository structure, database schema, API endpoints design |
| 2 | Backend development - Auth & User APIs | Working signup/login, JWT authentication, user profile CRUD |
| 3 | Backend development - Recipe APIs | Recipe CRUD, like/save functionality, search implementation |
| 4 | Frontend - Authentication screens | Signup/Login UI, form validation, AsyncStorage integration |
| 5 | Frontend - Home screen & Recipe cards | Swipeable recipe feed, search bar, pagination dots |
| 6 | Frontend - Upload screen | Recipe form, image picker, image preview, submission |
| 7 | Frontend - Profile screen | User profile display, three tabs, recipe lists, edit modal |
| 8 | Testing, debugging & deployment | Bug fixes, performance optimization, deployment to Expo/stores |

## 🚀 Installation & Setup

### Prerequisites
```bash
# Install Node.js (v16 or higher)
# Install MongoDB (local or Atlas account)
# Install Expo CLI globally
npm install -g expo-cli
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/recipe-organizer
JWT_SECRET=your-super-secret-jwt-key-change-in-production
EOF

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongodb            # Linux

# Run backend server
npm run dev
```

### Mobile App Setup
```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Update API URL in src/services/api.js
# For physical device, replace localhost with your IP address

# Start Expo development server
npm start

# Scan QR code with Expo Go app (iOS/Android)
# OR press 'a' for Android emulator, 'i' for iOS simulator
```

### Testing
```bash
# Backend tests
cd backend
npm test

# Mobile app on device
# - Scan QR code from Expo
# - Test on iOS Simulator: press 'i'
# - Test on Android Emulator: press 'a'
```

## 📁 Project Structure
```
recipe-organizer/
├── backend/
│   ├── models/
│   │   ├── User.js           # User schema
│   │   └── Recipe.js         # Recipe schema
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── recipes.js        # Recipe CRUD routes
│   │   └── upload.js         # Image upload route
│   ├── middleware/
│   │   └── auth.js           # JWT verification middleware
│   ├── server.js             # Express server setup
│   ├── package.json
│   └── .env                  # Environment variables
│
├── mobile/
│   ├── src/
│   │   ├── screens/
│   │   │   ├── AuthScreen.js       # Login/Signup
│   │   │   ├── HomeScreen.js       # Recipe feed
│   │   │   ├── UploadScreen.js     # Recipe creation
│   │   │   └── ProfileScreen.js    # User profile
│   │   ├── components/
│   │   │   ├── RecipeCard.js       # Recipe card UI
│   │   │   └── RecipeDetailModal.js # Full recipe view
│   │   ├── services/
│   │   │   └── api.js              # API calls
│   │   └── styles/
│   │       └── styles.js           # StyleSheet definitions
│   ├── App.js                # Main app component
│   ├── app.json              # Expo configuration
│   └── package.json
│
└── README.md
```

## 🔐 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Create new user account | No |
| POST | `/api/auth/login` | Login existing user | No |
| GET | `/api/auth/me` | Get current user details | Yes |
| PUT | `/api/auth/profile` | Update user profile | Yes |

### Recipes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/recipes` | Get all recipes (with search) | Yes |
| GET | `/api/recipes/:id` | Get single recipe details | Yes |
| POST | `/api/recipes` | Create new recipe | Yes |
| POST | `/api/recipes/:id/like` | Toggle like on recipe | Yes |
| POST | `/api/recipes/:id/save` | Toggle save on recipe | Yes |
| GET | `/api/recipes/user/uploaded` | Get user's uploaded recipes | Yes |
| GET | `/api/recipes/user/saved` | Get user's saved recipes | Yes |
| GET | `/api/recipes/user/liked` | Get user's liked recipes | Yes |

### Upload
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/upload/image` | Upload base64 image | Yes |

## 📱 App Screenshots Flow

### 1. Authentication
- **Login Screen:** Email/password fields, toggle to signup
- **Signup Screen:** Name, email, password fields

### 2. Home Screen
- **Recipe Cards:** Swipeable horizontal cards with images
- **Search Bar:** Filter by title, cuisine, ingredients
- **Like/Save Buttons:** Bottom-right with visual feedback
- **User Attribution:** Avatar and name of recipe creator

### 3. Upload Screen
- **Image Upload:** Camera/gallery picker with preview
- **Recipe Form:** All required fields with validation
- **Submit Button:** Creates recipe and returns to home

### 4. Profile Screen
- **Profile Header:** Avatar, name, email, bio with edit button
- **Three Tabs:** Uploaded, Saved, Liked recipes
- **Recipe Grid:** List of recipes with thumbnails
- **Edit Modal:** Update profile picture, name, and bio

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check MongoDB is running
brew services list | grep mongodb

# Check port 5000 is available
lsof -i :5000

# Kill process if needed
kill -9 <PID>
```

### Mobile app can't connect to backend
```bash
# Find your IP address
ifconfig | grep "inet "  # macOS/Linux
ipconfig                 # Windows

# Update src/services/api.js
const API_URL = 'http://YOUR_IP:5000/api';

# Ensure both devices on same WiFi network
```

### Image upload fails
```bash
# Check permissions in app.json
"permissions": ["CAMERA", "CAMERA_ROLL"]

# Request permissions at runtime
expo-image-picker automatically requests permissions
```

## 📝 Additional Notes

### Future Enhancements
- **Meal Planning:** Weekly meal calendar with recipe assignments
- **Shopping Lists:** Auto-generate grocery lists from recipes
- **Recipe Sharing:** Share recipes via social media or links
- **Video Tutorials:** Add cooking video support
- **Nutrition Info:** Calculate calories and macros per serving
- **Comments & Ratings:** Allow users to review recipes
- **Collections:** Create custom recipe collections/folders
- **Offline Mode:** Cache recipes for offline viewing
- **Multi-language:** Support for international cuisines and languages
- **AI Recommendations:** Suggest recipes based on user preferences
- **Dark Mode:** Theme toggle for better UX

### Known Limitations
- Base64 image storage (should migrate to cloud storage for production)
- No email verification (should add for production)
- Limited to 5MB images (can be increased with cloud storage)
- No password reset functionality (should be added)
- No real-time notifications (can add with Firebase)

### Security Considerations
- All passwords are hashed with bcryptjs
- JWT tokens expire after 30 days (configurable)
- API endpoints protected with authentication middleware
- Input validation on all forms with express-validator
- CORS enabled for mobile app access
- SQL injection prevented by Mongoose ODM

### Performance Optimization
- Images compressed before upload (quality: 0.7)
- Recipe lists paginated (can add infinite scroll)
- Database indexed on frequently queried fields
- Lazy loading for recipe images
- Debounced search to reduce API calls

## 📞 Contact & Support
For questions, issues, or contributions:
- **Author:** Shalini Saloni
- **Email:** shalinisaloni2801@gmail.com


## 📄 License
This project is developed as part of academic coursework at Newton School Of Technology.

---

**Made with ❤️ and 🍳 by Shalini Saloni.
