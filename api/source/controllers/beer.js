const Beer = require('../models/beer');

// POST: /api/beers
exports.postBeers = (req, res) => {
  let beer = new Beer();

  beer.name = req.body.name;
  beer.type = req.body.type;
  beer.quantity = req.body.quantity;
  beer.userId = req.user._id;

  beer.save((error) => {
    if (error) res.send(error);
    res.json({
      message: 'Beer added to the locker!',
      data: beer
    });
  });
};

exports.getBeers = (req, res) => {
  Beer.find({
    userId: req.user._id
  }, (error, beers) => {
    if (error) res.send(error);
    res.json(beers);
  });
};

exports.getBeer = (req, res) => {
  Beer.find({
    userId: req.user._id,
    _id: req.params.beer_id
  }, (error, beer) => {
    if (error) res.send(error);
    res.json(beer);
  });
};

exports.putBeer = (req, res) => {
  Beer.update({
    userId: req.user._id,
    _id: req.params.beer_id
  }, {
    quantity: req.body.quantity
  }, (error, beer) => {
    if (error) res.send(error);
    beer.quantity = req.body.quantity;
    beer.save((error) => {
      if (error) res.send(error);
      res.json(beer);
    });
  });
};

exports.deleteBeer = (req, res) => {
  Beer.remove({
    userId: req.user._id,
    _id: req.params.beer_id
  }, (error) => {
    if (error) res.send(error);
    res.json({
      message: 'Beer removed from the locker!'
    });
  });
}
