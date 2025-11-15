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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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

    try {
      setLoading(true);

      if (isLogin) {
        if (!email || !password) {
          Alert.alert('Error', 'Please fill in all fields');
          return;
        }
        const result = await login(email, password);
        onLogin(result.user, result.token);
      } else {
        if (!name || !email || !password) {
          Alert.alert('Error', 'Please fill in all fields');
          return;
        }
        const result = await signup(name, email, password);
        onLogin(result.user, result.token);
      }
    } catch (error) {
      Alert.alert(
        'Error',
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
        <ScrollView contentContainerStyle={styles.authScrollContent}>
          <View style={styles.authCard}>
            <View style={styles.authIconContainer}>
              <LinearGradient colors={['#F97316', '#EF4444']} style={styles.authIcon}>
                <Text style={styles.authIconText}>👨‍🍳</Text>
              </LinearGradient>
            </View>

            <Text style={styles.authTitle}>Recipe Organizer</Text>
            <Text style={styles.authSubtitle}>
              {isLogin ? 'Welcome back!' : 'Create your account'}
            </Text>

            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#9CA3AF"
                editable={!loading}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
              editable={!loading}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#9CA3AF"
              editable={!loading}
            />

            <TouchableOpacity 
              onPress={handleSubmit} 
              activeOpacity={0.8}
              disabled={loading}
            >
              <LinearGradient colors={['#F97316', '#EF4444']} style={styles.authButton}>
                <Text style={styles.authButtonText}>
                  {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.authToggle}>
              <Text style={styles.authToggleText}>
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
              </Text>
              <TouchableOpacity 
                onPress={() => setIsLogin(!isLogin)}
                disabled={loading}
              >
                <Text style={styles.authToggleButton}>
                  {isLogin ? 'Sign Up' : 'Login'}
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