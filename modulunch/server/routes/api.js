const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Hangout = require('../models/Hangout');
const HangoutReq = require('../models/HangoutReq');
const requireLogin = require('../middleware/requireLogin');
const requireAdmin = require('../middleware/requireAdmin');
const utils = require('../utils/utils'); // adjust path if needed

// /api/login
router.post('/login', async (req, res) => {
  const { username, pw } = req.body;
  try {
    // check if the user exists first
    const user = await User.findOne({username});
    if (!user) return res.status(401).json({ error: 'Invalid credentials, try again' });

    //if the username exists, check the password (hash)
    const correctPw  = await user.comparePassword(pw);
    if (!correctPw) return res.status(401).json({ error: 'Invalid credentials, try again' });

    if (req.session.user) return res.status(401).json({ error: 'You are already logged in!' });

    // store the user's info in the session
    req.session.user = {
      _id: user._id,
      username: user.username,
      isAdmin: user.isAdmin
    };


    res.json({ success: true, message: 'Login successful, welcome ' + user.username + '!' });



  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login, please try again!' });
  }
});



// /api/logout
router.post('/logout', requireLogin, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed, please try again' });
    }
    res.clearCookie('connect.sid');
    res.json({ success: true, message: 'Log out successful!' });
  });
});


// /api/register
router.post('/register', async (req, res) => {
  if (req.session.user) {
    return res.status(401).json({ error: 'Cannot create account, you are already logged in.' });
  }

  try {
    const {
      username,
      pw,
      email,
      gender,
      school,
      major,
      year,
      dietaryRestrictions = [],
      favouriteCuisines = [],
      bio = '',
      pfp_url = 'no_pfp.png'
    } = req.body;

    if (!username || !pw || !email || !gender || !school || !major || !year) {
      return res.status(400).json({ error: 'Missing at least one required field!' });
    }

    if (await User.findOne({ username })) {
      return res.status(409).json({ error: 'Username already exists, please choose another' });
    }

    if (await User.findOne({ email })) {
      return res.status(409).json({ error: 'Email already exists, please choose another' });
    }

    const pwHash = utils.hashPw(pw);

    const newUser = new User({
      username,
      pw: pwHash,
      email,
      gender,
      school,
      major,
      year,
      dietaryRestrictions,
      favouriteCuisines,
      bio,
      pfp_url
    });

    await newUser.save();

    // Create session
    req.session.user = {
      _id: newUser._id,
      username: newUser.username,
      isAdmin: newUser.isAdmin
    };

    res.json({ success: true, message: 'Registration successful, welcome ' + newUser.username + '!' });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration, please try again' });
  }
});


