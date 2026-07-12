import { create } from 'zustand';
import axios from 'axios';

// IMPORTANT: Use localhost for web, or your PC's local IP (e.g., 192.168.1.5) for mobile device testing
const API_URL = 'https://task-staff.onrender.com/api';

const useAuthStore = create((set) => ({
  user: null,
  role: null,
  token: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, user } = response.data;
      
      set({ 
        user, 
        role: user.role, 
        token,
        isLoading: false 
      });
      return true;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.error || 'Failed to login'
      });
      return false;
    }
  },

  logout: () => set({ user: null, role: null, token: null, error: null }),

  updateProfilePic: async (uri) => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      
      let formData = new FormData();
      const filename = uri.split('/').pop() || 'profile.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;
      
      if (typeof window !== 'undefined' && window.document) {
        const res = await fetch(uri);
        const blob = await res.blob();
        formData.append('image', blob, filename);
      } else {
        formData.append('image', { uri, name: filename, type });
      }
      
      const response = await axios.put(`${API_URL}/users/profile-pic`, formData, {
        headers: { 
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      set({ user: response.data, isLoading: false });
      return true;
    } catch (error) {
      console.error(error);
      set({ 
        isLoading: false, 
        error: error.response?.data?.error || 'Failed to update profile picture'
      });
      return false;
    }
  },
  
  // For testing purposes during transition
  setUser: (user, role) => set({ user, role, token: 'mock-token' }),
}));

export default useAuthStore;
