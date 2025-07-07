const mongoose = require('mongoose');


const hangoutReqSchema = new mongoose.Schema({
  requestingUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestDate: {type: Date, required: true, default: Date.now},
  hangout: { type: mongoose.Schema.Types.ObjectId, ref: 'Hangout', required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
});

  // TODO: Make a pre-save hook, where if the hangout not inviteOnly and within capacity then auto-add the user to the hangout


const HangoutReq = mongoose.model('HangoutReq', hangoutReqSchema);

module.exports = HangoutReq;