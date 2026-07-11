import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './useAuthStore';

const API_URL = 'http://localhost:5000/api';

const useTaskStore = create((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await axios.get(`${API_URL}/tasks`, {
        headers: { 'x-auth-token': token }
      });
      set({ tasks: res.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to fetch tasks', isLoading: false });
    }
  },

  submitTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      let finalTaskData = { ...taskData };

      // Handle Media Upload First (Image or Video)
      const mediaField = taskData.screenshotUrl ? 'screenshotUrl' : (taskData.videoFile ? 'videoFile' : null);
      
      if (mediaField && taskData[mediaField] && taskData[mediaField].uri) {
        let formData = new FormData();
        const uri = taskData[mediaField].uri;
        const filename = uri.split('/').pop() || 'upload.file';
        const match = /\.(\w+)$/.exec(filename);
        
        let type = 'image/jpeg';
        if (mediaField === 'videoFile') {
           type = match ? `video/${match[1]}` : `video/mp4`;
        } else {
           type = match ? `image/${match[1]}` : `image/jpeg`;
        }
        
        // Handle Web vs Mobile File Uploads
        if (typeof window !== 'undefined' && window.document) {
          // Web environment
          const res = await fetch(uri);
          const blob = await res.blob();
          formData.append('image', blob, filename);
        } else {
          // Mobile environment
          formData.append('image', { uri, name: filename, type });
        }
        
        const uploadRes = await axios.post(`${API_URL}/upload`, formData, {
          headers: { 
            'x-auth-token': token,
            'Content-Type': 'multipart/form-data'
          }
        });
        
        finalTaskData[mediaField] = uploadRes.data.url;
      }

      const res = await axios.post(`${API_URL}/tasks`, finalTaskData, {
        headers: { 'x-auth-token': token }
      });
      
      set(state => ({ tasks: [res.data, ...state.tasks], isLoading: false }));
      return true;
    } catch (error) {
      console.error(error);
      set({ error: error.response?.data?.error || 'Failed to submit task', isLoading: false });
      return false;
    }
  }
}));

export default useTaskStore;
