const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Hangout = require('../models/Hangout');
const HangoutReq = require('../models/HangoutReq');

const requireAdmin = require('../middleware/requireAdmin');



// /admin/delete-user
router.post('/delete-user', requireAdmin, async (req, res) => {

  const {
    username,
    adminPw
  } = req.body;

  if (!username){
    return res.status(400).json({ error: 'Missing username of account to delete' });
  }
  if (!adminPw){
    return res.status(400).json({ error: 'Password required to delete user' });
  }

  try{
    const admin = await User.findById(req.session.user._id);
    if (!admin){
        return res.status(400).json({ error: 'You are not logged in as admin' });
    }
    const pwCorrect = await admin.comparePassword(adminPw);
    if (!pwCorrect) {
        return res.status(401).json({ error: 'Admin password incorrect.' });
    }
    
   
    const userToDelete = await User.findOne({ username });
    if (!userToDelete){
      return res.status(404).json({ error: 'Username could not be found.' });
    }

    if (userToDelete.isAdmin){
      return res.status(400).json({ error: 'You cannot delete an admin account!' });
    }
    
    //delete all hangouts hosted by the user
    const hostedHangouts = await Hangout.find({ host: userToDelete._id });
    const hostedHangoutIds = hostedHangouts.map(h => h._id);

    await Hangout.deleteMany({ host: userToDelete._id });

    // remove all hangouts that the user has joined (but is not hosting)
    await Hangout.updateMany(
      { participants: userToDelete._id },
      { $pull: { participants: userToDelete._id } }
    );

    // delete ALL hangout requests that involve this user in any way
    await HangoutReq.deleteMany({
      $or: [
        { requestingUser: userToDelete._id },
        { hangout: { $in: hostedHangoutIds } }
      ]
    });


    // If the user is still logged in for whatever reason, delete their session token
    const mongoClient = require('mongoose').connection.getClient();
    const sessionCollection = mongoClient.db().collection('sessions');

    // Remove all sessions where the user._id matches (stored as JSON string)
    await sessionCollection.deleteMany({
    'session': { $regex: userToDelete._id.toString() }
    });



    // Done cleaning up, we can remove the user from the db now
    await User.deleteOne({ _id: userToDelete._id });

    res.json({ success: true, message: `User '${username}' deleted successfully.` });

  }catch (err){
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Server error while deleting user (admin).' });
  }

});

module.exports = router;
