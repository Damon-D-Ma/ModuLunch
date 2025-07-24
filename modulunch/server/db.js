const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Hangout = require('./models/Hangout');
const HangoutReq = require('./models/HangoutReq');
const utils = require('./utils/utils');

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
    const pwHash = await utils.hashPw('modLunchAdmin0928!'); 
    const newAdmin = new User({
      username: 'admin',
      pw: pwHash,
      email: 'admin@example.com', // <-- must be a valid email string
      isAdmin: true,
      firstname: 'admin',
      lastname: 'admin',
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
      console.log('INFO: Admin user could not be found, creating new account...');
    }catch(e){
      console.error('ERROR: could not create admin account', e.message);
    }
  }else{
    console.log('INFO: Admin user account already exists');
  }

  const hasSampleUser = await User.findOne({username : 'testUser'});
  if (!hasSampleUser){
    const userPwHash = await utils.hashPw('samplePassword!');
    const newUser = new User({
      username: 'testUser',
      pw: userPwHash,
      email: 'user@email.com', // <-- must be a valid email string
      firstname: 'Walter',
      lastname: 'white',
      isAdmin: false,
      gender: 'other',
      school: 'UofTears',
      major: 'Aura Farming',
      year: 4,
      dietaryRestrictions: [],
      favouriteCuisines: [],
      bio: "IM A SAMPLE USER",  // bio is string, so this is fine
      pfp_url: 'no_pfp.png'
    });
      
    
    try{
      await newUser.save();
      console.log('INFO: Test user could not be found, creating new account...');
    }catch(e){
      console.error('ERROR: could not create test account', e.message);
    }
  }else{
    console.log('INFO: Test user account already exists');
  }

  // TODO: Below is sample objects for testing purposes, REMOVE BEFORE RELEASE
  
  const hasTestHangout  = await Hangout.findOne({name: 'ADMINTESTHANGOUT'});
  const adminAcc  = await User.findOne({isAdmin: true});
  if (!adminAcc) throw new Error('ERROR: Admin user not found');
  if (!hasTestHangout){
    const adminTestHangout = new Hangout({
      name: 'ADMINTESTHANGOUT',
      host: adminAcc._id,
      capacity: 42069,
      location: 'Albuquerque, New Mexico',
      hangoutStartTime: new Date(),
      hangoutEndTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours later
      description: 'JESSE WE HAVE TO COOK',
      inviteOnly: false
    });
    try{
      await adminTestHangout.save();
      console.log('INFO: Creating new test hangout document');
    }catch(e){
      console.error('ERROR: could not create test hangout document', e.message);
    }
  }else{
    console.log("INFO: test hangout document already exists!");
  }

  const testHangout  = await Hangout.findOne({name: 'ADMINTESTHANGOUT'});
  if (!testHangout) throw new Error('ERROR: Test hangout could not found');
  const hasTestReq =  await HangoutReq.findOne({requestingUser: adminAcc._id});
  if (!hasTestReq){
      const adminTestHangoutReq = new HangoutReq({
        requestingUser: adminAcc._id,
        requestDate: new Date(),
        hangout: testHangout._id
      });
    try{
      await adminTestHangoutReq.save();
      console.log('INFO: Creating new test hangout req document');
    }catch(e){
      console.error('ERROR: could not create test hangout req document', e.message);
    }

  }else{
    console.log("INFO: test hangout req document already exists!");
  }



  // end of test objects

}

module.exports = connectDB;
