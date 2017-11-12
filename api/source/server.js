const ejs = require('ejs');
const path = require('path');
const helmet = require('helmet');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const beerController = require('./controllers/beer');
const userController = require('./controllers/user');
const clientController = require('./controllers/client');
const oauth2Controller = require('./controllers/oauth2');

const authenticationMiddleware = require('./middleware/authentication');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(passport.initialize());
app.use(helmet.xssFilter());
app.use(helmet.hsts({
  maxAge: 7776000000,
  includeSubdomains: true
}));
app.use(helmet.hidePoweredBy({
  setTo: 'OAuth 2'
}));

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: process.env.SECRET_KEY,
  saveUninitialized: true,
  resave: true
}));

const PORT = process.env.PORT || 3000;

mongoose.connect(`mongodb://${process.env.DATASTORE_HOST}:${process.env.DATASTORE_PORT}/${process.env.DATASTORE_NAME}`);

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'You are running dangerously low on beer!'
  });
});

router.route('/beers')
  .post(authenticationMiddleware.isAuthenticated, beerController.postBeers)
  .get(authenticationMiddleware.isAuthenticated, beerController.getBeers);

router.route('/beer/:beer_id')
  .get(authenticationMiddleware.isAuthenticated, beerController.getBeer)
  .put(authenticationMiddleware.isAuthenticated, beerController.putBeer)
  .delete(authenticationMiddleware.isAuthenticated, beerController.deleteBeer);

router.route('/users')
  .post(userController.postUsers)
  .get(authenticationMiddleware.isAuthenticated, userController.getUsers);

router.route('/clients')
  .post(authenticationMiddleware.isAuthenticated, clientController.postClients)
  .get(authenticationMiddleware.isAuthenticated, clientController.getClients);

router.route('/oauth2/authorize')
  .get(authenticationMiddleware.isAuthenticated, oauth2Controller.authorization)
  .post(authenticationMiddleware.isAuthenticated, oauth2Controller.decision);

router.route('/oauth2/token')
  .post(authenticationMiddleware.isClientAuthenticated, oauth2Controller.token);

app.use('/api', router);

app.listen(PORT)