// /api/changepw
router.post('/changepw', requireLogin, async (req, res) => {
  try{
    
    const {
      oldPw,
      newPw
    } = req.body;

    const { username } = req.session.user;

    if (!oldPw){
      return res.status(400).json({ error: 'Missing old password, please try again' });
    }
    if (!newPw){
      return res.status(400).json({ error: 'Missing new password.' });
    }
    if (oldPw === newPw){
      return res.status(400).json({ error: 'Your old password cannot be your new password!' });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User could not be found' });

    if (! await user.comparePassword(oldPw)){
      return res.status(401).json({ error: 'Current password is incorrect, please try again' });
    }

    // Save new password
    const newPwHash = utils.hashPw(newPw);
    user.pw = newPwHash;
    await user.save();

    res.json({ success: true, message: 'Password successfully changed' });

  }catch (err){
    console.error('Password change error:', err);
    res.status(500).json({ error: 'Server error during password change, please try again' });
  }

});


// /api/change-username
router.post('/change-username', requireLogin, async (req, res) => {
  try{
    
    const {
      newUsername,
      pw
    } = req.body;

    const { username } = req.session.user;

    if (!pw){
      return res.status(400).json({ error: 'You must enter your password to change usernames' });
    }
    if (!newUsername){
      return res.status(400).json({ error: 'Missing new username.' });
    }
    if (username === newUsername){
      return res.status(400).json({ error: 'Your new username cannot be your old username!' });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User could not be found' });

    if (! await user.comparePassword(pw)){
      return res.status(401).json({ error: 'Current password is incorrect, please try again' });
    }

    const existing = await User.findOne({ username: newUsername });
    if (existing) {
      return res.status(409).json({ error: 'New username is already taken!' });
    }

    // update session token for the user
    req.session.user.username = newUsername;

    // Save new username
    user.username = newUsername;
    await user.save();

    res.json({ success: true, message: 'Username successfully changed' });

  }catch (err){
    console.error('Email change error:', err);
    res.status(500).json({ error: 'Server error during username change, please try again' });
  }

});


// /api/change-email
router.post('/change-email', requireLogin, async (req, res) => {
  try{
    
    const {
      newEmail,
      pw
    } = req.body;

    const { username } = req.session.user;

    if (!pw){
      return res.status(400).json({ error: 'You must enter your password to change your email' });
    }
    if (!newEmail){
      return res.status(400).json({ error: 'Missing new email.' });
    }

    if (!utils.validEmail(newEmail)){
      return res.status(400).json({ error: 'Invalid email format' });
    }


    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User could not be found' });

    const currEmail = user.email;

    if (currEmail === newEmail){
      return res.status(400).json({ error: 'Your new email cannot be your old email!' });
    }

    if (! await user.comparePassword(pw)){
      return res.status(401).json({ error: 'Current password is incorrect, please try again' });
    }

    const existing = await User.findOne({ email: newEmail });
    if (existing) {
      return res.status(409).json({ error: 'This email is already in use!' });
    }

    // Save new email
    user.email = newEmail;
    await user.save();

    res.json({ success: true, message: 'Email successfully changed' });

  }catch (err){
    console.error('Email change error:', err);
    res.status(500).json({ error: 'Server error during Email change, please try again' });
  }

});

// /api/delete-account
router.post('/delete-account', requireLogin, async (req, res) => {
  try{
    
    const { pw } = req.body;
    const { username } = req.session.user;
 
    if (!pw){
      return res.status(400).json({ error: 'Password required for account deletion' });
    }

    const user = await User.findById(req.session.user._id);
    if (!user){
        return res.status(400).json({ error: 'You are not logged in!' });
    }
    if (!await user.comparePassword(pw)) {
        return res.status(401).json({ error: 'Password incorrect.' });
    }

    if (utils.isAdmin(req.session)){
      return res.status(401).json({ error: 'Cannot delete admin account!' });
    }

    await utils.deleteUser(user);

    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ error: 'Account deleted, but session could not be destroyed. Please clear cookies manually.' });
      }
      res.json({ success: true, message: `User '${username}' deleted successfully.` });
    });

  }catch (err){
    console.error('Account deletion error:', err);
    res.status(500).json({ error: 'Server error during account deletion, please try again' });
  }

});


// /api/update-profile
router.post('/update-profile', requireLogin, async (req, res)=>{
  try {
      const {
        gender,
        school,
        major,
        year,
        dietaryRestrictions,
        favouriteCuisines,
        bio,
        pfp_url
      } = req.body;

    const user = await User.findById(req.session.user._id);
    if (!user) return res.status(404).json({ error: 'User could not be found' });


    // TODO: Do more input checks for this route
    // to prevent malicious inputs  

    if (gender) user.gender = gender;
    if (school) user.school = school;
    if (major) user.major = major;
    if (typeof year === 'number' && Number.isInteger(year)) user.year = year;
    if (Array.isArray(dietaryRestrictions)) user.dietaryRestrictions = dietaryRestrictions;
    if (Array.isArray(favouriteCuisines)) user.favouriteCuisines = favouriteCuisines;
    if (typeof bio === 'string') user.bio = bio;
    if (pfp_url && typeof pfp_url === 'string' && pfp_url.length < 500) {
      user.pfp_url = pfp_url;
    };

    await user.save();

    res.json({ success: true, message: 'Profile successfully updated' });

  
  } catch (err){
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Server error during profile update, please try again' });
  }
});

