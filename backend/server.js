require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Task = require('./models/Task');
const auth = require('./middleware/auth');
const ImageKit = require('imagekit');
const multer = require('multer');
    
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB successfully!');
    await seedInitialData();
  })
  .catch(err => console.error('MongoDB connection error:', err));

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});
const upload = multer({ storage: multer.memoryStorage() });

// Seed initial users if none exist
async function seedInitialData() {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      console.log('Seeding initial users...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('111111', salt);

      const usersToCreate = [
        { email: 'admin@company.com', password: hashedPassword, role: 'admin', name: 'Super Admin' },
        { email: 'developer@company.com', password: hashedPassword, role: 'developer', name: 'Dev Team' },
        { email: 'telecaller@company.com', password: hashedPassword, role: 'telecaller', name: 'Sarah (Calls)' },
        { email: 'video@company.com', password: hashedPassword, role: 'video_editor', name: 'Video Ed' },
        { email: 'social@company.com', password: hashedPassword, role: 'social_media', name: 'Jordan (Social)' }
      ];

      await User.insertMany(usersToCreate);
      console.log('Seed complete! Use password: "111111" to login.');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    // Sign Token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token, 
          user: { 
            uid: user.id, 
            email: user.email, 
            role: user.role, 
            name: user.name 
          } 
        });
      }
    );
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).send('Server Error');
  }
});

// Upload Image for Task
app.post('/api/upload', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });
    
    // Safely get originalname
    const originalName = req.file.originalname || 'upload';
    let ext = '';
    if (!originalName.includes('.')) {
      if (req.file.mimetype && req.file.mimetype.startsWith('video/')) ext = '.mp4';
      else if (req.file.mimetype && req.file.mimetype.startsWith('image/')) ext = '.jpg';
    }

    const response = await imagekit.upload({
      file: req.file.buffer.toString('base64'), 
      fileName: `task_${Date.now()}_${originalName.replace(/[^a-zA-Z0-9.]/g, '')}${ext}`,
      folder: '/office_tasks'
    });
    
    res.json({ url: response.url });
  } catch (err) {
    console.error('File upload error:', err.message || err);
    res.status(500).json({ error: err.message || err });
  }
});

// Update Profile Pic
app.put('/api/users/profile-pic', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image provided' });
    
    const response = await imagekit.upload({
      file: req.file.buffer.toString('base64'),
      fileName: `profile_${req.user.id}_${Date.now()}_${req.file.originalname.replace(/[^a-zA-Z0-9.]/g, '')}`,
      folder: '/office_profiles'
    });
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePic: response.url },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    console.error('Profile pic upload error:', err);
    res.status(500).json({ error: 'Profile pic upload failed' });
  }
});

// Submit Task
app.post('/api/tasks', auth, async (req, res) => {
  try {
    const newTask = new Task({
      user: req.user.id,
      role: req.user.role,
      date: req.body.date || new Date().toISOString().split('T')[0],
      details: req.body
    });
    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get Tasks
app.get('/api/tasks', auth, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'admin') {
      tasks = await Task.find().sort({ createdAt: -1 }).populate('user', ['name', 'email', 'profilePic']);
    } else {
      tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    }
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Admin: Add New User
app.post('/api/users', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const { email, password, role, name, age, salary, phone, address } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || '111111', salt);

    user = new User({
      email,
      password: hashedPassword,
      role,
      name,
      age: age || null,
      salary: salary || null,
      phone: phone || '',
      address: address || ''
    });

    await user.save();
    const userWithoutPassword = await User.findById(user._id).select('-password');
    res.json(userWithoutPassword);
  } catch (err) {
    console.error('Error adding user:', err.message);
    res.status(500).send('Server Error');
  }
});

// Admin: Update User
app.put('/api/users/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const { email, password, role, name, age, salary, phone, address } = req.body;
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (email) user.email = email;
    if (role) user.role = role;
    if (name !== undefined) user.name = name;
    if (age !== undefined) user.age = age;
    if (salary !== undefined) user.salary = salary;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    const updatedUser = await User.findById(user._id).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).send('Server Error');
  }
});

// Admin: Delete User
app.delete('/api/users/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).send('Server Error');
  }
});

// Admin: Assign Tasks (Bulk or Single)
app.post('/api/admin/assign-tasks', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const { userIds, taskDetails, roleCategory, priority, dueDate, submissionTime } = req.body;
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: 'Please select at least one employee.' });
    }

    if (!taskDetails || !taskDetails.title) {
      return res.status(400).json({ error: 'Task title is required.' });
    }

    const tasksToCreate = [];
    for (const uid of userIds) {
      const targetUser = await User.findById(uid);
      if (targetUser) {
        tasksToCreate.push({
          user: uid,
          role: targetUser.role, // Inherit actual role of the user
          date: dueDate || new Date().toISOString().split('T')[0],
          details: {
            taskAssigned: taskDetails.title,
            description: taskDetails.description || '',
            priority: priority,
            roleCategory: roleCategory,
            submissionTime: submissionTime || '',
            assignedByAdmin: true,
            status: 'Pending'
          }
        });
      }
    }

    await Task.insertMany(tasksToCreate);
    res.json({ message: 'Tasks assigned successfully!', count: tasksToCreate.length });
  } catch (err) {
    console.error('Assign tasks error:', err.message);
    res.status(500).send('Server Error');
  }
});

// Admin: Get All Users
app.get('/api/users', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    // Fetch all users except the current admin
    const users = await User.find({ _id: { $ne: req.user.id } }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
