import axios from 'axios';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:9999/api/';

//set the token in the header of all requests
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Register user
const register = async (username, password) => {
  try {
    const response = await axios.post(API_URL + 'register/', {
      username,
      password,
    });
    
    if (response.data.tokens) {
      localStorage.setItem('user', JSON.stringify({
        username,
        id: response.data.user_id
      }));
      localStorage.setItem('tokens', JSON.stringify(response.data.tokens));
      
      // Set auth token in axios headers
      setAuthToken(response.data.tokens.access);
    }
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { error: 'Network Error' };
  }
};

// Login user
const login = async (username, password) => {
  try {
    const response = await axios.post(API_URL + 'login/', {
      username,
      password,
    });
    
    // Store user and tokens in localStorage
    if (response.data.tokens) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('tokens', JSON.stringify(response.data.tokens));
      
      // Set auth token in axios headers
      setAuthToken(response.data.tokens.access);
    }
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { error: 'Network Error' };
  }
};

// Logout user
const logout = async () => {
  try {
    const tokens = JSON.parse(localStorage.getItem('tokens'));
    if (tokens && tokens.refresh) {
      // Set the token in the header
      setAuthToken(tokens.access);
      
      // Send refresh token to be blacklisted
      await axios.post(API_URL + 'logout/', { refresh: tokens.refresh });
    }
    
    // Clear localStorage and axios headers
    localStorage.removeItem('user');
    localStorage.removeItem('tokens');
    setAuthToken(null);
  } catch (error) {
    console.error('Logout error:', error);
    // Clear localStorage and axios headers even if the request fails
    localStorage.removeItem('user');
    localStorage.removeItem('tokens');
    setAuthToken(null);
  }
};

// Get current user
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

// Get tokens
const getTokens = () => {
  return JSON.parse(localStorage.getItem('tokens'));
};

// Refresh token
const refreshToken = async () => {
  try {
    const tokens = getTokens();
    if (!tokens || !tokens.refresh) {
      return false;
    }
    
    const response = await axios.post(API_URL + 'token/refresh/', {
      refresh: tokens.refresh
    });
    
    if (response.data.access) {
      const newTokens = {
        ...tokens,
        access: response.data.access
      };
      localStorage.setItem('tokens', JSON.stringify(newTokens));
      setAuthToken(response.data.access);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Token refresh error:', error);
    return false;
  }
};

// Initialize: Set auth token if available
const initializeAuth = () => {
  const tokens = getTokens();
  if (tokens && tokens.access) {
    setAuthToken(tokens.access);
  }
};

// Call initialize on service import
initializeAuth();

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getTokens,
  refreshToken,
  setAuthToken
};

export default authService; 