// /api/fetch-profile
router.get('/api/fetch-profile', requireLogin, async (req, res) => {
  try{
    const { username } = req.query;
    if (! username){
      return res.status(400).json({ error: 'No username specified' });
    }

      const requestingUser = await User.findById(req.session.user._id);
      const requestedUser = await User.findOne({ username });

      if (!requestedUser) {
        return res.status(404).json({ error: 'User could not be found.' });
      }

      if (requestedUser.isAdmin && !requestingUser.isAdmin) {
        return res.status(403).json({ error: 'Access denied to this profile' });
      }

      const userProfile = {
        username: requestedUser.username,
        email: requestedUser.email,
        gender: requestedUser.gender,
        school: requestedUser.school,
        major: requestedUser.major,
        year: requestedUser.year,
        dietaryRestrictions: requestedUser.dietaryRestrictions,
        favouriteCuisines: requestedUser.favouriteCuisines,
        bio: requestedUser.bio,
        pfp_url: requestedUser.pfp_url
      };

    res.json({ success: true, profile: userProfile });
  } catch (err){
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Server error during profile fetching' });
  }
});


// /api/new-hangout
router.post('/new-hangout', requireLogin, async (req, res)=>{
  try {
      const {
        name = 'new hangout',
        capacity,
        location,
        hangoutStartTime,
        hangoutEndTime,
        description = '',
        tags = [],
        genderRestriction = 'any',
        inviteOnly = false
      } = req.body;


      if (!capacity || !location || !hangoutStartTime || !hangoutEndTime) {
        return res.status(400).json({ error: 'Missing required fields.' });
      }
      
      if (!mongoose.Types.ObjectId.isValid(req.session.user._id)) {
        return res.status(400).json({ error: 'Invalid user ID in session.' });
      }


      const newHangout = new Hangout({
        name,
        host: req.session.user._id,
        participants: [req.session.user._id],
        capacity,
        location,
        hangoutStartTime: new Date(hangoutStartTime),
        hangoutEndTime: new Date(hangoutEndTime),
        description,
        tags,
        genderRestriction,
        inviteOnly
      });

    await newHangout.save();
    res.json({ success: true, message: 'New hangout created!' });

  
  } catch (err){
    console.error('Hangout creation error:', err);
    res.status(500).json({ error: 'Server error during hangout creation, please try again' });
  }
});


// /api/join-hangout
router.post('/join-hangout', requireLogin, async (req, res) => {
  try{
    const{ hangoutId } = req.body;
    const userId = req.session.user._id;

    if (!hangoutId){
      return res.status(400).json({ error: 'Missing hangout id!' });
    }

    const hangout = await Hangout.findById(hangoutId);
    if (!hangout) {
    return res.status(404).json({ success: false, error: 'Hangout not found' });
    }
    if (hangout.inviteOnly){
      const result = await utils.makeHangoutRequest(userId, hangoutId);
      return res.status(result.status || 200).json(result);
    }else {
      const result = await utils.joinHangout(userId, hangoutId);
      return res.status(result.status || 200).json(result);
    }

  }catch (err){
    console.error('Hangout join error:', err);
    res.status(500).json({ error: 'Server error during hangout joining, please try again' });
  }
})


router.post('/answer-request', requireLogin, async (req, res) => {
  try {
    const { hangoutReqId, accepted } = req.body;
    const userId = req.session.user._id;

    if (!hangoutReqId || typeof accepted === 'undefined') {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const hangoutRequest = await HangoutReq.findById(hangoutReqId);
    if (!hangoutRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const hangoutId = hangoutRequest.hangout.toString();
    const requestingUserId = hangoutRequest.requestingUser.toString();

    const hangout = await Hangout.findById(hangoutId);
    if (!hangout) {
      return res.status(404).json({ error: 'Hangout not found' });
    }

    if (hangout.host.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'You are not the host of this hangout' });
    }

    if (accepted) {
      const result = await utils.joinHangout(requestingUserId, hangoutId);
      return res.status(result.status || 200).json(result);
    } else {
      await HangoutReq.deleteOne({ _id: hangoutReqId });
      return res.status(200).json({ success: true, message: 'Request rejected' });
    }
  } catch (err) {
    console.error('Hangout request management error:', err);
    res.status(500).json({ error: 'Server error during Hangout request management, please try again' });
  }
});


  
module.exports = router;
