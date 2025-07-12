const express = require('express');
const router = express.Router();
const User = require('../models/User');
const requireLogin = require('../middleware/requireLogin');
const requireAdmin = require('../middleware/requireAdmin');
const bcrypt = require('bcryptjs'); // for user auth


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

    const pwHash = await bcrypt.hash(pw, 10);

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
    const newPwHash = await bcrypt.hash(newPw, 10);
    user.pw = newPwHash;
    await user.save();

    res.json({ success: true, message: 'Password successfully changed' });

  }catch (err){
    console.error('Password change error:', err);
    res.status(500).json({ error: 'Server error during password change, please try again' });
  }

});


module.exports = router;
