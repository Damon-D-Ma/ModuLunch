const express = require('express');
const router = express.Router();
const User = require('../models/User');
const requireLogin = require('../middleware/requireLogin');
const requireAdmin = require('../middleware/requireAdmin');


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



module.exports = router;
