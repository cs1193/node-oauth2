const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const DigestStrategy = require('passport-http').DigestStrategy;

const User = require('../models/user');
const Client = require('../models/client');
const Token = require('../models/token');

passport.use(new BasicStrategy(function (username, password, callback) {
  User.findOne({
    username: username
  }, (error, user) => {
    if (error) return callback(error);
    if (!user) return callback(null, false);

    user.verifyPassword(password, (error, isMatch) => {
      if (error) return callback(error);
      if (!isMatch) return callback(null, false);
      return callback(null, user);
    });
  });
}));

passport.use(new DigestStrategy({
  'qop': 'auth'
}, function (username, callback) {
  User.findOne({
    username: username
  }, (error, user) => {
    if (error) return callback(error);
    if (!user) return callback(null, false);
    return callback(null, user, user.password);
  });
}, function (params, callback) {
  callback(null, true);
}));

exports.isAuthenticated = passport.authenticate(['digest', 'bearer'], {
  session: false
});

passport.use('client-basic', new BasicStrategy(function (username, password, callback) {
  Client.findOne({
    id: username
  }, (error, client) => {
    if (error) return callback(error);
    if (!client || client.secret !== password) return callback(null, false);
    return callback(null, client);
  })
}));

exports.isClientAuthenticated = passport.authenticate('client-basic', {
  session: false
});

passport.use(new BearerStrategy(function (accessToken, callback) {
  Token.findOne({
    value: accessToken
  }, (error, token) => {
    if (error) return callback(error);
    if (!token) return callback(null, false);
    User.findOne({
      _id: token.userId
    }, (error, user) => {
      if (error) return callback(error);
      if (!user) return callback(null, false);
      callback(null, user, { scope: '*' });
    });
  });
}));

exports.isBearerAuthenticated = passport.authenticate('bearer', {
  session: false
});
