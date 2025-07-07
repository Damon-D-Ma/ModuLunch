const mongoose = require('mongoose');


const hangoutSchema = new mongoose.Schema({
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    capacity: {type: Number},
    location: {type: String, required: true},
    timeCreated: {type: Date, required: true, default: Date.now},
    hangoutStartTime: {type: Date, required: true},
    hangoutEndTime: {type: Date, required: true},
    description: {type: String, required: false, default: ''},
    tags: {type: [String], default: [], required: false}, // should be things like food types (e.g. "Chinese", "Italian") or other special conditions (e.g. "outdoor", "porluck", etc.)
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    duration: {
        hours: { type: Number, min: 0 },
        minutes: { type: Number, min: 0, max: 59 }
    },
    genderRestriction: { type: String, enum: ['any', 'male-only', 'female-only'], default: 'any' },


});


// Auto generate the event duration with a pre-save hook
hangoutSchema.pre('save', function(next) {
  if (this.hangoutStartTime && this.hangoutEndTime) {
    const diffMs = this.hangoutEndTime - this.hangoutStartTime;
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    this.duration = {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60
    };
  }
  next();
});



const Hangout = mongoose.model('Hangout', hangoutSchema);

module.exports = Hangout;