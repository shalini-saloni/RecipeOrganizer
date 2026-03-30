import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { login, signup } from '../services/api';
import styles from '../styles/styles';

const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;

    if (isLogin) {
      if (!email || !password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
    } else {
      if (!name || !email || !password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
    }

    try {
      setLoading(true);

      if (isLogin) {
        const result = await login(email, password);
        onLogin(result.user, result.token);
      } else {
        const result = await signup(name, email, password);
        onLogin(result.user, result.token);
      }
    } catch (error) {
      Alert.alert(
        'Authentication Failed',
        error.response?.data?.error || 'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex1}
    >
      <LinearGradient colors={['#FFF7ED', '#FEE2E2']} style={styles.authContainer}>
        <ScrollView contentContainerStyle={styles.authScrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.authCard}>
            <View style={styles.authIconContainer}>
              <View style={styles.authIcon}>
                <MaterialCommunityIcons name="chef-hat" size={40} color="#F97316" />
              </View>
            </View>

            <Text style={styles.authTitle}>Recipe Organizer</Text>
            <Text style={styles.authSubtitle}>
              {isLogin ? 'Sign in to access your culinary world' : 'Join our community of chefs'}
            </Text>

            {!isLogin && (
              <View style={{ marginBottom: 16 }}>
                 <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor="#9CA3AF"
                    editable={!loading}
                />
              </View>
            )}

            <View style={{ marginBottom: 16 }}>
                <TextInput
                style={styles.input}
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9CA3AF"
                editable={!loading}
                />
            </View>

            <View style={{ marginBottom: 24 }}>
                <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#9CA3AF"
                editable={!loading}
                />
            </View>

            <TouchableOpacity 
              onPress={() => handleSubmit()} 
              activeOpacity={0.8}
              disabled={loading}
              style={styles.authButton}
            >
                {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={styles.authButtonText}>
                      {isLogin ? 'Log In' : 'Create Account'}
                    </Text>
                )}
            </TouchableOpacity>

            <View style={styles.authToggle}>
              <Text style={styles.authToggleText}>
                {isLogin ? "Don't have an account?" : 'Already a member?'}
              </Text>
              <TouchableOpacity 
                onPress={() => setIsLogin(!isLogin)}
                disabled={loading}
              >
                <Text style={styles.authToggleButton}>
                  {isLogin ? 'Register Now' : 'Log In'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;