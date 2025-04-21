import axios from 'axios';
import authService from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:9999/api/';

/**
 * Initiates Google OAuth flow by getting the auth URL from backend
 */
const getGoogleAuthUrl = async () => {
  try {
    // Use a fixed redirect URI instead of dynamic one to ensure it matches exactly what's in Google Cloud Console
    const redirectUri = "http://localhost:3000/login/google/callback";
    const response = await axios.post(API_URL + 'auth/google/', {
      redirect_uri: redirectUri
    });
    return response.data.auth_url;
  } catch (error) {
    console.error('Error getting Google auth URL:', error);
    throw error.response?.data || { error: 'Failed to get Google authentication URL' };
  }
};

/**
 * Handles Google OAuth callback by sending auth code to backend
 */
const handleGoogleCallback = async (code) => {
  try {
    const response = await axios.post(API_URL + 'auth/google/callback/', {
      code: code
    });
    
    if (response.data.tokens) {
      // Store user info
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('tokens', JSON.stringify(response.data.tokens));
      
      // Set auth token in axios headers
      authService.setAuthToken(response.data.tokens.access);
    }
    
    return response.data;
  } catch (error) {
    console.error('Google auth callback error:', error);
    throw error.response?.data || { error: 'Google authentication failed' };
  }
};

/**
 * Handles login with Google button click
 */
const signInWithGoogle = async () => {
  try {
    const authUrl = await getGoogleAuthUrl();
    // Redirect to Google's auth page
    window.location.href = authUrl;
  } catch (error) {
    console.error('Error initiating Google sign in:', error);
    throw error;
  }
};

const googleAuthService = {
  getGoogleAuthUrl,
  handleGoogleCallback,
  signInWithGoogle
};

export default googleAuthService; 
