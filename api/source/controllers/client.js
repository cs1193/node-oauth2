const Client = require('../models/client');

exports.postClients = (req, res) => {
  var client = new Client();

  client.name = req.body.name;
  client.id = req.body.id;
  client.secret = req.body.secret;
  client.userId = req.user._id;

  client.save((error) => {
    if (error) res.send(error);
    res.json({
      message: 'Client added to the locker!',
      data: client
    });
  });
}

exports.getClients = (req, res) => {
  Client.find({
    userId: req.user._id
  }, (error, clients) => {
    if (error) res.send(error);
    res.json(clients);
  })
}
