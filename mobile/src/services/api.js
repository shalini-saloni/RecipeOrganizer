import axios from 'axios';

// Change this to your computer's IP address when testing on real device
const API_URL = 'http://localhost:3000/api';
// For real device: const API_URL = 'http://YOUR_IP:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth APIs
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const signup = async (name, email, password) => {
  const response = await api.post('/auth/signup', { name, email, password });
  return response.data;
};

export const updateProfile = async (token, profileData) => {
  const response = await api.put('/auth/profile', profileData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Upload API
export const uploadImage = async (token, imageBase64) => {
  const response = await api.post('/upload/image', 
    { image: imageBase64 },
    { headers: { Authorization: `Bearer ${token}` }}
  );
  return response.data;
};

// Recipe APIs
export const getRecipes = async (token, search = '') => {
  const response = await api.get('/recipes', {
    params: { search },
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getRecipe = async (token, id) => {
  const response = await api.get(`/recipes/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createRecipe = async (token, recipeData) => {
  const response = await api.post('/recipes', recipeData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const toggleLike = async (token, recipeId) => {
  const response = await api.post(`/recipes/${recipeId}/like`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const toggleSave = async (token, recipeId) => {
  const response = await api.post(`/recipes/${recipeId}/save`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getUserRecipes = async (token) => {
  const response = await api.get('/recipes/user/uploaded', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getSavedRecipes = async (token) => {
  const response = await api.get('/recipes/user/saved', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getLikedRecipes = async (token) => {
  const response = await api.get('/recipes/user/liked', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export default api;