const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const bcryptjs = require('bcryptjs');      // so we can hash passwords for basic security

const mongoUri = process.env.MONGODB_URI || 'mongodb://mongodb:27017/modulunchdb';

async function connectDB() {
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', () => console.log('Connected to MongoDB!'));

  const hasAdmin  = await User.findOne({isAdmin: true});
  if (!hasAdmin){
    const pwHash = await bcryptjs.hash('modLunchAdmin0928!', 10); // TODO: make password as an env variable instead of a hardcoded string
    const newAdmin = new User({
      username: 'admin',
      pw: pwHash,
      email: 'admin@example.com', // <-- must be a valid email string
      isAdmin: true,
      gender: 'other',
      school: 'n/a',
      major: 'n/a',
      year: 0,
      dietaryRestrictions: [],
      favouriteCuisines: [],
      bio: "ADMIN USER",  // bio is string, so this is fine
      pfp_url: 'no_pfp.png'
    });
      
    
    try{
      await newAdmin.save();
      console.log('INFO: Admin user could not be found, making new account...');
    }catch(e){
      console.error('ERROR: could not create admin account', e.message);
    }
  }else{
    console.log('INFO: Admin user account already exists');
  }

}

module.exports = connectDB;
