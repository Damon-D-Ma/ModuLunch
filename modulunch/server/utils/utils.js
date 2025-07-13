const bcrypt = require('bcryptjs'); // for user auth
const User = require('../models/User');
const Hangout = require('../models/Hangout');
const HangoutReq = require('../models/HangoutReq');


function validEmail(email){
    return /^\S+@\S+\.\S+$/.test(email);
}


async function hashPw(pwString){
    return await bcrypt.hash(pwString, 10);
}


function isAdmin(session){
  if (!session.user) return false;
  return session.user.isAdmin;
}


async function deleteUser(userToDelete){
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

}

// In case the hangout someone wants to join is invite-only, helper function to generate
// a request
async function makeHangoutRequest(userId, hangoutId){
    if (!userId || !hangoutId) {
        throw new Error('Missing user ID or hangout ID');
    }

    const hangout = await Hangout.findById(hangoutId);
    if (!hangout) {
        return { success: false, status: 404, error: 'Hangout not found' };
    }

    if (hangout.participants.includes(userId)) {
        return { success: false, status: 400, error: 'You are already part of this hangout' };
    }

    const existingReq = await HangoutReq.findOne({ hangout: hangoutId, requestingUser: userId });
    if (existingReq) {
        return { success: false, status: 400, error: 'You have already made a request for this hangout' };
    }
    const request = new HangoutReq({ requestingUser: userId, hangout: hangoutId });
    await request.save();

    return { success: true, joined: false, message: 'Hangout request sent' };
}



module.exports = {
    validEmail,
    hashPw,
    isAdmin,
    deleteUser,
    makeHangoutRequest,
};
