var oauth2orize = require('oauth2orize');
var uuid = require('uuid/v4');

var User = require('../models/user');
var Client = require('../models/client');
var Token = require('../models/token');
var Code = require('../models/code');

var server = oauth2orize.createServer();

server.serializeClient(function (client, callback) {
  return callback(null, client._id);
});

server.deserializeClient(function (id, callback) {
  Client.findOne({
    _id: id
  }, (error, client) => {
    if (error) return callback(error);
    return callback(null, client);
  });
});

server.grant(oauth2orize.grant.code(function (client, redirectUri, user, ares, callback) {
  let code = new Code({
    value: uuid(),
    clientId: client._id,
    redirectUri: redirectUri,
    userId: user._id
  });

  code.save((error) => {
    if (error) return callback(error);
    callback(null, code.value);
  });
}));

server.exchange(oauth2orize.exchange.code(function (client, code, redirectUri, callback) {
  Code.findOne({
    value: code
  }, (error, authCode) => {
    if (error) return callback(error);
    if (authCode === undefined) return callback(null, false);
    if (client._id.toString() !== authCode.clientId) return callback(null, false);
    if (redirectUri !== authCode.redirectUri) return callback(null, false);

    authCode.remove((error) => {
      if (error) return callback(error);

      let token = new Token({
        value: uuid(),
        clientId: authCode.clientId,
        userId: authCode.userId
      });

      token.save((error) => {
        if (error) return callback(error);
        callback(null, token);
      });
    });
  });
}));

exports.authorization = [
  server.authorization(function (clientId, redirectUri, callback) {
    Client.findOne({
      id: clientId
    }, (error, client) => {
      if (error) return callback(error);
      return callback(null, client, redirectUri);
    });
  }),
  function (req, res) {
    res.render('dialog', {
      transactionID: req.oauth2.transactionID,
      user: req.user,
      client: req.oauth2.client
    });
  }
];

exports.decision = [
  server.decision()
];

exports.token = [
  server.token(),
  server.errorHandler()
];
