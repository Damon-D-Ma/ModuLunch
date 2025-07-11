const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // for user auth

const userSchema = new mongoose.Schema({
    username: {type: String, required:true, unique: true},
    pw: {type: String, required:true}, // STORES THE PW HASH NOT THE ACTUAL PW
    email: {type: String, required:true, unique: true},
    isAdmin: {type: Boolean, default: false, required:true},

    gender: {type: String, required:true},
    school: {type: String, required:true},
    major: {type: String, required:true},
    year: {type: Number, required:true},
    dietaryRestrictions: {type: [String], default: [], required:false},
    favouriteCuisines: {type: [String], default: [], required: false},
    bio: { type: String, default: '', required: false },
    pfp_url: { type:String, default: "no_pfp.png", required: false}
});

// For login authentication (model only steals pw hashes)
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.pw);
};


const User = mongoose.model('User', userSchema);

module.exports = User;