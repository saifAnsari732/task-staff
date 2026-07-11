export const colors = {
  primary: '#0A52C6', // Deep Blue for primary buttons/headers
  secondary: '#F0F4F8', // Very light blue-gray for backgrounds
  background: '#F8F9FA', // Main app background
  card: '#FFFFFF', // Card background
  text: '#1F1F1F', // Primary dark text
  textLight: '#666666', // Secondary text
  border: '#E0E0E0', // Borders and dividers
  success: '#0F9D58', // Green
  error: '#D93025', // Red
  warning: '#F4B400', // Yellow

  // Role specific palettes (bg and text)
  roles: {
    admin: { bg: '#E8F0FE', text: '#0A52C6' },
    developer: { bg: '#E8F0FE', text: '#0A52C6' }, // Same as admin for blue theme
    telecaller: { bg: '#E6F4EA', text: '#0F9D58' },
    video_editor: { bg: '#F3E8FF', text: '#673AB7' },
    social_media: { bg: '#FCE8E6', text: '#D93025', accent: '#FF7043' }, // Red/Pink bg, Orange accent
  }
};
