const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';



// GET /api/hello
router.post('/login', async (req, res) => {
  const { username, pw } = req.body;
  try {
    // check if the user exists first
    const user = await User.findOne({username});
    if (!user) return res.status(401).json({ error: 'Invalid credentials, try again' });

    //if the username exists, check the password (hash)
    const correctPw  = await user.comparePassword(pw);
    if (!correctPw) return res.status(401).json({ error: 'Invalid credentials, try again' });


    // everything ok, sign a JWT for authentication
    const token = jwt.sign(
            { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ success: true, token });



  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login, please try again!' });
  }
});

module.exports = router;
