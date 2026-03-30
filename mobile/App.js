import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import UploadScreen from './src/screens/UploadScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SavedRecipesScreen from './src/screens/SavedRecipesScreen';
import AiChefScreen from './src/screens/AiChefScreen';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import styles from './src/styles/styles';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [activeScreen, setActiveScreen] = useState('home');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const savedToken = await AsyncStorage.getItem('token');
      const savedUser = await AsyncStorage.getItem('user');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (userData, userToken) => {
    try {
      await AsyncStorage.setItem('token', userToken);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setToken(userToken);
      setUser(userData);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleUserUpdate = async (updatedUser) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setActiveScreen('home');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!user || !token) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <SafeAreaProvider>
      <>
        <StatusBar style="light" />
        <SafeAreaView style={styles.safeArea}>
          {activeScreen === 'home' && <HomeScreen user={user} token={token} />}
          {activeScreen === 'saved' && <SavedRecipesScreen user={user} token={token} />}
          {activeScreen === 'ai_chef' && <AiChefScreen user={user} token={token} />}
          {activeScreen === 'upload' && <UploadScreen user={user} token={token} />}
          {activeScreen === 'profile' && (
            <ProfileScreen
              user={user}
              token={token}
              onLogout={handleLogout}
              onUserUpdate={handleUserUpdate}
            />
          )}

          <View style={styles.bottomNavContainer}>
            <View style={styles.bottomNav}>
              <TouchableOpacity style={styles.navButton} onPress={() => setActiveScreen('home')}>
                <Feather name="home" size={24} color={activeScreen === 'home' ? '#F97316' : '#9CA3AF'} style={styles.navIconSpacing} />
                <Text style={[styles.navLabel, activeScreen === 'home' && styles.navLabelActive]}>Home</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navButton} onPress={() => setActiveScreen('saved')}>
                <Feather name="bookmark" size={24} color={activeScreen === 'saved' ? '#F97316' : '#9CA3AF'} style={styles.navIconSpacing} />
                <Text style={[styles.navLabel, activeScreen === 'saved' && styles.navLabelActive]}>Saved</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navButtonCenter} onPress={() => setActiveScreen('ai_chef')} activeOpacity={0.8}>
                <View style={styles.aiChefButton}>
                  <Ionicons name="sparkles" size={26} color="#FFFFFF" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navButton} onPress={() => setActiveScreen('upload')}>
                <Feather name="plus-circle" size={24} color={activeScreen === 'upload' ? '#F97316' : '#9CA3AF'} style={styles.navIconSpacing} />
                <Text style={[styles.navLabel, activeScreen === 'upload' && styles.navLabelActive]}>Upload</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navButton} onPress={() => setActiveScreen('profile')}>
                <Feather name="user" size={24} color={activeScreen === 'profile' ? '#F97316' : '#9CA3AF'} style={styles.navIconSpacing} />
                <Text style={[styles.navLabel, activeScreen === 'profile' && styles.navLabelActive]}>Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </>
    </SafeAreaProvider>
  );
}