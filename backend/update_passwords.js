require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected, updating passwords...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('111111', salt);
    
    await User.updateMany({}, { password: hashedPassword });
    console.log('Successfully updated all users to password "111111"');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
