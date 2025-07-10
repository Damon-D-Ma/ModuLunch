const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Hangout = require('../models/Hangout');
const HangoutReq = require('../models/HangoutReq');

// GET /debug/3ddc3ee497ddc1db
router.get('/3ddc3ee497ddc1db', async (req, res) => {
  try {
    const adminUser = await User.findOne({ isAdmin: true });

    if (!adminUser) {
      return res.json({
        success: false,
        message: 'ERROR: Could not find admin user',
      });
    }

    const adminInfo = adminUser.toObject();
    delete adminInfo.pw;

    const testHangout = await Hangout.findOne({
      name: 'ADMINTESTHANGOUT',
      host: adminUser._id,
    }).lean();

    const testHangoutReq = await HangoutReq.findOne({
      requestingUser: adminUser._id,
      hangout: testHangout?._id,
    }).lean();

    res.json({
      success: true,
      message: 'Admin user with test data',
      admin: adminInfo,
      testHangout,
      testHangoutReq,
    });

  } catch (err) {
    console.error('Error in debug admin route:', err);
    res.status(500).json({ error: 'Issue with debug admin route' });
  }
});

module.exports = router;
