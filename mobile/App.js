import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import UploadScreen from './src/screens/UploadScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
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
    <>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        {activeScreen === 'home' && <HomeScreen user={user} token={token} />}
        {activeScreen === 'upload' && <UploadScreen user={user} token={token} />}
        {activeScreen === 'profile' && (
          <ProfileScreen 
            user={user} 
            token={token} 
            onLogout={handleLogout}
            onUserUpdate={handleUserUpdate}
          />
        )}

        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setActiveScreen('home')}
          >
            <Text style={[styles.navIcon, activeScreen === 'home' && styles.navIconActive]}>
              🏠
            </Text>
            <Text style={[styles.navLabel, activeScreen === 'home' && styles.navLabelActive]}>
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setActiveScreen('upload')}
          >
            <Text style={[styles.navIcon, activeScreen === 'upload' && styles.navIconActive]}>
              ➕
            </Text>
            <Text style={[styles.navLabel, activeScreen === 'upload' && styles.navLabelActive]}>
              Upload
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setActiveScreen('profile')}
          >
            <Text style={[styles.navIcon, activeScreen === 'profile' && styles.navIconActive]}>
              👤
            </Text>
            <Text style={[styles.navLabel, activeScreen === 'profile' && styles.navLabelActive]}>
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}