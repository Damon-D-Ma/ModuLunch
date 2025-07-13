const bcrypt = require('bcryptjs'); // for user auth


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



module.exports = {
    validEmail,
    hashPw,
    isAdmin
};
