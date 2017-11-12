const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.pre('save', function (callback) {
  let user = this;

  if (!user.isModified('password')) return callback();

  bcrypt.genSalt(5, (error, salt) => {
    if (error) return callback(error);

    bcrypt.hash(user.password, salt, null, (error, hash) => {
      if (error) return callback(error);
      user.password = hash;
      callback();
    });
  });
});

UserSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (error, isMatch) => {
    if (error) return cb(error);
    cb(null, isMatch);
  });
}

module.exports = mongoose.model('User', UserSchema);
