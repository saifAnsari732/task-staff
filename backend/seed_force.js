require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected, forcing seed...');
    
    // Check existing users
    const users = await User.find({});
    console.log(`Found ${users.length} existing users. Emails:`, users.map(u => u.email));

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('111111', salt);

    const usersToCreate = [
      { email: 'admin@company.com', password: hashedPassword, role: 'admin', name: 'Super Admin' },
      { email: 'developer@company.com', password: hashedPassword, role: 'developer', name: 'Dev Team' },
      { email: 'telecaller@company.com', password: hashedPassword, role: 'telecaller', name: 'Sarah (Calls)' },
      { email: 'video@company.com', password: hashedPassword, role: 'video_editor', name: 'Video Ed' },
      { email: 'social@company.com', password: hashedPassword, role: 'social_media', name: 'Jordan (Social)' }
    ];

    // Upsert users to ensure they exist
    for (let u of usersToCreate) {
      await User.findOneAndUpdate(
        { email: u.email },
        { $set: u },
        { upsert: true, new: true }
      );
    }
    
    console.log('Successfully forced seeded all required users with password "111111"');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
