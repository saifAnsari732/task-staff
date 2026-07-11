const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'developer', 'telecaller', 'video_editor', 'social_media'],
    default: 'developer'
  },
  name: {
    type: String,
    default: ''
  },
  profilePic: {
    type: String,
    default: ''
  },
  age: {
    type: Number,
    default: null
  },
  salary: {
    type: Number,
    default: null
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
