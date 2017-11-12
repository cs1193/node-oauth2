const User = require('../models/user');

exports.postUsers = (req, res) => {
  let user = new User({
    username: req.body.username,
    password: req.body.password
  });

  user.save((error, user) => {
    if (error) res.send(error);
    res.json({
      message: 'New beer drinker added to the locker room!',
      data: user
    });
  });
}

exports.getUsers = (req, res) => {
  User.find((error, users) => {
    if (error) res.send(error);
    res.json(users);
  });
}
